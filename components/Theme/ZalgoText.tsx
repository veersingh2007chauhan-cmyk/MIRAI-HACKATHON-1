"use client";

import React, { useMemo } from "react";

interface ZalgoTextProps {
  children: string;
  intensity?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  animate?: boolean;
}

const ZALGO_MARKS_UP = [
  "\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0306",
  "\u0310", "\u0352", "\u0357", "\u0351", "\u0307", "\u0308", "\u030a",
];

const ZALGO_MARKS_DOWN = [
  "\u0316", "\u0317", "\u0318", "\u0319", "\u031c", "\u031d", "\u031e",
  "\u031f", "\u0320", "\u0324", "\u0325", "\u0326", "\u0329", "\u032a",
];

function generateZalgo(text: string, intensity: number): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += char;
    if (char === " ") continue;

    const countUp = Math.floor(Math.random() * intensity);
    const countDown = Math.floor(Math.random() * intensity);

    for (let u = 0; u < countUp; u++) {
      const idx = Math.floor(Math.random() * ZALGO_MARKS_UP.length);
      result += ZALGO_MARKS_UP[idx];
    }
    for (let d = 0; d < countDown; d++) {
      const idx = Math.floor(Math.random() * ZALGO_MARKS_DOWN.length);
      result += ZALGO_MARKS_DOWN[idx];
    }
  }
  return result;
}

export function ZalgoText({
  children,
  intensity = 2,
  className = "",
  animate = true,
}: ZalgoTextProps): React.JSX.Element {
  const cursedString = useMemo(
    () => generateZalgo(children, intensity),
    [children, intensity]
  );

  return (
    <span
      className={`${animate ? "zalgo-animated" : ""} inline-block select-none font-cursed ${className}`}
    >
      {cursedString}
    </span>
  );
}
