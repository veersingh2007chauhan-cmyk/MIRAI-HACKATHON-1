"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export function ButlerAvatar(): React.JSX.Element {
  const isPossessed = useGameState((state) => state.isPossessed);
  const isHit = useGameState((state) => state.isHit);

  const statusColor = isPossessed
    ? "#f43f5e"
    : isHit
    ? "#f59e0b"
    : "#10b981";

  const statusLabel = isPossessed
    ? "THREAT CONTAINMENT BREACHED"
    : isHit
    ? "ADVERSARIAL ATTACK INTERCEPTED"
    : "GATEWAY SECURE • ALL SHIELDS ACTIVE";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Refined Security Crest Emblem (Clean, Human-Designed) */}
      <div className="relative flex items-center justify-center">
        {/* Subtle Ambient Pulse Ring */}
        <div
          className="absolute h-32 w-32 rounded-full transition-all duration-500 opacity-20"
          style={{
            backgroundColor: statusColor,
            filter: "blur(20px)",
          }}
        />

        {/* Central Shield Card */}
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-2xl border transition-all duration-300 ${
            isHit ? "scale-95 border-amber-500/50" : "border-slate-800"
          } bg-slate-900/90 shadow-2xl backdrop-blur-xl`}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke={statusColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          >
            {/* Elegant Security Shield */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            {/* Butler Bowtie / Gateway Core */}
            <polygon points="12,11 8,9 8,13" fill={statusColor} opacity="0.4" />
            <polygon points="12,11 16,9 16,13" fill={statusColor} opacity="0.4" />
            <circle cx="12" cy="11" r="1.5" fill="#fff" />
            <line x1="12" y1="13" x2="12" y2="17" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Clean Status Pill */}
      <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1 text-xs font-medium text-slate-300 shadow-sm">
        <span
          className="h-2 w-2 rounded-full transition-colors duration-300"
          style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
        />
        <span>{statusLabel}</span>
      </div>
    </div>
  );
}
