import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import GAME_CONFIG from "../../gameConfig";
import type { GameConfig, DialogueLine } from "../../gameConfig";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  config: GameConfig;

  scenario: string;
  talkedToQuestGiver: boolean;
  talkedToRevealer: boolean;
  knownScenario: boolean;
  reportedBack: boolean;
  tasksActive: boolean;

  completedTasks: Record<string, boolean>;
  carriedItem: string | null;
  consumedItems: Set<string>;

  questCompleted: boolean;
  questFailed: boolean;
  failReason: string | null;

  activeDialogue: { speaker: string; lines: DialogueLine[] } | null;

  practiceUnlocked: boolean;
  practiceActive: boolean;
  practiceScore: number;

  start: () => void;
  restart: () => void;
  end: () => void;

  setTalkedToQuestGiver: (v: boolean) => void;
  setTalkedToRevealer: (v: boolean) => void;
  setKnownScenario: (v: boolean) => void;
  setReportedBack: (v: boolean) => void;
  activateTasks: () => void;

  openDialogue: (speaker: string, lines: DialogueLine[]) => void;
  closeDialogue: () => void;

  pickUpItem: (itemType: string, itemId: string) => void;
  dropItem: () => void;
  completeTask: (taskId: string) => void;
  failQuest: (reason: string) => void;
  checkQuestCompletion: () => void;

  unlockPractice: () => void;
  openPractice: () => void;
  closePractice: () => void;
  addPracticeScore: (points: number) => void;
  resetPracticeScore: () => void;
}

function pickRandomScenario(config: GameConfig): string {
  const scenarios = config.scenarios;
  return scenarios[Math.floor(Math.random() * scenarios.length)].id;
}

function buildInitialTasks(config: GameConfig): Record<string, boolean> {
  const tasks: Record<string, boolean> = {};
  for (const target of config.taskTargets) {
    tasks[target.id] = false;
  }
  return tasks;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    config: GAME_CONFIG,

    scenario: pickRandomScenario(GAME_CONFIG),
    talkedToQuestGiver: false,
    talkedToRevealer: false,
    knownScenario: false,
    reportedBack: false,
    tasksActive: false,

    completedTasks: buildInitialTasks(GAME_CONFIG),
    carriedItem: null,
    consumedItems: new Set<string>(),

    questCompleted: false,
    questFailed: false,
    failReason: null,

    activeDialogue: null,

    practiceUnlocked: false,
    practiceActive: false,
    practiceScore: 0,

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
        scenario: pickRandomScenario(GAME_CONFIG),
        talkedToQuestGiver: false,
        talkedToRevealer: false,
        knownScenario: false,
        reportedBack: false,
        tasksActive: false,
        completedTasks: buildInitialTasks(GAME_CONFIG),
        carriedItem: null,
        consumedItems: new Set<string>(),
        questCompleted: false,
        questFailed: false,
        failReason: null,
        activeDialogue: null,
        practiceUnlocked: false,
        practiceActive: false,
        practiceScore: 0,
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

    setTalkedToQuestGiver: (v) => set({ talkedToQuestGiver: v }),
    setTalkedToRevealer: (v) => set({ talkedToRevealer: v }),
    setKnownScenario: (v) => set({ knownScenario: v }),
    setReportedBack: (v) => set({ reportedBack: v }),
    activateTasks: () => set({ tasksActive: true }),

    openDialogue: (speaker, lines) => set({ activeDialogue: { speaker, lines } }),
    closeDialogue: () => set({ activeDialogue: null }),

    pickUpItem: (itemType, itemId) => {
      set((state) => ({
        carriedItem: itemType,
        consumedItems: new Set([...state.consumedItems, itemId]),
      }));
    },

    dropItem: () => set({ carriedItem: null }),

    completeTask: (taskId) => {
      set((state) => {
        const updated = { ...state.completedTasks, [taskId]: true };
        return { completedTasks: updated, carriedItem: null };
      });
      get().checkQuestCompletion();
    },

    failQuest: (reason) => {
      set({ questFailed: true, failReason: reason, carriedItem: null });
    },

    checkQuestCompletion: () => {
      const { scenario, completedTasks, config } = get();
      const scenarioConfig = config.scenarios.find((s) => s.id === scenario);
      if (!scenarioConfig) return;
      const allDone = scenarioConfig.tasks.every((taskId) => completedTasks[taskId]);
      if (allDone) {
        set({ questCompleted: true });
      }
    },

    unlockPractice: () => set({ practiceUnlocked: true }),
    openPractice: () => set({ practiceActive: true }),
    closePractice: () => set({ practiceActive: false }),
    addPracticeScore: (points) => set((state) => ({ practiceScore: state.practiceScore + points })),
    resetPracticeScore: () => set({ practiceScore: 0 }),
  }))
);
