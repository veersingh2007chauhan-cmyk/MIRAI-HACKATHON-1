"use client";

import React from "react";
import { useGameState, TeamState } from "@/lib/game-state";
import { NeonBadge } from "@/components/UI/NeonBadge";

function TeamCard({ team, isLeader }: { team: TeamState; isLeader: boolean }): React.JSX.Element {
  const isRed = team.side === "red";
  const borderColor = isLeader
    ? "border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)]"
    : isRed
    ? "border-[var(--glow-red)] shadow-[0_0_15px_rgba(255,42,42,0.2)]"
    : "border-[var(--glow-green)] shadow-[0_0_15px_rgba(0,255,136,0.2)]";

  return (
    <div
      className={`relative flex flex-1 flex-col gap-3 rounded-xl border bg-[var(--bg-panel)] p-4 transition-all ${borderColor}`}
    >
      {isLeader && (
        <div className="absolute -top-3 right-4 rounded-full border border-[#ffd700] bg-[var(--bg-void)] px-2.5 py-0.5 text-[10px] font-bold text-[#ffd700]">
          👑 LEADER
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{isRed ? "🩸" : "🛡️"}</span>
          <div>
            <h3 className="font-['Orbitron'] text-sm font-bold text-[var(--bone)]">{team.name}</h3>
            <span className="text-[10px] tracking-wider text-[var(--chrome)] uppercase">
              {team.side} Team
            </span>
          </div>
        </div>
        <NeonBadge variant={isRed ? "red" : "green"}>{team.score} PTS</NeonBadge>
      </div>

      {/* Integrity */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[11px] text-[var(--chrome)]">
          <span>Shield Integrity</span>
          <span className="font-mono">{team.integrity}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--smoke)]">
          <div
            className={`h-full transition-all duration-300 ${
              isRed ? "bg-[var(--glow-red)]" : "bg-[var(--glow-green)]"
            }`}
            style={{ width: `${team.integrity}%` }}
          />
        </div>
      </div>

      {/* Mini Butler Status */}
      <div className="flex items-center justify-between text-[11px] text-[var(--chrome)]">
        <span>Active Layers: {team.activeLayers.length}</span>
        <span className="font-mono text-[var(--ectoplasm)]">
          {team.integrity <= 0 ? "POSSESSED" : "OPERATIONAL"}
        </span>
      </div>
    </div>
  );
}

export function ScoreBoard(): React.JSX.Element {
  const teams = useGameState((state) => state.teams);
  const redTeam = teams["red-team"];
  const blueTeam = teams["blue-team"];

  const redScore = redTeam?.score ?? 0;
  const blueScore = blueTeam?.score ?? 0;
  const redIsLeader = redScore > blueScore;
  const blueIsLeader = blueScore > redScore;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--chrome-dark)] bg-[var(--bg-void)] p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-['Orbitron'] text-xs font-bold tracking-widest text-[var(--chrome)] uppercase">
          LIVE MATCH ARENA
        </h2>
        <span className="font-mono text-[10px] text-[var(--glow-orange)]">ROUND ACTIVE • HALLOWEEN NIGHT</span>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        {redTeam && <TeamCard team={redTeam} isLeader={redIsLeader} />}
        {blueTeam && <TeamCard team={blueTeam} isLeader={blueIsLeader} />}
      </div>
    </div>
  );
}
