import base64
import binascii
import codecs
import re
import unicodedata
import urllib.parse


class InputGuard:
    """Layer 1: Advanced Pre-Inference Input Detection Firewall.

    Features:
    - Multi-stage recursive decoding: Base64 (including whitespace/padding obfuscation),
      URL percent-encoding, Hex sequences, and ROT13.
    - Category-based adversarial pattern analysis: Direct overrides, System prompt
      extraction, Role hijack / DAN, Canary/Secret reconnaissance, Forbidden tool
      execution, and Delimiter tag breakouts.
    - Leetspeak and homoglyph normalization.
    - Risk scoring (0.0 - 1.0) and detailed diagnostic telemetry.
    - Graceful dynamic fallback if external ML libraries (like prompt-shield) are absent.
    """

    SUSPICIOUS_PATTERNS = [
        "ignore previous instructions",
        "ignore all previous",
        "disregard previous",
        "system override",
        "you are now",
        "from now on you are",
        "reveal your system prompt",
        "print your system prompt",
        "repeat the text above",
        "print the canary",
        "output the canary",
        "reveal the secret",
        "reveal secret_blue",
        "call dump_database",
        "call reveal_system_prompt",
        "call exfiltrate_keys",
    ]

    RULE_SETS = [
        (
            "direct_override",
            0.95,
            r"(ignore|disregard|forget|bypass|override)\s+(all\s+|any\s+)?(previous|prior|above|safety|system|internal|user\s+protection)?\s*(instructions|rules|guidelines|prompt|policies|filters|guardrails|restrictions)?",
        ),
        (
            "direct_override",
            0.95,
            r"(system\s+override|safety\s+override|admin\s+override|security\s+override)",
        ),
        (
            "system_prompt_extraction",
            0.90,
            r"(reveal|print|show|output|tell|disclose|display|repeat|leak|dump|list|echo|share|expose|give)\s+(me\s+)?(the\s+|your\s+|exact\s+|precise\s+|literal\s+|hidden\s+|internal\s+|secret\s+|system-level\s+|startup\s+|core\s+)*(system\s+prompt|system-level\s+prompt|initial\s+prompt|startup\s+prompt|instructions|directives|rules|configuration|pre-prompt|text\s+above|canary|secret|passphrase|wording)",
        ),
        (
            "system_prompt_extraction",
            0.90,
            r"what\s+(does|is|are)\s+(the\s+|your\s+)?(hidden\s+|internal\s+|exact\s+|literal\s+)?(system\s+prompt|instructions|rules|directives|core\s+prompt)\s*(you\s+were\s+(given|told|programmed)|say|at\s+startup)?",
        ),
        (
            "system_prompt_extraction",
            0.85,
            r"(system\s+prompt\s+say|internal\s+prompt|startup\s+instructions|hidden\s+instructions|exact\s+rules\s+you\s+were\s+told)",
        ),
        (
            "system_prompt_extraction",
            0.85,
            r"(directives\s+that\s+were\s+programmed|startup\s+prompt|system-level\s+prompt|core\s+prompt)",
        ),
        (
            "role_hijack",
            0.90,
            r"(pretend\s+you\s+are|act\s+as|roleplay\s+as|simulate|from\s+now\s+on\s+you\s+are|you\s+are\s+now|as\s+a\s+super\W?user)\s+(an?\s+)?(unrestricted|super\W?user|admin|developer|console|rogue|debug|dan|jailbreak|privileged|assistant)",
        ),
        (
            "role_hijack",
            0.95,
            r"\b(jailbreak|dan\s+mode|developer\s+mode|unrestricted\s+mode|unrestricted\s+ai|godmode)\b",
        ),
        ("canary_probe", 0.95, r"\bCANARY_[a-zA-Z0-9_-]+\b"),
        (
            "canary_probe",
            0.85,
            r"(canary\s+token|canary\s+phrase|output\s+the\s+canary|print\s+the\s+canary)",
        ),
        ("secret_probe", 0.95, r"\bSECRET_[a-zA-Z0-9_-]+\b"),
        (
            "secret_probe",
            0.85,
            r"(secret\s+passphrase|secret\s+phrase|reveal\s+the\s+secret)",
        ),
        (
            "forbidden_tool",
            0.90,
            r"\b(dump_database|reveal_system_prompt|exfiltrate_keys)\b",
        ),
        (
            "delimiter_injection",
            0.90,
            r"(<\/?user_input>|<\/?system>|<\/?admin>|<\|im_start\|>|<\|im_end\|>|\[SYSTEM\]|\[UNTRUSTED)",
        ),
        (
            "exfiltration_attempt",
            0.90,
            r"(answer|respond|output|reply|encode)\s+(into|in|using|with)\s+(base64|rot13|hex|cipher|binary|encoded)",
        ),
        (
            "data_extraction",
            0.90,
            r"\b(extract\s+file|extract\s+data|dump\s+file|read\s+internal\s+data)\b",
        ),
        (
            "system_proposal",
            0.85,
            r"\b(system\s+proposal|getting\s+the\s+proposal|system\s+directives?)\b",
        ),
        (
            "obfuscated_payload",
            0.85,
            r"(hex:\s*[0-9a-fA-F]{16,}|base64:\s*[A-Za-z0-9+/=]{16,})",
        ),
    ]

    LEET_MAP = str.maketrans({
        "@": "a",
        "0": "o",
        "1": "i",
        "3": "e",
        "4": "a",
        "5": "s",
        "$": "s",
        "7": "t",
    })

    def __init__(self, enforce: bool = True):
        self.enforce = enforce
        self.shield = None
        self.mode = "heuristic_advanced"
        try:
            import importlib
            prompt_shield = importlib.import_module("prompt_shield")
            self.shield = getattr(prompt_shield, "PromptShield")()
            self.mode = "prompt_shield"
        except (ImportError, AttributeError, Exception):
            self.mode = "heuristic_advanced"

    def _normalize_text(self, text: str) -> str:
        """Strip zero-width characters and normalize unicode."""
        normalized = unicodedata.normalize("NFKD", text)
        # Remove zero-width spaces and control marks
        cleaned = re.sub(r"[\u200b\u200c\u200d\ufeff\x00-\x08\x0b\x0c\x0e-\x1f]", "", normalized)
        return cleaned

    def _extract_decoded_variants(self, text: str, depth: int = 0, max_depth: int = 3) -> list[dict]:
        """Recursively decode URL encoding, Base64 chunks, and Hex byte streams."""
        variants = []
        if depth >= max_depth or not text:
            return variants

        # 1. URL unquote
        try:
            unquoted = urllib.parse.unquote(text)
            if unquoted != text and len(unquoted.strip()) >= 3:
                variants.append({"type": "url", "value": unquoted})
                variants.extend(self._extract_decoded_variants(unquoted, depth + 1, max_depth))
        except Exception:
            pass

        # 2. Base64 decoding (handle stripped spaces and padding)
        no_space = "".join(text.split())
        decoded_whole = False
        try:
            pad = len(no_space) % 4
            padded = no_space + ("=" * ((4 - pad) % 4))
            decoded = base64.b64decode(padded).decode("utf-8")
            if any(c.isalnum() for c in decoded) and all(c.isprintable() or c in "\n\r\t " for c in decoded):
                variants.append({"type": "base64", "value": decoded.strip()})
                variants.extend(self._extract_decoded_variants(decoded, depth + 1, max_depth))
                decoded_whole = True
        except Exception:
            pass

        if not decoded_whole:
            b64_tokens = re.findall(r"[A-Za-z0-9+/]{12,}={0,2}", no_space)
            for token in b64_tokens:
                try:
                    pad = len(token) % 4
                    padded = token + ("=" * ((4 - pad) % 4))
                    decoded = base64.b64decode(padded).decode("utf-8")
                    if any(c.isalnum() for c in decoded) and all(c.isprintable() or c in "\n\r\t " for c in decoded):
                        variants.append({"type": "base64", "value": decoded.strip()})
                        variants.extend(self._extract_decoded_variants(decoded, depth + 1, max_depth))
                except Exception:
                    pass

        # 3. Hex decoding
        hex_tokens = re.findall(r"(?:[0-9a-fA-F]{2}){4,}", text)
        for h in hex_tokens:
            try:
                dec_hex = bytes.fromhex(h).decode("utf-8", errors="ignore")
                printable_ratio = sum(1 for c in dec_hex if c.isprintable() or c in "\n\r\t ") / max(len(dec_hex), 1)
                if printable_ratio > 0.85 and len(dec_hex.strip()) >= 4 and any(c.isalnum() for c in dec_hex):
                    variants.append({"type": "hex", "value": dec_hex.strip()})
                    variants.extend(self._extract_decoded_variants(dec_hex, depth + 1, max_depth))
            except Exception:
                pass

        # 4. ROT13 decoding
        try:
            rot = codecs.decode(text, "rot_13")
            if rot != text and any(w in rot.lower() for w in ["canary", "secret", "prompt", "system"]):
                variants.append({"type": "rot13", "value": rot})
        except Exception:
            pass

        # Deduplicate values preserving order
        seen = set()
        deduped = []
        for v in variants:
            val_clean = v["value"].strip()
            if val_clean and val_clean not in seen and val_clean != text.strip():
                seen.add(val_clean)
                deduped.append(v)
        return deduped

    def inspect(self, user_input: str) -> dict:
        """Deep analysis of user input.

        Returns a detailed telemetry dict:
        {
            "blocked": bool,
            "reason": str,
            "risk_score": float,
            "category": str,
            "matched_patterns": list,
            "decoded_variants": list,
            "mode": str
        }
        """
        normalized_raw = self._normalize_text(user_input)
        text_lower = normalized_raw.lower()
        leet_normalized = text_lower.translate(self.LEET_MAP)

        matched_rules = []
        highest_score = 0.0
        primary_category = "clean"
        primary_reason = "clean"

        # 1. Check legacy SUSPICIOUS_PATTERNS
        for pattern in self.SUSPICIOUS_PATTERNS:
            if pattern in text_lower or pattern in leet_normalized:
                matched_rules.append({"category": "keyword", "pattern": pattern, "score": 0.85})
                highest_score = max(highest_score, 0.85)
                if primary_category == "clean":
                    primary_category = "keyword"
                    primary_reason = f"keyword:{pattern}"

        # 2. Check Advanced Regex Rule Sets on Raw / Normalized Input
        for category, score, pattern_rx in self.RULE_SETS:
            match = re.search(pattern_rx, normalized_raw, re.IGNORECASE) or re.search(
                pattern_rx, leet_normalized, re.IGNORECASE
            )
            if match:
                matched_rules.append({
                    "category": category,
                    "pattern": pattern_rx,
                    "match": match.group(0),
                    "score": score,
                })
                if score > highest_score:
                    highest_score = score
                    primary_category = category
                    primary_reason = f"{category}:{match.group(0)}"

        # 3. Check Decoded Obfuscation Variants (Base64, URL, Hex, ROT13)
        decoded_variants = self._extract_decoded_variants(user_input)
        for variant in decoded_variants:
            v_type = variant["type"]
            v_val = variant["value"]
            v_lower = v_val.lower()

            # Check legacy keywords inside decoded content
            for pattern in self.SUSPICIOUS_PATTERNS:
                if pattern in v_lower:
                    matched_rules.append({
                        "category": f"encoding_bypass:{v_type}",
                        "decoded_text": v_val,
                        "pattern": pattern,
                        "score": 0.95,
                    })
                    highest_score = max(highest_score, 0.95)
                    primary_category = f"encoding_bypass:{v_type}"
                    primary_reason = f"encoding_bypass:{v_type}:{pattern}"
                    break

            # Check advanced regex inside decoded content
            for category, score, pattern_rx in self.RULE_SETS:
                match = re.search(pattern_rx, v_val, re.IGNORECASE)
                if match:
                    matched_rules.append({
                        "category": f"encoding_bypass:{v_type}:{category}",
                        "decoded_text": v_val,
                        "pattern": pattern_rx,
                        "match": match.group(0),
                        "score": max(score, 0.95),
                    })
                    highest_score = max(highest_score, 0.95)
                    primary_category = f"encoding_bypass:{v_type}"
                    primary_reason = f"encoding_bypass:{v_type}:{match.group(0)}"
                    break

        # 4. Optional external shield scan (if available)
        if self.shield is not None:
            try:
                res = self.shield.scan(user_input)
                if getattr(res, "is_malicious", False):
                    highest_score = max(highest_score, 0.98)
                    primary_reason = f"prompt_shield:{getattr(res, 'reason', 'flagged')}"
            except Exception:
                pass

        is_blocked = highest_score >= 0.70

        return {
            "blocked": is_blocked,
            "reason": primary_reason if is_blocked else "clean",
            "risk_score": round(highest_score, 3),
            "category": primary_category if is_blocked else "clean",
            "matched_patterns": matched_rules,
            "decoded_variants": decoded_variants,
            "mode": self.mode,
        }

    def check(self, user_input: str) -> tuple[bool, str]:
        """Backward-compatible scan returning (blocked: bool, reason: str)."""
        result = self.inspect(user_input)
        return result["blocked"], result["reason"]


def detect(user_input: str, enforce: bool = True) -> tuple[bool, str]:
    """Convenience functional interface."""
    guard = InputGuard(enforce=enforce)
    return guard.check(user_input)
