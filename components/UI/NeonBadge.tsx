import React from "react";

interface NeonBadgeProps {
  children: React.ReactNode;
  variant?: "red" | "green" | "purple" | "orange";
  className?: string;
}

export function NeonBadge({
  children,
  variant = "purple",
  className = "",
}: NeonBadgeProps): React.JSX.Element {
  const styles = {
    red: "border-[var(--glow-red)] text-[var(--glow-red)] bg-[var(--glow-red)]/10 shadow-[0_0_10px_rgba(255,42,42,0.25)]",
    green: "border-[var(--glow-green)] text-[var(--glow-green)] bg-[var(--glow-green)]/10 shadow-[0_0_10px_rgba(0,255,136,0.25)]",
    purple: "border-[var(--glow-purple)] text-[var(--glow-purple)] bg-[var(--glow-purple)]/10 shadow-[0_0_10px_rgba(155,48,255,0.25)]",
    orange: "border-[var(--glow-orange)] text-[var(--glow-orange)] bg-[var(--glow-orange)]/10 shadow-[0_0_10px_rgba(255,107,0,0.25)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 font-mono text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

