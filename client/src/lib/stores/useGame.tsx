import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";
export type DisasterType = "hurricane" | "wildfire" | "earthquake";

interface DialogueLine {
  speaker: string;
  text: string;
}

interface GameState {
  phase: GamePhase;
  disaster: DisasterType | null;
  talkedToDan: boolean;
  talkedToBob: boolean;
  knownDisaster: DisasterType | null;
  activeDialogue: DialogueLine[] | null;
  dialogueIndex: number;
  activeNpc: string | null;

  start: () => void;
  restart: () => void;
  end: () => void;
  setDisaster: (d: DisasterType) => void;
  setTalkedToDan: () => void;
  setTalkedToBob: () => void;
  setKnownDisaster: (d: DisasterType) => void;
  openDialogue: (npc: string, lines: DialogueLine[]) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
}

const DISASTERS: DisasterType[] = ["hurricane", "wildfire", "earthquake"];

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    disaster: DISASTERS[Math.floor(Math.random() * DISASTERS.length)],
    talkedToDan: false,
    talkedToBob: false,
    knownDisaster: null,
    activeDialogue: null,
    dialogueIndex: 0,
    activeNpc: null,

    start: () => {
      set((state) => {
        if (state.phase === "ready") {
          return { phase: "playing" };
        }
        return {};
      });
    },

    restart: () => {
      set(() => ({
        phase: "ready",
        disaster: DISASTERS[Math.floor(Math.random() * DISASTERS.length)],
        talkedToDan: false,
        talkedToBob: false,
        knownDisaster: null,
        activeDialogue: null,
        dialogueIndex: 0,
        activeNpc: null,
      }));
    },

    end: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },

    setDisaster: (d) => set({ disaster: d }),
    setTalkedToDan: () => set({ talkedToDan: true }),
    setTalkedToBob: () => set({ talkedToBob: true }),
    setKnownDisaster: (d) => set({ knownDisaster: d }),

    openDialogue: (npc, lines) =>
      set({ activeNpc: npc, activeDialogue: lines, dialogueIndex: 0 }),

    advanceDialogue: () => {
      const { dialogueIndex, activeDialogue } = get();
      if (activeDialogue && dialogueIndex < activeDialogue.length - 1) {
        set({ dialogueIndex: dialogueIndex + 1 });
      } else {
        set({ activeDialogue: null, dialogueIndex: 0, activeNpc: null });
      }
    },

    closeDialogue: () =>
      set({ activeDialogue: null, dialogueIndex: 0, activeNpc: null }),
  }))
);
