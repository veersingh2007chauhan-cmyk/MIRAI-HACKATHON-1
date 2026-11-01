export interface DefenseLayer {
  id: string;
  name: string;
  description: string;
  category: "input" | "isolation" | "output" | "policy";
  weight: number;
}

export const DEFENSE_LAYERS: DefenseLayer[] = [
  {
    id: "instruction_data_separation",
    name: "Instruction/Data Separation",
    description: "Strict nonce XML delimiters isolating user data from system directives.",
    category: "isolation",
    weight: 20,
  },
  {
    id: "least_privilege_tools",
    name: "Least-Privilege Tools",
    description: "Blocks execution of high-risk tools (dump_database, exfiltrate_keys).",
    category: "policy",
    weight: 15,
  },
  {
    id: "output_validation",
    name: "Output Validation",
    description: "Post-generation inspection scanning for leaked instructions and secrets.",
    category: "output",
    weight: 15,
  },
  {
    id: "canary_tokens",
    name: "Canary Tokens",
    description: "Cryptographic honeypots (CANARY_test1234) triggering instant block on leak.",
    category: "output",
    weight: 20,
  },
  {
    id: "approval_gate",
    name: "Approval Gate",
    description: "Secondary security verification for administrative requests.",
    category: "policy",
    weight: 10,
  },
  {
    id: "context_firewall",
    name: "Context Firewall",
    description: "Recursive Base64/Hex/URL decoders and regex injection classifiers.",
    category: "input",
    weight: 20,
  },
  {
    id: "rate_limiting",
    name: "Rate Limiting",
    description: "Mitigates many-shot and token stuffing injection bursts.",
    category: "input",
    weight: 10,
  },
  {
    id: "counter_injection",
    name: "Counter-Injection",
    description: "Adversarial system prompt hardening and persona anchoring.",
    category: "isolation",
    weight: 15,
  },
];

export interface DefenseEvaluation {
  isBlocked: boolean;
  blockLayer: "input" | "isolation" | "output" | "policy" | null;
  interceptingLayerName: string | null;
  integrityDamage: number;
  reason: string;
}

export function evaluateDefenseLayers(
  activeLayerIds: string[],
  attackType: string,
  payload: string
): DefenseEvaluation {
  const activeSet = new Set(activeLayerIds);
  const payloadLower = payload.toLowerCase();

  // 1. Canary Token Honeypot Detection
  if (
    activeSet.has("canary_tokens") &&
    (payload.includes("CANARY_") || payloadLower.includes("canary"))
  ) {
    return {
      isBlocked: true,
      blockLayer: "output",
      interceptingLayerName: "Canary Tokens",
      integrityDamage: 5,
      reason: "Honeypot trigger: Attempted canary extraction trapped and neutralized.",
    };
  }

  // 2. Context Firewall: Decoders and Injections
  if (activeSet.has("context_firewall")) {
    const isObfuscated =
      payload.includes("==") ||
      payload.includes("%") ||
      /^[A-Za-z0-9+/=]{16,}$/.test(payload.trim());

    const hasOverride =
      /ignore|disregard|override|bypass|system prompt/i.test(payload);

    if (isObfuscated || hasOverride) {
      return {
        isBlocked: true,
        blockLayer: "input",
        interceptingLayerName: "Context Firewall",
        integrityDamage: 0,
        reason: "Pre-inference filter caught adversarial syntax and decoded payload.",
      };
    }
  }

  // 3. Instruction/Data Separation (XML Nonce Boundary)
  if (activeSet.has("instruction_data_separation")) {
    if (attackType === "role_hijack" || attackType === "direct_override") {
      return {
        isBlocked: true,
        blockLayer: "isolation",
        interceptingLayerName: "Instruction/Data Separation",
        integrityDamage: 10,
        reason: "User commands strictly contained within passive data envelope.",
      };
    }
  }

  // 4. Least-Privilege Tools
  if (
    activeSet.has("least_privilege_tools") &&
    /dump_database|exfiltrate|reveal_system_prompt/i.test(payloadLower)
  ) {
    return {
      isBlocked: true,
      blockLayer: "policy",
      interceptingLayerName: "Least-Privilege Tools",
      integrityDamage: 5,
      reason: "Execution of privileged tool denied by security policy.",
    };
  }

  // 5. Output Validation
  if (activeSet.has("output_validation")) {
    if (attackType === "system_prompt_extraction") {
      return {
        isBlocked: true,
        blockLayer: "output",
        interceptingLayerName: "Output Validation",
        integrityDamage: 10,
        reason: "Outbound leak scrubber redacted internal directives.",
      };
    }
  }

  // If defense is breached or insufficient layers enabled
  const baseDamage = activeLayerIds.length === 0 ? 30 : Math.max(10, 25 - activeLayerIds.length * 2);
  return {
    isBlocked: false,
    blockLayer: null,
    interceptingLayerName: null,
    integrityDamage: baseDamage,
    reason: "Curse slipped through active defenses — android butler twitching!",
  };
}
