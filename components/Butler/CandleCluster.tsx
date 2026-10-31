"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

interface CandleProps {
  delay: string;
  height: string;
  flash: boolean;
}

function Candle({ delay, height, flash }: CandleProps): React.JSX.Element {
  return (
    <div className="relative flex flex-col items-center">
      {/* Flame */}
      <div
        className={`h-5 w-3.5 rounded-t-full transition-colors duration-200 animate-flame ${
          flash ? "bg-[var(--glow-orange)] shadow-[0_0_25px_var(--glow-orange)]" : "bg-gradient-to-t from-[var(--glow-orange)] via-[#ffd200] to-[#fff]"
        }`}
        style={{
          animationDelay: delay,
          boxShadow: flash
            ? "0 0 25px 8px var(--glow-orange)"
            : "0 0 14px 3px rgba(255, 107, 0, 0.75)",
        }}
      />
      {/* Wick */}
      <div className="h-1.5 w-0.5 bg-[#222]" />
      {/* Wax Body */}
      <div
        className="w-4 rounded-t-sm bg-gradient-to-b from-[#dfd7bf] to-[#8d826a] relative overflow-hidden"
        style={{ height }}
      >
        {/* Wax drip */}
        <div className="absolute top-0 left-1 w-1 bg-[#fff6db] opacity-80 h-3 rounded-b-full animate-[pulse_8s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

export function CandleCluster(): React.JSX.Element {
  const candleFlash = useGameState((state) => state.candleFlash);

  const candleConfigs = [
    { delay: "0s", height: "40px" },
    { delay: "0.7s", height: "55px" },
    { delay: "0.3s", height: "68px" },
    { delay: "1.1s", height: "52px" },
    { delay: "1.5s", height: "42px" },
  ];

  return (
    <div
      aria-label="Flickering candles"
      className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-30 flex items-start gap-8 pt-1"
    >
      {candleConfigs.map((cfg, idx) => (
        <Candle
          key={idx}
          delay={cfg.delay}
          height={cfg.height}
          flash={candleFlash}
        />
      ))}
    </div>
  );
}
