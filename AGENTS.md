# AGENTS.md — CURSE 03: The Possessed Android Butler

## Project Identity
- **Name**: CURSE 03 — Possessed Android Butler
- **Theme**: Cyber-robotic butler possessed by a Halloween curse.
  Think: chrome-plated Victorian android in a decaying haunted manor,
  glowing red optical sensors, exposed wiring dripping ectoplasm,
  pumpkin-lit corridors with flickering neon circuitry.
- **Vibe**: "If a Terminator butler got haunted by a ghost on Halloween night"
- **Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Canvas API
- **Runtime**: Node.js 22, deployed on Vercel
- **No external UI libraries** (no shadcn, no MUI) — all custom components

## Folder Structure

```
/
├── app/
│   ├── layout.tsx         # Root layout (fog, candle, fonts)
│   ├── page.tsx           # Main game lobby
│   ├── battle/
│   │   └── page.tsx       # Live red vs blue round
│   ├── scoreboard/
│   │   └── page.tsx       # Team scores, curse feed
│   └── api/
│       ├── attack/route.ts   # POST: submit a curse payload
│       ├── defend/route.ts   # POST: harden agent config
│       └── status/route.ts   # GET: live game state (WebSocket fallback: SSE)
├── components/
│   ├── Butler/
│   │   ├── ButlerAvatar.tsx      # Animated SVG android-butter
│   │   ├── PossessionOverlay.tsx # Full-screen dim/twitch on hit
│   │   └── CandleCluster.tsx     # 3D-ish flickering candles
│   ├── Game/
│   │   ├── CurseTicker.tsx       # Horizontal marquee of hits
│   │   ├── AttackConsole.tsx     # Terminal-style input for curses
│   │   ├── DefensePanel.tsx      # Toggle hardening layers
│   │   └── ScoreBoard.tsx        # Live team scores
│   ├── Theme/
│   │   ├── FogLayer.tsx          # Parallax drifting fog
│   │   ├── CircuitVeins.tsx      # Glowing circuit lines on walls
│   │   ├── PumpkinLantern.tsx    # Jack-o'-lantern with LED glow
│   │   └── ZalgoText.tsx         # Cursed text renderer
│   └── UI/
│       ├── GlitchButton.tsx      # Buttons that glitch on hover
│       ├── TerminalInput.tsx     # Monospace input with cursor blink
│       └── NeonBadge.tsx         # Score/level badges
├── lib/
│   ├── game-state.ts     # Zustand store for real-time state
│   ├── curse-engine.ts   # Validates & scores attack payloads
│   ├── defense-engine.ts # Evaluates hardening layers
│   └── websocket.ts      # SSE client for live updates
├── public/
│   ├── sounds/
│   │   ├── flicker.wav   # Candle crackle
│   │   ├── hit.mp3       # On successful attack
│   │   └── breach.mp3    # On defense failure
│   └── textures/
│       ├── fog.png       # Tiling noise texture
│       └── circuit.png   # Circuit board pattern
├── styles/
│   └── globals.css       # CSS variables, keyframes, utilities
└── gemini.md             # (this file's sibling — Antigravity identity)
```

## Design Tokens

```css
:root {
  /* Core palette — Robo-Halloween */
  --bg-void: #050508;
  --bg-panel: #0d0d14;
  --chrome: #8a9bb0;          /* android metal */
  --chrome-dark: #3d4a5c;
  --glow-red: #ff2a2a;       /* possessed optical sensors */
  --glow-orange: #ff6b00;    /* pumpkin lantern */
  --glow-green: #00ff88;     /* circuit veins / "alive" state */
  --glow-purple: #9b30ff;    /* curse energy */
  --bone: #e8dcc8;           /* text */
  --smoke: #1a1a2e;          /* panels */
  --ectoplasm: #4affd4;      /* ghost drip accent */

  /* Typography */
  --font-display: 'Orbitron', sans-serif;      /* robotic headings */
  --font-body: 'Rajdhani', sans-serif;         /* clean body */
  --font-mono: 'JetBrains Mono', monospace;    /* payloads/terminal */
  --font-cursed: 'UnifrakturMaguntia', serif;  /* possessed text */
}
```

## Strict Rules
- NEVER use `any` type in TypeScript
- All animations must respect `prefers-reduced-motion`
- No `console.log` in production code — use a custom `logger.ts`
- All API routes must validate input with Zod schemas
- Components under 150 lines — split if larger
- Use `next/dynamic` for all Canvas/WebGL components
- No external images — all visuals are SVG, CSS, or Canvas-generated
- Sound files must be < 50KB each (use Howler.js for playback)

## Animation Rules
- Candle flicker: `steps(4)` timing, random animation-delay per candle
- Butler twitch: 3-frame keyframe on `.twitching` class, 120ms duration
- Fog drift: 60s linear infinite loop, `transform: translateX(-50%)`
- Circuit pulse: `box-shadow` glow with 2s ease-in-out infinite
- Zalgo text: CSS text-shadow with 3 layers of offset, animated
- Possession overlay: opacity 0→0.4 in 200ms, hold 800ms, fade out 400ms



