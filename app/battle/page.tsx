import React from "react";
import Link from "next/link";
import { CandleCluster } from "@/components/Butler/CandleCluster";
import { ButlerAvatar } from "@/components/Butler/ButlerAvatar";
import { AttackConsole } from "@/components/Game/AttackConsole";
import { DefensePanel } from "@/components/Game/DefensePanel";
import { CurseTicker } from "@/components/Game/CurseTicker";
import { PumpkinLantern } from "@/components/Theme/PumpkinLantern";

export default function BattlePage(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 pt-10 pb-20 md:px-8">
      <CandleCluster />

      <div className="mb-4 flex w-full max-w-6xl items-center justify-between border-b border-[var(--chrome-dark)] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded border border-[var(--chrome-dark)] bg-[var(--bg-panel)] px-3 py-1 font-mono text-xs text-[var(--chrome)] transition-colors hover:text-[var(--bone)]"
          >
            ← LOBBY
          </Link>
          <h1 className="font-['Orbitron'] text-xl font-bold tracking-wider text-[var(--bone)]">
            LIVE RED VS BLUE MATCH
          </h1>
        </div>
        <span className="font-mono text-xs text-[var(--glow-green)]">● STREAM ACTIVE</span>
      </div>

      <div className="mb-6">
        <ButlerAvatar />
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <AttackConsole />
        <DefensePanel />
      </div>

      <PumpkinLantern />
      <CurseTicker />
    </main>
  );
}
