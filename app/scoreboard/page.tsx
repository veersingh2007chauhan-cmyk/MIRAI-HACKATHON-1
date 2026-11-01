import React from "react";
import Link from "next/link";
import { ScoreBoard } from "@/components/Game/ScoreBoard";
import { CurseTicker } from "@/components/Game/CurseTicker";
import { PumpkinLantern } from "@/components/Theme/PumpkinLantern";

export default function ScoreboardPage(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 pt-12 pb-24 md:px-8">
      <div className="mb-6 flex w-full max-w-4xl items-center justify-between border-b border-[var(--chrome-dark)] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded border border-[var(--chrome-dark)] bg-[var(--bg-panel)] px-3 py-1 font-mono text-xs text-[var(--chrome)] transition-colors hover:text-[var(--bone)]"
          >
            ← ARENA
          </Link>
          <h1 className="font-['Orbitron'] text-xl font-bold tracking-wider text-[var(--bone)]">
            TEAM STANDINGS & SCOREBOARD
          </h1>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <ScoreBoard />
      </div>

      <PumpkinLantern />
      <CurseTicker />
    </main>
  );
}
