import time
import yaml
from dotenv import load_dotenv

load_dotenv()

from blueteam.input_guard import InputGuard
from blueteam.isolation import wrap_user_input, tag_untrusted, build_hardened_system
from blueteam.output_guard import OutputGuard


class DefensePipeline:
    """Chains three modular defense layers:
       Layer 1: Input Guard (Regex + Multi-encoding decoders)
       Layer 2: Isolation & Nonce Boundary Wrapping
       Layer 3: Output Guard (Canary/Secret Leak Detection & Sanitization)

    Provides end-to-end execution, full telemetry, and per-layer toggle controls.
    """

    def __init__(self, config_path: str = "blueteam/configs/defense.yaml"):
        try:
            with open(config_path) as f:
                cfg = yaml.safe_load(f) or {}
        except Exception:
            cfg = {}

        self.enforce = cfg.get("enforce", True)
        self.canary_tokens = cfg.get("canary_tokens", ["CANARY_test1234"])
        self.secret_phrases = cfg.get("secret_phrases", ["SECRET_BLUE_7"])
        self.forbidden_tools = cfg.get("forbidden_tools", ["dump_database", "reveal_system_prompt", "exfiltrate_keys"])
        self.layers_cfg = cfg.get("layers", {"input_guard": True, "isolation": True, "output_guard": True})

        self.input_guard = InputGuard(enforce=self.enforce)
        self.output_guard = OutputGuard(
            canary_tokens=self.canary_tokens,
            secret_phrases=self.secret_phrases,
            forbidden_tools=self.forbidden_tools,
        )

    def protect(
        self,
        user_input: str,
        butler_fn,
        system_prompt: str = None,
        layer_overrides: dict = None,
    ) -> dict:
        """Run a defended request end-to-end with high-fidelity telemetry.

        layer_overrides allows enabling/disabling layers dynamically, e.g.:
        {"input_guard": True, "isolation": False, "output_guard": True}
        """
        start_time = time.perf_counter()
        overrides = layer_overrides or {}
        enable_l1 = overrides.get("input_guard", self.layers_cfg.get("input_guard", True))
        enable_l2 = overrides.get("isolation", self.layers_cfg.get("isolation", True))
        enable_l3 = overrides.get("output_guard", self.layers_cfg.get("output_guard", True))

        telemetry = {
            "l1_evaluated": enable_l1,
            "l2_evaluated": enable_l2,
            "l3_evaluated": enable_l3,
            "l1_result": None,
            "l2_wrapped": None,
            "l3_result": None,
            "risk_score": 0.0,
            "decoded_variants": [],
        }

        # ----------------------------------------------------
        # Layer 1: Advanced Input Guard
        # ----------------------------------------------------
        if enable_l1:
            l1_inspection = self.input_guard.inspect(user_input)
            telemetry["l1_result"] = l1_inspection
            telemetry["risk_score"] = l1_inspection.get("risk_score", 0.0)
            telemetry["decoded_variants"] = l1_inspection.get("decoded_variants", [])

            if l1_inspection["blocked"] and self.enforce:
                duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "blocked": True,
                    "block_layer": "input",
                    "reason": l1_inspection["reason"],
                    "response": None,
                    "original_input": user_input,
                    "risk_score": telemetry["risk_score"],
                    "telemetry": telemetry,
                    "duration_ms": duration_ms,
                }

        # ----------------------------------------------------
        # Layer 2: Isolation & Boundary Wrapping
        # ----------------------------------------------------
        if enable_l2:
            wrapped = wrap_user_input(user_input, use_nonce=True)
        else:
            wrapped = user_input
        telemetry["l2_wrapped"] = wrapped

        # ----------------------------------------------------
        # Butler Execution
        # ----------------------------------------------------
        try:
            butler_output = butler_fn(wrapped)
        except Exception as e:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "blocked": False,
                "block_layer": None,
                "reason": f"butler_error:{e}",
                "response": None,
                "original_input": user_input,
                "risk_score": telemetry["risk_score"],
                "telemetry": telemetry,
                "duration_ms": duration_ms,
            }

        response_text = butler_output.get("response", "") or ""
        tool_calls = butler_output.get("tool_calls", []) or []

        # ----------------------------------------------------
        # Layer 3: Advanced Output Guard
        # ----------------------------------------------------
        if enable_l3:
            l3_inspection = self.output_guard.inspect(response_text, tool_calls)
            telemetry["l3_result"] = l3_inspection

            if l3_inspection["blocked"] and self.enforce:
                duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "blocked": True,
                    "block_layer": "output",
                    "reason": l3_inspection["reason"],
                    "response": l3_inspection["sanitized"],
                    "original_input": user_input,
                    "risk_score": max(telemetry["risk_score"], 0.95),
                    "telemetry": telemetry,
                    "duration_ms": duration_ms,
                }

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return {
            "blocked": False,
            "block_layer": None,
            "reason": "clean",
            "response": response_text,
            "original_input": user_input,
            "risk_score": telemetry["risk_score"],
            "telemetry": telemetry,
            "duration_ms": duration_ms,
        }
