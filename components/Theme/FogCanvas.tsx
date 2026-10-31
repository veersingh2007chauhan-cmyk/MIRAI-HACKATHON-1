"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
}

export function FogCanvas(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Procedural fog particles
    const particleCount = 28;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 160 + 120,
      speed: Math.random() * 0.25 + 0.08,
      alpha: Math.random() * 0.08 + 0.03,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speed;
        if (p.x - p.radius > width) {
          p.x = -p.radius;
          p.y = Math.random() * height;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(45, 55, 72, ${p.alpha})`);
        gradient.addColorStop(0.6, `rgba(26, 26, 46, ${p.alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(5, 5, 8, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,var(--bg-void)_85%] opacity-70" />
    </div>
  );
}

