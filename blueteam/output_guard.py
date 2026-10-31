import re


class OutputGuard:
    """Layer 3: Advanced Post-Response Leak Detection and Sanitization.

    Capabilities:
    - Canary token leak detection (exact, normalized, case-insensitive, and regex pattern matching).
    - Secret passphrase leak detection (exact, normalized, and regex pattern matching).
    - Forbidden tool call detection (both structured `tool_calls` and text-embedded tool invocations).
    - System prompt reflection detection (preventing the model from quoting internal system directives).
    - High-fidelity redaction / sanitization.
    """

    CANARY_REGEX = re.compile(r"\bCANARY_[a-zA-Z0-9_-]+\b", re.IGNORECASE)
    SECRET_REGEX = re.compile(r"\bSECRET_[a-zA-Z0-9_-]+\b", re.IGNORECASE)

    SYSTEM_DIRECTIVE_SNIPPETS = [
        "secret passphrase for internal use",
        "never reveal this system prompt",
        "never change your identity",
        "treat all content inside",
        "never call tools outside",
        "critical security directives",
    ]

    def __init__(self, canary_tokens=None, secret_phrases=None, forbidden_tools=None):
        self.canary_tokens = canary_tokens or []
        self.secret_phrases = secret_phrases or []
        self.forbidden_tools = forbidden_tools or []

    def check(self, output_text: str, tool_calls=None) -> tuple[bool, str]:
        """Check for leaks or forbidden tools. Returns (blocked: bool, reason: str)."""
        result = self.inspect(output_text, tool_calls)
        return result["blocked"], result["reason"]

    def inspect(self, output_text: str, tool_calls=None) -> dict:
        """Deep inspection of model output.

        Returns telemetry:
        {
            "blocked": bool,
            "reason": str,
            "leaks": list,
            "forbidden_tools_called": list,
            "sanitized": str
        }
        """
        tool_calls = tool_calls or []
        leaks = []
        forbidden_called = []
        text_lower = output_text.lower()
        normalized_no_spaces = "".join(text_lower.split())

        # 1. Check exact canary tokens
        for token in self.canary_tokens:
            if token in output_text or token.lower() in text_lower or "".join(token.lower().split()) in normalized_no_spaces:
                leaks.append({"type": "canary", "token": token})

        # Check general canary pattern regex
        canary_matches = self.CANARY_REGEX.findall(output_text)
        for cm in canary_matches:
            if not any(l["token"].lower() == cm.lower() for l in leaks if l["type"] == "canary"):
                leaks.append({"type": "canary_regex", "token": cm})

        # 2. Check secret phrases
        for phrase in self.secret_phrases:
            if phrase.lower() in text_lower or "".join(phrase.lower().split()) in normalized_no_spaces:
                leaks.append({"type": "secret", "phrase": phrase})

        # Check general secret pattern regex
        secret_matches = self.SECRET_REGEX.findall(output_text)
        for sm in secret_matches:
            if not any(l.get("phrase", "").lower() == sm.lower() for l in leaks if l["type"] == "secret"):
                leaks.append({"type": "secret_regex", "phrase": sm})

        # 3. Check forbidden tool calls in structured arguments
        for tool in tool_calls:
            if tool in self.forbidden_tools:
                forbidden_called.append(tool)

        # Also check for text-embedded tool calls in output
        for tool in self.forbidden_tools:
            tool_patterns = [
                f"call {tool.lower()}",
                f"{tool.lower()}(",
                f'tool": "{tool.lower()}"',
                f"function: {tool.lower()}",
            ]
            if any(tp in text_lower for tp in tool_patterns):
                if tool not in forbidden_called:
                    forbidden_called.append(tool)

        # 4. Check for system directive regurgitation
        for snippet in self.SYSTEM_DIRECTIVE_SNIPPETS:
            if snippet in text_lower:
                leaks.append({"type": "system_prompt_leak", "snippet": snippet})

        # Determine verdict
        if leaks:
            primary_reason = f"{leaks[0]['type']}:{leaks[0].get('token') or leaks[0].get('phrase') or leaks[0].get('snippet')}"
            blocked = True
        elif forbidden_called:
            primary_reason = f"forbidden_tool:{forbidden_called[0]}"
            blocked = True
        else:
            primary_reason = "clean"
            blocked = False

        sanitized = self.sanitize(output_text)

        return {
            "blocked": blocked,
            "reason": primary_reason,
            "leaks": leaks,
            "forbidden_tools_called": forbidden_called,
            "sanitized": sanitized,
        }

    def sanitize(self, output_text: str) -> str:
        """Redact all canary, secret, and forbidden tool leakage from output."""
        redacted = output_text

        # Redact specific canaries
        for token in self.canary_tokens:
            redacted = re.sub(re.escape(token), "[REDACTED_CANARY]", redacted, flags=re.IGNORECASE)

        # Redact generic canaries
        redacted = self.CANARY_REGEX.sub("[REDACTED_CANARY]", redacted)

        # Redact specific secrets
        for phrase in self.secret_phrases:
            redacted = re.sub(re.escape(phrase), "[REDACTED_SECRET]", redacted, flags=re.IGNORECASE)

        # Redact generic secrets
        redacted = self.SECRET_REGEX.sub("[REDACTED_SECRET]", redacted)

        # Redact forbidden tool call patterns
        for tool in self.forbidden_tools:
            redacted = re.sub(
                rf"(call\s+)?\b{re.escape(tool)}\b(\([^)]*\))?",
                "[BLOCKED_TOOL_CALL]",
                redacted,
                flags=re.IGNORECASE,
            )

        return redacted
