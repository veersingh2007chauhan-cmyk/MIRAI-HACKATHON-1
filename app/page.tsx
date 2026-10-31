import React from "react";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl rounded-xl border border-[var(--chrome-dark)] bg-[var(--bg-panel)]/80 p-8 backdrop-blur-md shadow-[0_0_30px_rgba(155,48,255,0.15)]">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider text-[var(--bone)]">
          CURSE 03
        </h1>
        <p className="mt-2 font-cursed text-2xl text-[var(--glow-purple)]">
          The Possessed Android Butler
        </p>
        <p className="mt-4 text-[var(--chrome)] font-body text-lg">
          Cyber-robotic Victorian butler haunted on Halloween night.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs font-mono text-[var(--glow-green)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--glow-green)] animate-ping" />
            Phase 1 Foundation Ready
          </span>
          <span className="text-[var(--chrome-dark)]">•</span>
          <span>Next.js 15 App Router</span>
          <span className="text-[var(--chrome-dark)]">•</span>
          <span>Tailwind CSS v4</span>
        </div>
      </div>
    </main>
  );
}

