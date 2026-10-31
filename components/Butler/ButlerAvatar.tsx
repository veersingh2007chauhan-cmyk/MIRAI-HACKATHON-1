"use client";

import React, { useState } from "react";
import { useGameState } from "@/lib/game-state";

export function ButlerAvatar(): React.JSX.Element {
  const isPossessed = useGameState((state) => state.isPossessed);
  const isHit = useGameState((state) => state.isHit);
  const [winks, setWinks] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = winks + 1;
    setWinks(newCount);
    if (newCount >= 5) {
      setEasterEggActive(true);
      setTimeout(() => setEasterEggActive(false), 4000);
      setWinks(0);
    }
  };

  const eyeColor = isPossessed ? "var(--glow-purple)" : "var(--glow-red)";
  const chestCircuitColor = isPossessed ? "var(--glow-red)" : "var(--glow-green)";

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Easter Egg Message */}
      {easterEggActive && (
        <div className="absolute -top-12 z-20 animate-bounce rounded border border-[var(--glow-purple)] bg-[var(--bg-panel)] px-3 py-1 font-mono text-xs text-[var(--ectoplasm)] shadow-[0_0_15px_var(--glow-purple)]">
          The curse is in the code. 🕯️
        </div>
      )}

      {/* Butler Container */}
      <div
        className={`relative transition-transform duration-300 ${
          isHit ? "twitching" : "animate-[pulse_3s_ease-in-out_infinite]"
        } ${isPossessed ? "rotate-[-1deg]" : ""}`}
        style={{ height: "300px", width: "220px" }}
      >
        <svg
          viewBox="0 0 220 300"
          className="h-full w-full drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Hat */}
          <ellipse cx="110" cy="55" rx="55" ry="8" fill="#1b222c" stroke="var(--chrome-dark)" strokeWidth="2" />
          <path d="M72,55 L80,10 L140,10 L148,55 Z" fill="#0d1117" stroke="var(--chrome-dark)" strokeWidth="2" />
          <rect x="79" y="44" width="62" height="6" fill="var(--glow-purple)" opacity="0.8" />

          {/* Android Head (Chrome Plated) */}
          <rect x="75" y="60" width="70" height="75" rx="14" fill="var(--chrome)" stroke="var(--chrome-dark)" strokeWidth="2.5" />
          {/* Face Plate Seam */}
          <line x1="110" y1="62" x2="110" y2="130" stroke="var(--chrome-dark)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Left Eye (Optical Sensor - Interactive Easter Egg) */}
          <g onClick={handleEyeClick} className="cursor-pointer">
            <circle cx="92" cy="90" r="8" fill="#1a1a2e" stroke="var(--chrome-dark)" strokeWidth="1.5" />
            <circle
              cx="92"
              cy="90"
              r="4.5"
              fill={eyeColor}
              className={isHit ? "animate-ping" : ""}
              style={{ filter: `drop-shadow(0 0 6px ${eyeColor})` }}
            />
          </g>

          {/* Right Eye (Standard Victorian Monocle Lens) */}
          <circle cx="128" cy="90" r="8" fill="#1a1a2e" stroke="var(--bone)" strokeWidth="2" />
          <circle cx="128" cy="90" r="3" fill="var(--chrome-dark)" />
          {/* Monocle chain */}
          <path d="M136,90 Q145,115 130,135" fill="none" stroke="var(--bone)" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* Android Speaker Mouth */}
          <rect x="94" y="115" width="32" height="4" rx="2" fill="#090d16" />
          <line x1="98" y1="117" x2="122" y2="117" stroke="var(--chrome-dark)" strokeWidth="1" strokeDasharray="2 2" />

          {/* Bow Tie */}
          <polygon points="110,140 92,132 92,148" fill="var(--smoke)" stroke="var(--bone)" strokeWidth="1.5" />
          <polygon points="110,140 128,132 128,148" fill="var(--smoke)" stroke="var(--bone)" strokeWidth="1.5" />
          <circle cx="110" cy="140" r="3.5" fill="var(--glow-orange)" />

          {/* Android Torso & Victorian Suit */}
          <path d="M50,145 L170,145 L155,290 L65,290 Z" fill="#111927" stroke="var(--chrome-dark)" strokeWidth="2" />
          
          {/* Chrome Chest Plate with Circuits */}
          <path d="M80,150 L140,150 L130,230 L90,230 Z" fill="var(--chrome-dark)" opacity="0.6" />
          <path
            d="M95,160 L110,175 L110,210 M110,175 L125,160 M100,195 L120,195"
            fill="none"
            stroke={chestCircuitColor}
            strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 4px ${chestCircuitColor})` }}
          />

          {/* Left Arm: Exposed Wiring & Ectoplasm */}
          <g>
            <path d="M48,155 Q30,200 42,260" fill="none" stroke="#222" strokeWidth="10" strokeLinecap="round" />
            <path d="M46,165 Q32,205 40,250" fill="none" stroke="var(--glow-red)" strokeWidth="2" />
            <path d="M50,170 Q28,215 38,255" fill="none" stroke="var(--glow-purple)" strokeWidth="1.5" />
            {/* Ectoplasm Drip */}
            <circle cx="41" cy="265" r="3" fill="var(--ectoplasm)" opacity="0.9" style={{ filter: "drop-shadow(0 0 5px var(--ectoplasm))" }} />
          </g>

          {/* Right Arm: Formal Butler Sleeve */}
          <path d="M172,155 Q190,200 178,260" fill="none" stroke="#111927" strokeWidth="12" strokeLinecap="round" />
          <circle cx="177" cy="264" r="5" fill="var(--bone)" />
        </svg>
      </div>
    </div>
  );
}
