"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export function CurseTicker(): React.JSX.Element {
  const events = useGameState((state) => state.events);

  const displayEvents: Array<{ id: string; message: string }> =
    events.length > 0
      ? events.map((e) => ({ id: e.id, message: e.message }))
      : [
          {
            id: "default-1",
            message: "🎃 HALLOWEEN CURSE ARENA ACTIVE // RED TEAM ATTACKS // BLUE TEAM DEFENDS",
          },
        ];

  return (
    <footer
      aria-label="Curse Ticker"
      className="fixed bottom-0 left-0 right-0 z-40 h-10 border-t border-[var(--glow-purple)] bg-[var(--bg-void)]/90 backdrop-blur-md overflow-hidden flex items-center shadow-[0_-4px_20px_rgba(155,48,255,0.2)]"
    >
      <div className="flex w-full items-center">
        <div className="z-10 flex items-center gap-2 bg-[var(--bg-panel)] px-3 py-1 font-mono text-xs font-bold text-[var(--glow-purple)] border-r border-[var(--chrome-dark)] uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-[var(--glow-red)] animate-pulse" />
          FEED
        </div>
        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-flex gap-8 font-mono text-xs text-[var(--bone)] animate-[marquee_25s_linear_infinite]">
            {displayEvents.concat(displayEvents).map((e, idx) => (
              <span key={`${e.id}-${idx}`} className="inline-flex items-center gap-2">
                <span>{e.message}</span>
                <span className="text-[var(--chrome-dark)]">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
