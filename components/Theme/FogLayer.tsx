"use client";

import dynamic from "next/dynamic";
import React from "react";

const DynamicFogCanvas = dynamic(
  () => import("./FogCanvas").then((mod) => mod.FogCanvas),
  { ssr: false }
);

export function FogLayer(): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      <DynamicFogCanvas />
      {/* Parallax drifting CSS fog layer */}
      <div className="animate-fog absolute inset-0 flex h-full w-[200%] opacity-20">
        <div className="h-full w-1/2 bg-[radial-gradient(ellipse_at_top,_var(--chrome)_0%,_transparent_70%)]" />
        <div className="h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom,_var(--glow-purple)_0%,_transparent_70%)]" />
      </div>
    </div>
  );
}

