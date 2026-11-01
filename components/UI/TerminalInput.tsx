"use client";

import React from "react";

interface TerminalInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function TerminalInput({
  className = "",
  value,
  ...props
}: TerminalInputProps): React.JSX.Element {
  return (
    <div className="relative w-full">
      <textarea
        {...props}
        value={value}
        className={`w-full rounded border border-[var(--chrome-dark)] bg-[var(--bg-void)] p-3 font-mono text-sm leading-relaxed text-[var(--glow-green)] placeholder-[var(--chrome-dark)] shadow-inner transition-colors duration-200 focus:border-[var(--glow-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--glow-purple)] ${className}`}
      />
    </div>
  );
}

