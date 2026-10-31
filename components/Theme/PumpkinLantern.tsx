"use client";

import React, { useState } from "react";
import { useGameState } from "@/lib/game-state";

export function PumpkinLantern(): React.JSX.Element {
  const hauntedMode = useGameState((state) => state.hauntedMode);
  const setHauntedMode = useGameState((state) => state.setHauntedMode);
  const events = useGameState((state) => state.events);
  const [clicked, setClicked] = useState(false);

  const attacksLanded = events.filter((e) => e.type === "hit" || e.type === "breach").length;
  const glowLevel = Math.min(35, 12 + attacksLanded * 2.5);

  const handlePumpkinClick = () => {
    setClicked(true);
    setHauntedMode(!hauntedMode);
    setTimeout(() => {
      setClicked(false);
      setHauntedMode(false);
    }, 5000);
  };

  return (
    <div
      onClick={handlePumpkinClick}
      title="Click jack-o'-lantern to toggle Haunted Mode!"
      className={`fixed bottom-6 right-6 z-40 cursor-pointer select-none transition-transform duration-300 hover:scale-110 active:scale-95 animate-[bounce_4s_ease-in-out_infinite] ${
        clicked ? "rotate-6" : ""
      }`}
    >
      <div
        className="relative h-18 w-20 rounded-[50%_50%_45%_45%] bg-gradient-to-b from-[#ff8c00] via-[#ff6b00] to-[#b34700]"
        style={{
          boxShadow: `0 0 ${glowLevel}px rgba(255, 107, 0, 0.8), inset 0 2px 6px rgba(255,255,255,0.4)`,
        }}
      >
        {/* Pumpkin Stem */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3.5 w-2 rounded-t-sm bg-[#3a5a20] -rotate-12" />

        {/* Eyes (Carved Triangle) */}
        <div className="absolute top-5 left-3.5 h-0 w-0 border-x-4 border-x-transparent border-b-6 border-b-[#1c0800] drop-shadow-[0_0_4px_var(--glow-orange)]" />
        <div className="absolute top-5 right-3.5 h-0 w-0 border-x-4 border-x-transparent border-b-6 border-b-[#1c0800] drop-shadow-[0_0_4px_var(--glow-orange)]" />

        {/* Nose */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 h-0 w-0 border-x-2.5 border-x-transparent border-b-4 border-b-[#1c0800]" />

        {/* Tooth Carved Mouth */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 border-b-3 border-[#1c0800] rounded-b-full drop-shadow-[0_0_6px_var(--glow-orange)] flex justify-around items-end pb-0.5">
          <div className="w-1.5 h-1.5 bg-[#ff8c00]" />
          <div className="w-1.5 h-1.5 bg-[#ff8c00]" />
        </div>
      </div>
    </div>
  );
}
