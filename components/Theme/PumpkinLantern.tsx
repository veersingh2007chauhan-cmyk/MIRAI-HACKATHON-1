"use client";

import React, { useState } from "react";
import { useGameState } from "@/lib/game-state";

export function PumpkinLantern(): React.JSX.Element {
  const hauntedMode = useGameState((state) => state.hauntedMode);
  const setHauntedMode = useGameState((state) => state.setHauntedMode);
  const [clicked, setClicked] = useState(false);

  const toggleHighContrast = () => {
    setClicked(true);
    setHauntedMode(!hauntedMode);
    setTimeout(() => {
      setClicked(false);
    }, 400);
  };

  return (
    <button
      type="button"
      onClick={toggleHighContrast}
      title="Toggle Security Audit Focus Mode"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-slate-300 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-slate-500 hover:text-white ${
        clicked ? "scale-95" : "hover:-translate-y-0.5"
      }`}
    >
      <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
      <span>Audit Mode</span>
    </button>
  );
}
