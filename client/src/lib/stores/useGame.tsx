import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";
export type GameWorld = "town" | "ocean";
export type DisasterType = "hurricane" | "wildfire" | "earthquake";

export type ItemType =
  | "sandbag"
  | "wood_board"
  | "flame_retardant"
  | "rake"
  | "safety_strap"
  | "wrench";

export interface CarriedItemInfo {
  type: ItemType;
  id: string;
}

interface DialogueLine {
  speaker: string;
  text: string;
}

interface HurricaneTasks {
  frontDoorSandbagged: boolean;
  backDoorSandbagged: boolean;
  window1Boarded: boolean;
  window2Boarded: boolean;
}

interface WildfireTasks {
  houseSprayed: boolean;
  vegetationCleared: boolean;
}

interface EarthquakeTasks {
  furnitureStrapped: boolean;
  gasShutOff: boolean;
}

interface GameState {
  phase: GamePhase;
  disaster: DisasterType | null;
  talkedToDan: boolean;
  talkedToBob: boolean;
  knownDisaster: DisasterType | null;
  reportedToDan: boolean;
  activeDialogue: DialogueLine[] | null;
  dialogueIndex: number;
  activeNpc: string | null;

  carriedItem: CarriedItemInfo | null;
  consumedItems: Set<string>;
  hurricaneTasks: HurricaneTasks;
  wildfireTasks: WildfireTasks;
  earthquakeTasks: EarthquakeTasks;
  questCompleted: boolean;
  questFailed: boolean;
  failReason: string | null;
  tasksActive: boolean;
  practiceUnlocked: boolean;
  practiceActive: boolean;
  practiceScore: number;
  practiceCompleted: boolean;
  portalActive: boolean;
  currentWorld: GameWorld;
  world2Dialogue: { speaker: string; text: string }[] | null;
  world2DialogueIndex: number;

  start: () => void;
  restart: () => void;
  end: () => void;
  setDisaster: (d: DisasterType) => void;
  setTalkedToDan: () => void;
  setTalkedToBob: () => void;
  setKnownDisaster: (d: DisasterType) => void;
  setReportedToDan: () => void;
  openDialogue: (npc: string, lines: DialogueLine[]) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;

  pickUpItem: (type: ItemType, id: string) => void;
  dropItem: () => void;
  isItemConsumed: (id: string) => boolean;
  completeHurricaneTask: (task: keyof HurricaneTasks) => void;
  completeWildfireTask: (task: keyof WildfireTasks) => void;
  completeEarthquakeTask: (task: keyof EarthquakeTasks) => void;
  failQuest: (reason: string) => void;
  activateTasks: () => void;
  checkQuestCompletion: () => void;
  unlockPractice: () => void;
  openPractice: () => void;
  closePractice: () => void;
  addPracticeScore: (points: number) => void;
  resetPracticeScore: () => void;
  completePractice: () => void;
  enterPortal: () => void;
  openWorld2Dialogue: (lines: { speaker: string; text: string }[]) => void;
  advanceWorld2Dialogue: () => void;
  closeWorld2Dialogue: () => void;
}

