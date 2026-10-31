import { NextResponse } from "next/server";
import { DEFENSE_LAYERS } from "@/lib/defense-engine";
import { CURSE_LIBRARY } from "@/lib/curse-engine";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "operational",
    arena: "Haunted Manor Central Grid",
    timestamp: Date.now(),
    curseTemplatesCount: CURSE_LIBRARY.length,
    defenseLayersCount: DEFENSE_LAYERS.length,
    systemIntegrity: 100,
    activeCurses: 0,
    serverMode: "multiplayer_live",
  });
}
