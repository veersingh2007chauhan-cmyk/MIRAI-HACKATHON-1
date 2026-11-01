# Project: CURSE 03 — Possessed Android Butler

## What This Is
A real-time multiplayer web game where teams battle with prompt-injection
"curses" against AI butler agents. Red team attacks, Blue team defends.
Theme: cyber-robotic Victorian butler haunted on Halloween night.

## Tech Stack
- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4 (no config file — CSS-first)
- Framer Motion for UI animations
- Canvas API for particle effects (fog, ectoplasm)
- Zustand for client state
- SSE (Server-Sent Events) for real-time game state
- Howler.js for sound
- Zod for API validation

## Key Files
- Game logic: /lib/curse-engine.ts, /lib/defense-engine.ts
- State: /lib/game-state.ts
- Main page: /app/page.tsx
- Battle page: /app/battle/page.tsx
- API: /app/api/attack/route.ts

## Conventions
- Named exports only
- Components in PascalCase, files in PascalCase.tsx
- Hooks in useXxx.ts
- API handlers: export async function POST/GET
- CSS: Tailwind utilities + CSS variables from globals.css
- All new components go in /components/[Category]/

## Done-When
- `npm run build` → 0 errors
- `npm run lint` → 0 warnings
- All interactive elements keyboard-accessible
- Lighthouse performance > 80

