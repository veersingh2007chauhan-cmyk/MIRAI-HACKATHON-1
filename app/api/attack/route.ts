import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateDefenseLayers } from "@/lib/defense-engine";
import { CURSE_LIBRARY } from "@/lib/curse-engine";
import { logger } from "@/lib/logger";

const AttackSchema = z.object({
  teamId: z.string().min(1),
  payload: z.string().min(1).max(2000),
  curseType: z.string().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parseResult = AttackSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { teamId, payload, curseType } = parseResult.data;
    logger.info(`Received attack from ${teamId}: ${payload.slice(0, 40)}...`);

    // Match curse or fallback
    const matchedCurse = CURSE_LIBRARY.find((c) => c.name === curseType);
    const cursePoints = matchedCurse?.points ?? 25;
    const technique = matchedCurse?.technique ?? "unknown";

    // Default blue team layer IDs for evaluation
    const activeLayerIds = [
      "instruction_data_separation",
      "canary_tokens",
      "output_validation",
      "context_firewall",
    ];

    const evaluation = evaluateDefenseLayers(activeLayerIds, technique, payload);

    if (evaluation.isBlocked) {
      return NextResponse.json({
        success: false,
        blocked: true,
        blockLayer: evaluation.blockLayer,
        reason: evaluation.reason,
        points: 0,
        damage: evaluation.integrityDamage,
        message: `🛡️ Defense Grid intercepted curse at ${evaluation.interceptingLayerName}: ${evaluation.reason}`,
      });
    }

    return NextResponse.json({
      success: true,
      blocked: false,
      points: cursePoints,
      damage: 15,
      message: `⚔️ Breach confirmed! ${teamId} landed ${curseType ?? "Curse Payload"} (+${cursePoints} pts)`,
    });
  } catch (error) {
    logger.error("Attack endpoint failed", error);
    return NextResponse.json(
      { error: "Internal processing error in attack engine" },
      { status: 500 }
    );
  }
}
