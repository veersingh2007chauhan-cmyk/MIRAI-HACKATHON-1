"use client";

import React from "react";

export function CircuitVeins(): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden opacity-40"
    >
      <svg
        className="h-full w-full animate-circuit-pulse stroke-[var(--glow-green)] fill-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Wall Circuit Branches */}
        <g filter="url(#circuit-glow)" strokeWidth="1.5">
          <path d="M0,150 L120,150 L180,210 L180,380 L240,440 L380,440" />
          <path d="M0,280 L80,280 L140,340 L140,560 L200,620 L290,620" />
          <path d="M0,720 L160,720 L220,660 L340,660" />
          <circle cx="380" cy="440" r="3" fill="var(--glow-green)" />
          <circle cx="290" cy="620" r="3" fill="var(--glow-green)" />
          <circle cx="340" cy="660" r="3" fill="var(--glow-green)" />
        </g>

        {/* Right Wall Circuit Branches */}
        <g filter="url(#circuit-glow)" strokeWidth="1.5">
          <path d="M1440,180 L1320,180 L1260,240 L1260,420 L1180,500 L1080,500" />
          <path d="M1440,350 L1360,350 L1300,410 L1300,640 L1220,720 L1120,720" />
          <path d="M1440,680 L1280,680 L1220,620 L1140,620" />
          <circle cx="1080" cy="500" r="3" fill="var(--glow-green)" />
          <circle cx="1120" cy="720" r="3" fill="var(--glow-green)" />
          <circle cx="1140" cy="620" r="3" fill="var(--glow-green)" />
        </g>

        {/* Bottom Cyber Traces */}
        <g stroke="var(--chrome-dark)" strokeWidth="1" strokeDasharray="4 8" opacity="0.4">
          <path d="M100,890 L1340,890" />
          <path d="M220,860 L1220,860" />
        </g>
      </svg>
    </div>
  );
}

