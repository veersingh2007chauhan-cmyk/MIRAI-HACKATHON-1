"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export function CandleCluster(): React.JSX.Element {
  const candleFlash = useGameState((state) => state.candleFlash);

  const securityNodes = [
    { label: "Input Guard", id: "l1" },
    { label: "Decoders", id: "dec" },
    { label: "XML Nonce", id: "l2" },
    { label: "Model Sandbox", id: "ai" },
    { label: "Output DLP", id: "l3" },
  ];

  return (
    <div
      aria-label="Security Layer Status Indicators"
      className="flex items-center justify-center gap-3 pt-2 pb-6"
    >
      {securityNodes.map((node) => (
        <div
          key={node.id}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium transition-all duration-300 ${
            candleFlash
              ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
              : "border-slate-800 bg-slate-900/60 text-slate-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              candleFlash ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          <span>{node.label}</span>
        </div>
      ))}
    </div>
  );
}
