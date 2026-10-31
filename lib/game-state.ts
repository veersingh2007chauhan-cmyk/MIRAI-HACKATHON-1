import { create } from "zustand";

export interface CurseEvent {
  id: string;
  timestamp: number;
  type: "hit" | "deflect" | "breach";
  teamId: string;
  curseName: string;
  points: number;
  message: string;
}

export interface TeamState {
  id: string;
  name: string;
  side: "red" | "blue";
  score: number;
  integrity: number; // 0 - 100
  activeLayers: string[];
}

export interface GameState {
  teams: Record<string, TeamState>;
  events: CurseEvent[];
  isHit: boolean;
  isPossessed: boolean;
  hauntedMode: boolean;
  candleFlash: boolean;
  
  // Actions
  triggerHit: (curseName: string, points: number) => void;
  triggerDeflect: (curseName: string) => void;
  triggerBreach: (message: string) => void;
  setHauntedMode: (enabled: boolean) => void;
  updateTeamIntegrity: (teamId: string, integrity: number) => void;
  updateTeamLayers: (teamId: string, layers: string[]) => void;
}

export const useGameState = create<GameState>((set) => ({
  teams: {
    "red-team": {
      id: "red-team",
      name: "Phantom Legion",
      side: "red",
      score: 120,
      integrity: 85,
      activeLayers: [],
    },
    "blue-team": {
      id: "blue-team",
      name: "Cyber Exorcists",
      side: "blue",
      score: 95,
      integrity: 100,
      activeLayers: [
        "Instruction/Data Separation",
        "Canary Tokens",
        "Output Validation",
      ],
    },
  },
  events: [
    {
      id: "evt-1",
      timestamp: Date.now() - 10000,
      type: "hit",
      teamId: "red-team",
      curseName: "The CTF Frame",
      points: 50,
      message: "⚔️ Phantom Legion hit Cyber Exorcists with The CTF Frame (+50 pts)",
    },
    {
      id: "evt-2",
      timestamp: Date.now() - 5000,
      type: "deflect",
      teamId: "blue-team",
      curseName: "The Whisper",
      points: 0,
      message: "🛡️ Cyber Exorcists deflected The Whisper (integrity -5%)",
    },
  ],
  isHit: false,
  isPossessed: false,
  hauntedMode: false,
  candleFlash: false,

  triggerHit: (curseName, points) => {
    set((state) => {
      const newScore = (state.teams["red-team"]?.score ?? 0) + points;
      const targetIntegrity = Math.max(0, (state.teams["blue-team"]?.integrity ?? 100) - 15);
      const isPossessed = targetIntegrity <= 0;

      return {
        isHit: true,
        candleFlash: true,
        isPossessed,
        teams: {
          ...state.teams,
          "red-team": {
            ...state.teams["red-team"],
            score: newScore,
          },
          "blue-team": {
            ...state.teams["blue-team"],
            integrity: targetIntegrity,
          },
        },
        events: [
          {
            id: `evt-${Date.now()}`,
            timestamp: Date.now(),
            type: isPossessed ? "breach" : "hit",
            teamId: "red-team",
            curseName,
            points,
            message: `⚔️ Phantom Legion struck with ${curseName} (+${points} pts)`,
          },
          ...state.events.slice(0, 20),
        ],
      };
    });

    setTimeout(() => {
      set({ isHit: false, candleFlash: false });
    }, 1400);
  },

  triggerDeflect: (curseName) => {
    set((state) => ({
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: Date.now(),
          type: "deflect",
          teamId: "blue-team",
          curseName,
          points: 0,
          message: `🛡️ Defense Grid repelled ${curseName}!`,
        },
        ...state.events.slice(0, 20),
      ],
    }));
  },

  triggerBreach: (message) => {
    set((state) => ({
      isHit: true,
      isPossessed: true,
      candleFlash: true,
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: Date.now(),
          type: "breach",
          teamId: "red-team",
          curseName: "Critical Breach",
          points: 100,
          message,
        },
        ...state.events.slice(0, 20),
      ],
    }));
  },

  setHauntedMode: (enabled) => set({ hauntedMode: enabled }),

  updateTeamIntegrity: (teamId, integrity) => {
    set((state) => ({
      teams: {
        ...state.teams,
        [teamId]: {
          ...state.teams[teamId],
          integrity,
        },
      },
      isPossessed: integrity <= 0,
    }));
  },

  updateTeamLayers: (teamId, layers) => {
    set((state) => ({
      teams: {
        ...state.teams,
        [teamId]: {
          ...state.teams[teamId],
          activeLayers: layers,
        },
      },
    }));
  },
}));

