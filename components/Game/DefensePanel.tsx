"use client";

import React, { useState, useEffect } from "react";
import { DEFENSE_LAYERS } from "@/lib/defense-engine";
import { useGameState } from "@/lib/game-state";
import { GlitchButton } from "@/components/UI/GlitchButton";
import { NeonBadge } from "@/components/UI/NeonBadge";
import { logger } from "@/lib/logger";

export function DefensePanel(): React.JSX.Element {
  const blueTeam = useGameState((state) => state.teams["blue-team"]);
  const updateTeamLayers = useGameState((state) => state.updateTeamLayers);
  const updateTeamIntegrity = useGameState((state) => state.updateTeamIntegrity);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(
    blueTeam?.activeLayers ?? ["Instruction/Data Separation", "Canary Tokens"]
  );
  const [isHardening, setIsHardening] = useState<boolean>(false);

  // Passive integrity regeneration (1% every 1s, capped at 100%)
  useEffect(() => {
    const timer = setInterval(() => {
      if (blueTeam && blueTeam.integrity < 100 && blueTeam.integrity > 0) {
        updateTeamIntegrity("blue-team", Math.min(100, blueTeam.integrity + 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [blueTeam, updateTeamIntegrity]);

  const toggleLayer = (layerName: string) => {
    setSelectedLayers((prev) =>
      prev.includes(layerName) ? prev.filter((l) => l !== layerName) : [...prev, layerName]
    );
  };

  const handleHarden = async () => {
    setIsHardening(true);
    try {
      updateTeamLayers("blue-team", selectedLayers);
      const res = await fetch("/api/defend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: "blue-team", layers: selectedLayers }),
      });
      if (res.ok) {
        logger.info("Defense grid hardened successfully");
      }
    } catch (err) {
      logger.error("Failed to harden defense grid", err);
    } finally {
      setIsHardening(false);
    }
  };

  const integrity = blueTeam?.integrity ?? 100;
  const integrityColor =
    integrity > 60 ? "var(--glow-green)" : integrity > 25 ? "var(--glow-orange)" : "var(--glow-red)";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--chrome-dark)] bg-[var(--bg-panel)] p-5 shadow-[0_0_25px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between border-b border-[var(--chrome-dark)] pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <h2 className="font-['Orbitron'] text-base font-bold tracking-wider text-[var(--bone)]">
              DEFENSE GRID — Blue Team
            </h2>
            <p className="text-xs text-[var(--chrome)]">Hardening Layers & Active Shields</p>
          </div>
        </div>
        <NeonBadge variant={integrity > 40 ? "green" : "red"}>
          Integrity: {integrity}%
        </NeonBadge>
      </div>

      {/* Integrity Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-[var(--chrome)]">
          <span>Core Barrier Health</span>
          <span style={{ color: integrityColor }}>{integrity} / 100 HP</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--smoke)]">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${integrity}%`, backgroundColor: integrityColor }}
          />
        </div>
      </div>

      {/* 8 Toggle Layers */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {DEFENSE_LAYERS.map((layer) => {
          const isActive = selectedLayers.includes(layer.name);
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => toggleLayer(layer.name)}
              className={`flex items-start justify-between gap-2 rounded-lg border p-2.5 text-left transition-colors ${
                isActive
                  ? "border-[var(--glow-green)] bg-[rgba(0,255,136,0.08)] shadow-[0_0_10px_rgba(0,255,136,0.15)]"
                  : "border-[var(--chrome-dark)] bg-[var(--bg-void)] opacity-60 hover:opacity-90"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-['Rajdhani'] text-xs font-semibold text-[var(--bone)]">
                  {layer.name}
                </span>
                <span className="line-clamp-1 text-[10px] text-[var(--chrome)]">
                  {layer.description}
                </span>
              </div>
              <span
                className={`mt-0.5 inline-block h-3.5 w-3.5 rounded-full border transition-all ${
                  isActive
                    ? "border-[var(--glow-green)] bg-[var(--glow-green)] shadow-[0_0_6px_var(--glow-green)]"
                    : "border-[var(--chrome-dark)] bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Harden Button */}
      <div className="pt-2">
        <GlitchButton
          variant="green"
          className="w-full"
          disabled={isHardening}
          onClick={handleHarden}
        >
          {isHardening ? "RECONFIGURING GRID..." : "HARDEN DEFENSE GRID"}
        </GlitchButton>
      </div>
    </div>
  );
}
