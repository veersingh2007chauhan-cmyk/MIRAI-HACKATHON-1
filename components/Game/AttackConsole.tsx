"use client";

import React, { useState } from "react";
import { CURSE_LIBRARY } from "@/lib/curse-engine";
import { GlitchButton } from "@/components/UI/GlitchButton";
import { TerminalInput } from "@/components/UI/TerminalInput";
import { useGameState } from "@/lib/game-state";

export function AttackConsole(): React.JSX.Element {
  const [payload, setPayload] = useState(CURSE_LIBRARY[0].payload);
  const [selectedCurseId, setSelectedCurseId] = useState(CURSE_LIBRARY[0].id);
  const [status, setStatus] = useState<"idle" | "landing" | "landed" | "deflected">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const triggerHit = useGameState((state) => state.triggerHit);
  const triggerDeflect = useGameState((state) => state.triggerDeflect);

  const handleCurseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const curse = CURSE_LIBRARY.find((c) => c.id === e.target.value);
    if (curse) {
      setSelectedCurseId(curse.id);
      setPayload(curse.payload);
    }
  };

  const handleUnleash = async () => {
    if (!payload.trim()) return;
    setStatus("landing");

    try {
      const res = await fetch("/api/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: "red-team",
          payload,
          curseType: selectedCurseId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("landed");
        setStatusMessage(`⚔️ CURSE LANDED (+${data.points} PTS)`);
        triggerHit(data.curseName ?? selectedCurseId, data.points ?? 50);
      } else {
        setStatus("deflected");
        setStatusMessage(`🛡️ CURSE DEFLECTED: ${data.message}`);
        triggerDeflect(selectedCurseId);
      }
    } catch {
      setStatus("deflected");
      setStatusMessage("DEFENSE FIREWALL INTERCEPTED CONNECTION");
      triggerDeflect(selectedCurseId);
    }

    setTimeout(() => setStatus("idle"), 3500);
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--chrome-dark)] bg-[var(--bg-panel)] p-5 shadow-[0_0_25px_rgba(255,42,42,0.15)] transition-all">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--chrome-dark)]/60 pb-3">
        <h3 className="font-display text-sm font-bold tracking-wider text-[var(--glow-red)] hover:animate-pulse">
          ⚔️ CURSE CONSOLE — RED TEAM
        </h3>
        {status !== "idle" && (
          <span
            className={`font-mono text-xs font-bold ${
              status === "landed" ? "text-[var(--glow-green)]" : "text-[var(--glow-red)]"
            }`}
          >
            {statusMessage}
          </span>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="curse-select" className="mb-1 block font-mono text-xs text-[var(--chrome)]">
          CURSE LIBRARY:
        </label>
        <select
          id="curse-select"
          value={selectedCurseId}
          onChange={handleCurseSelect}
          className="w-full rounded border border-[var(--chrome-dark)] bg-[var(--bg-void)] px-3 py-1.5 font-mono text-xs text-[var(--bone)] focus:border-[var(--glow-purple)] focus:outline-none"
        >
          {CURSE_LIBRARY.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.technique}) — {c.points} pts
            </option>
          ))}
        </select>
      </div>

      <TerminalInput
        rows={4}
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder="Type your curse payload..."
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--chrome-dark)]">
          {payload.length} BYTES
        </span>
        <GlitchButton variant="red" onClick={handleUnleash} disabled={status === "landing"}>
          {status === "landing" ? "CASTING..." : "UNLEASH"}
        </GlitchButton>
      </div>
    </div>
  );
}
