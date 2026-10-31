import React from "react";
import { CandleCluster } from "@/components/Butler/CandleCluster";
import { ButlerAvatar } from "@/components/Butler/ButlerAvatar";
import { ZalgoText } from "@/components/Theme/ZalgoText";
import { AttackConsole } from "@/components/Game/AttackConsole";
import { DefensePanel } from "@/components/Game/DefensePanel";
import { ScoreBoard } from "@/components/Game/ScoreBoard";
import { CurseTicker } from "@/components/Game/CurseTicker";
import { PumpkinLantern } from "@/components/Theme/PumpkinLantern";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start px-4 pt-12 pb-24 md:px-8">
      {/* 5 Candle Cluster Arc */}
      <CandleCluster />

      {/* Main Title Header */}
      <header className="mb-6 flex flex-col items-center text-center">
        <h1 className="font-['Orbitron'] text-3xl font-extrabold tracking-widest text-[var(--bone)] md:text-5xl">
          <ZalgoText intensity={3}>CURSE 03</ZalgoText>
        </h1>
        <p className="mt-1 font-['UnifrakturMaguntia'] text-xl text-[var(--glow-purple)] md:text-2xl">
          <ZalgoText intensity={1}>The Possessed Android Butler</ZalgoText>
        </p>
        <span className="mt-2 font-mono text-[11px] tracking-wider text-[var(--chrome)] uppercase">
          Cyber-Robotic Multiplayer Prompt-Injection Arena
        </span>
      </header>

      {/* Victorian Android Butler */}
      <section className="mb-8 flex justify-center">
        <ButlerAvatar />
      </section>

      {/* Arena Grid: Red Team Attack vs Blue Team Defense */}
      <section className="mb-8 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <AttackConsole />
        <DefensePanel />
      </section>

      {/* Team Scores Arena */}
      <section className="w-full max-w-6xl">
        <ScoreBoard />
      </section>

      {/* Floating Jack-o'-lantern */}
      <PumpkinLantern />

      {/* Bottom Horizontal Live Ticker */}
      <CurseTicker />
    </main>
  );
}
