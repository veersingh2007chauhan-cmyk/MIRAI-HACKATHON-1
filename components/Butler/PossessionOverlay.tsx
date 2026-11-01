"use client";

import React, { useEffect, useState } from "react";
import { useGameState } from "@/lib/game-state";

export function PossessionOverlay(): React.JSX.Element {
  const isHit = useGameState((state) => state.isHit);
  const isPossessed = useGameState((state) => state.isPossessed);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isHit) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isHit]);

  const active = animating || isPossessed;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Red & Purple Vignette Dimming */}
      <div
        className={`absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(255,42,42,0.35)_80%,rgba(155,48,255,0.4)_100%] ${
          animating ? "possession-active" : isPossessed ? "opacity-40" : "opacity-0"
        }`}
      />

      {/* Cyber Noise / Twitch Scanlines */}
      {active && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-25 mix-blend-overlay" />
      )}
    </div>
  );
}

