import React from "react";
import { CandleCluster } from "@/components/Butler/CandleCluster";
import { ButlerAvatar } from "@/components/Butler/ButlerAvatar";
import { AttackConsole } from "@/components/Game/AttackConsole";
import { DefensePanel } from "@/components/Game/DefensePanel";
import { ScoreBoard } from "@/components/Game/ScoreBoard";
import { CurseTicker } from "@/components/Game/CurseTicker";
import { PumpkinLantern } from "@/components/Theme/PumpkinLantern";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start px-4 pt-10 pb-24 md:px-8">
      {/* Clean Status Indicators */}
      <CandleCluster />

      {/* Modern Product Header */}
      <header className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 md:text-5xl font-['Inter']">
          Possessed Butler
        </h1>
        <p className="mt-2 text-base text-slate-400 max-w-xl font-normal">
          Enterprise Adversarial Prompt Firewall, XML Boundary Isolation & Automated Redaction
        </p>
      </header>

      {/* Central Security Crest */}
      <section className="mb-8 flex justify-center">
        <ButlerAvatar />
      </section>

      {/* Side-by-Side Sandbox: Evaluator vs Defense Controls */}
      <section className="mb-8 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <AttackConsole />
        <DefensePanel />
      </section>

      {/* Team Standings & Telemetry Arena */}
      <section className="w-full max-w-6xl">
        <ScoreBoard />
      </section>

      {/* Minimal Mode Toggle */}
      <PumpkinLantern />

      {/* Clean Activity Feed Ticker */}
      <CurseTicker />
    </main>
  );
}
