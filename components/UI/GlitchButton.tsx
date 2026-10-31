"use client";

import React from "react";

interface GlitchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "red" | "green" | "purple";
  className?: string;
}

export function GlitchButton({
  children,
  variant = "red",
  className = "",
  disabled,
  ...props
}: GlitchButtonProps): React.JSX.Element {
  const variantStyles = {
    red: "border-[var(--glow-red)] text-white hover:bg-[var(--glow-red)]/20 shadow-[0_0_15px_rgba(255,42,42,0.3)] hover:shadow-[0_0_25px_var(--glow-red)]",
    green: "border-[var(--glow-green)] text-white hover:bg-[var(--glow-green)]/20 shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_var(--glow-green)]",
    purple: "border-[var(--glow-purple)] text-white hover:bg-[var(--glow-purple)]/20 shadow-[0_0_15px_rgba(155,48,255,0.3)] hover:shadow-[0_0_25px_var(--glow-purple)]",
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded border bg-[var(--bg-panel)] px-5 py-2.5 font-display text-sm font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