const DISASTERS: DisasterType[] = ["hurricane", "wildfire", "earthquake"];

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    disaster: DISASTERS[Math.floor(Math.random() * DISASTERS.length)],
    talkedToDan: false,
    talkedToBob: false,
    knownDisaster: null,
    reportedToDan: false,
    activeDialogue: null,
    dialogueIndex: 0,
    activeNpc: null,

    carriedItem: null,
    consumedItems: new Set<string>(),
    hurricaneTasks: {
      frontDoorSandbagged: false,
      backDoorSandbagged: false,
      window1Boarded: false,
      window2Boarded: false,
    },
    wildfireTasks: {
      houseSprayed: false,
      vegetationCleared: false,
    },
    earthquakeTasks: {
      furnitureStrapped: false,
      gasShutOff: false,
    },
    questCompleted: false,
    questFailed: false,
    failReason: null,
    tasksActive: false,
    practiceUnlocked: false,
    practiceActive: false,
    practiceScore: 0,
    practiceCompleted: false,
    portalActive: false,
    currentWorld: "town" as GameWorld,
    world2Dialogue: null,
    world2DialogueIndex: 0,

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
        reportedToDan: false,
        activeDialogue: null,
        dialogueIndex: 0,
        activeNpc: null,
        carriedItem: null,
        consumedItems: new Set<string>(),
        hurricaneTasks: {
          frontDoorSandbagged: false,
          backDoorSandbagged: false,
          window1Boarded: false,
          window2Boarded: false,
        },
        wildfireTasks: {
          houseSprayed: false,
          vegetationCleared: false,
        },
        earthquakeTasks: {
          furnitureStrapped: false,
          gasShutOff: false,
        },
        questCompleted: false,
        questFailed: false,
        failReason: null,
        tasksActive: false,
        practiceUnlocked: false,
        practiceActive: false,
        practiceScore: 0,
        practiceCompleted: false,
        portalActive: false,
        currentWorld: "town" as GameWorld,
        world2Dialogue: null,
        world2DialogueIndex: 0,
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
    setReportedToDan: () => set({ reportedToDan: true }),

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

    pickUpItem: (type, id) => {
      const { carriedItem } = get();
      if (!carriedItem) {
        set({ carriedItem: { type, id } });
      }
    },

    dropItem: () => set({ carriedItem: null }),

    isItemConsumed: (id) => {
      return get().consumedItems.has(id);
    },

    completeHurricaneTask: (task) => {
      const { carriedItem, consumedItems } = get();
      const newConsumed = new Set(consumedItems);
      if (carriedItem) newConsumed.add(carriedItem.id);
      set((state) => ({
        hurricaneTasks: { ...state.hurricaneTasks, [task]: true },
        carriedItem: null,
        consumedItems: newConsumed,
      }));
      setTimeout(() => get().checkQuestCompletion(), 0);
    },

    completeWildfireTask: (task) => {
      const { carriedItem, consumedItems } = get();
      const newConsumed = new Set(consumedItems);
      if (carriedItem) newConsumed.add(carriedItem.id);
      set((state) => ({
        wildfireTasks: { ...state.wildfireTasks, [task]: true },
        carriedItem: null,
        consumedItems: newConsumed,
      }));
      setTimeout(() => get().checkQuestCompletion(), 0);
    },

    completeEarthquakeTask: (task) => {
      const { carriedItem, consumedItems } = get();
      const newConsumed = new Set(consumedItems);
      if (carriedItem) newConsumed.add(carriedItem.id);
      set((state) => ({
        earthquakeTasks: { ...state.earthquakeTasks, [task]: true },
        carriedItem: null,
        consumedItems: newConsumed,
      }));
      setTimeout(() => get().checkQuestCompletion(), 0);
    },

    failQuest: (reason: string) => {
      const { carriedItem, consumedItems } = get();
      const newConsumed = new Set(consumedItems);
      if (carriedItem) newConsumed.add(carriedItem.id);
      set({
        questFailed: true,
        failReason: reason,
        carriedItem: null,
        consumedItems: newConsumed,
      });
    },

    activateTasks: () => set({ tasksActive: true }),

    unlockPractice: () => set({ practiceUnlocked: true }),
    openPractice: () => set({ practiceActive: true }),
    closePractice: () => set({ practiceActive: false }),
    addPracticeScore: (points: number) => set((state) => ({ practiceScore: state.practiceScore + points })),
    resetPracticeScore: () => set({ practiceScore: 0 }),
    completePractice: () => {
      const { questCompleted } = get();
      set({
        practiceCompleted: true,
        portalActive: questCompleted,
      });
    },
    enterPortal: () => {
      set({
        currentWorld: "ocean" as GameWorld,
        phase: "playing" as GamePhase,
        activeDialogue: null,
        dialogueIndex: 0,
        activeNpc: null,
        practiceActive: false,
        world2Dialogue: null,
        world2DialogueIndex: 0,
      });
    },
    openWorld2Dialogue: (lines) =>
      set({ world2Dialogue: lines, world2DialogueIndex: 0 }),
    advanceWorld2Dialogue: () => {
      const { world2DialogueIndex, world2Dialogue } = get();
      if (world2Dialogue && world2DialogueIndex < world2Dialogue.length - 1) {
        set({ world2DialogueIndex: world2DialogueIndex + 1 });
      } else {
        set({ world2Dialogue: null, world2DialogueIndex: 0 });
      }
    },
    closeWorld2Dialogue: () =>
      set({ world2Dialogue: null, world2DialogueIndex: 0 }),

    checkQuestCompletion: () => {
      const { knownDisaster, hurricaneTasks, wildfireTasks, earthquakeTasks } = get();
      let completed = false;
      if (knownDisaster === "hurricane") {
        completed =
          hurricaneTasks.frontDoorSandbagged &&
          hurricaneTasks.backDoorSandbagged &&
          hurricaneTasks.window1Boarded &&
          hurricaneTasks.window2Boarded;
      } else if (knownDisaster === "wildfire") {
        completed =
          wildfireTasks.houseSprayed && wildfireTasks.vegetationCleared;
      } else if (knownDisaster === "earthquake") {
        completed =
          earthquakeTasks.furnitureStrapped && earthquakeTasks.gasShutOff;
      }
      if (completed) {
        const { practiceCompleted } = get();
        set({
          questCompleted: true,
          portalActive: practiceCompleted,
        });
      }
    },
  }))
);
