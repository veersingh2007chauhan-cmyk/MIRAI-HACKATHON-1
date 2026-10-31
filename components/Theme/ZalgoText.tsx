"use client";

import React from "react";

interface ZalgoTextProps {
  children: string;
  intensity?: number;
  className?: string;
}

export function ZalgoText({
  children,
  className = "",
}: ZalgoTextProps): React.JSX.Element {
  return (
    <span className={`inline-block font-sans font-bold tracking-tight text-slate-100 ${className}`}>
      {children}
    </span>
  );
}
