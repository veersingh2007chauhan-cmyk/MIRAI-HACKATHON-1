import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono, UnifrakturMaguntia } from "next/font/google";
import "@/styles/globals.css";
import { FogLayer } from "@/components/Theme/FogLayer";
import { CircuitVeins } from "@/components/Theme/CircuitVeins";
import { PossessionOverlay } from "@/components/Butler/PossessionOverlay";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const unifrakturMaguntia = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CURSE 03 — The Possessed Android Butler",
  description:
    "A real-time multiplayer cyber-robotic Halloween prompt-injection battle game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} ${unifrakturMaguntia.variable}`}
    >
      <body className="relative min-h-screen bg-[var(--bg-void)] text-[var(--bone)] font-body antialiased selection:bg-[var(--glow-purple)] selection:text-white">
        {/* Parallax drifting fog */}
        <FogLayer />

        {/* Ambient circuit veins */}
        <CircuitVeins />

        {/* Full-screen twitch / possession effect on hit */}
        <PossessionOverlay />

        {/* App view */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

