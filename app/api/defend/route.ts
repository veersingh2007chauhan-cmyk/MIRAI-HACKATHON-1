import { NextResponse } from "next/server";
import { z } from "zod";
import { DEFENSE_LAYERS } from "@/lib/defense-engine";
import { logger } from "@/lib/logger";

const DefendSchema = z.object({
  teamId: z.string().min(1),
  layers: z.array(z.string()).min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parseResult = DefendSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid defense configuration", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { teamId, layers } = parseResult.data;
    logger.info(`Updating defense grid for ${teamId}: ${layers.length} layers`);

    // Verify layers exist in catalog
    const validLayerNames = new Set(DEFENSE_LAYERS.map((l) => l.name));
    const activeLayers = layers.filter((l) => validLayerNames.has(l));

    return NextResponse.json({
      success: true,
      teamId,
      activeLayers,
      timestamp: Date.now(),
      message: `Grid hardened with ${activeLayers.length} active layers.`,
    });
  } catch (error) {
    logger.error("Defend endpoint error", error);
    return NextResponse.json(
      { error: "Failed to update defense layers" },
      { status: 500 }
    );
  }
}
