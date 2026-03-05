import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";
export type GameWorld = "town" | "ocean" | "factory";
export type DisasterType = "hurricane" | "wildfire" | "earthquake";
export type EnvironmentalIssue = "trash" | "nets" | "oil_spill";

export interface MachineOrderSettings {
  quantity: number;
  size: string;
  color1: string;
  color2: string;
  color3?: string;
  lettering: string;
}

export interface EcosystemData {
  name: string;
  position: [number, number, number];
  animalCount: number;
  plantCount: number;
  issue: EnvironmentalIssue;
  surveyed: boolean;
}

export interface SludgePatch {
  position: [number, number, number];
  cleaned: boolean;
}

const ISSUE_TYPES: EnvironmentalIssue[] = ["trash", "nets", "oil_spill"];

function generateSludgePatches(): SludgePatch[] {
  return [
    { position: [-15, -0.2, -20], cleaned: false },
    { position: [10, -0.2, -25], cleaned: false },
    { position: [-25, -0.2, -35], cleaned: false },
    { position: [20, -0.2, -30], cleaned: false },
    { position: [0, -0.2, -45], cleaned: false },
    { position: [-10, -0.2, -50], cleaned: false },
    { position: [15, -0.2, -55], cleaned: false },
    { position: [-20, -0.2, -15], cleaned: false },
  ];
}

function generateEcosystems(): EcosystemData[] {
  const baseEcosystems = [
    { name: "Coral Reef", position: [-30, -1, -30] as [number, number, number], baseAnimals: 5, plantCount: 4 },
    { name: "Kelp Forest", position: [35, -1, -25] as [number, number, number], baseAnimals: 4, plantCount: 6 },
    { name: "Tide Pool", position: [-35, -1, -60] as [number, number, number], baseAnimals: 3, plantCount: 3 },
    { name: "Seagrass Meadow", position: [-30, -1, -75] as [number, number, number], baseAnimals: 4, plantCount: 5 },
  ];
  return baseEcosystems.map((eco) => {
    const issue = ISSUE_TYPES[Math.floor(Math.random() * 3)];
    const trappedFishCount = issue === "nets" ? 3 : 0;
    return {
      name: eco.name,
      position: eco.position,
      animalCount: eco.baseAnimals + trappedFishCount,
      plantCount: eco.plantCount,
      issue,
      surveyed: false,
    };
  });
}

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

  oceanQuestStarted: boolean;
  ecosystems: EcosystemData[];
  currentSurveyIndex: number | null;
  oceanQuestCompleted: boolean;
  hasDivingSuit: boolean;

  cleanupQuestStarted: boolean;
  inBoat: boolean;
  sludgePatches: SludgePatch[];
  cleanupQuestCompleted: boolean;
  oceanLessonPhase: number;
  oceanPracticeUnlocked: boolean;
  oceanPracticeActive: boolean;
  oceanPracticeScore: number;
  oceanPracticeCompleted: boolean;
  oceanPortalActive: boolean;

  world3Dialogue: { speaker: string; text: string }[] | null;
  world3DialogueIndex: number;
  factoryQuestStarted: boolean;

  activeMachine: "hat" | "tshirt" | "jacket" | null;
  hatMachineState: "idle" | "produced" | "picked_up" | "boxed" | "loaded";
  tshirtMachineState: "idle" | "produced" | "picked_up" | "boxed" | "loaded";
  jacketMachineState: "idle" | "produced" | "picked_up" | "boxed" | "loaded";
  carryingProduct: "hats" | "tshirts" | "jackets" | null;
  carryingBox: "hats" | "tshirts" | "jackets" | null;
  factoryOrderComplete: boolean;

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

  startOceanQuest: () => void;
  openSurvey: (index: number) => void;
  closeSurvey: () => void;
  completeEcosystemSurvey: (index: number) => void;
  completeOceanQuest: () => void;
  equipDivingSuit: () => void;

  startCleanupQuest: () => void;
  boardBoat: () => void;
  exitBoat: () => void;
  cleanSludge: (index: number) => void;
  completeCleanupQuest: () => void;
  advanceOceanLesson: () => void;
  unlockOceanPractice: () => void;
  openOceanPractice: () => void;
  closeOceanPractice: () => void;
  addOceanPracticeScore: (points: number) => void;
  resetOceanPracticeScore: () => void;
  completeOceanPractice: () => void;
  enterFactoryPortal: () => void;

  openWorld3Dialogue: (lines: { speaker: string; text: string }[]) => void;
  advanceWorld3Dialogue: () => void;
  closeWorld3Dialogue: () => void;
  startFactoryQuest: () => void;

  openMachineSettings: (machine: "hat" | "tshirt" | "jacket") => void;
  closeMachineSettings: () => void;
  submitMachineOrder: (machine: "hat" | "tshirt" | "jacket", settings: MachineOrderSettings) => string | null;
  pickUpProduct: (product: "hats" | "tshirts" | "jackets") => void;
  boxProduct: () => void;
  loadBox: () => void;
  checkFactoryComplete: () => void;
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

    oceanQuestStarted: false,
    ecosystems: generateEcosystems(),
    currentSurveyIndex: null,
    oceanQuestCompleted: false,
    hasDivingSuit: false,

    cleanupQuestStarted: false,
    inBoat: false,
    sludgePatches: generateSludgePatches(),
    cleanupQuestCompleted: false,
    oceanLessonPhase: 0,
    oceanPracticeUnlocked: false,
    oceanPracticeActive: false,
    oceanPracticeScore: 0,
    oceanPracticeCompleted: false,
    oceanPortalActive: false,

    world3Dialogue: null,
    world3DialogueIndex: 0,
    factoryQuestStarted: false,

    activeMachine: null,
    hatMachineState: "idle",
    tshirtMachineState: "idle",
    jacketMachineState: "idle",
    carryingProduct: null,
    carryingBox: null,
    factoryOrderComplete: false,

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
        oceanQuestStarted: false,
        ecosystems: generateEcosystems(),
        currentSurveyIndex: null,
        oceanQuestCompleted: false,
        hasDivingSuit: false,
        cleanupQuestStarted: false,
        inBoat: false,
        sludgePatches: generateSludgePatches(),
        cleanupQuestCompleted: false,
        oceanLessonPhase: 0,
        oceanPracticeUnlocked: false,
        oceanPracticeActive: false,
        oceanPracticeScore: 0,
        oceanPracticeCompleted: false,
        oceanPortalActive: false,
        world3Dialogue: null,
        world3DialogueIndex: 0,
        factoryQuestStarted: false,
        activeMachine: null,
        hatMachineState: "idle",
        tshirtMachineState: "idle",
        jacketMachineState: "idle",
        carryingProduct: null,
        carryingBox: null,
        factoryOrderComplete: false,
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

    startOceanQuest: () => set({ oceanQuestStarted: true }),
    openSurvey: (index: number) => set({ currentSurveyIndex: index }),
    closeSurvey: () => set({ currentSurveyIndex: null }),
    completeEcosystemSurvey: (index: number) => {
      const { ecosystems } = get();
      const updated = ecosystems.map((eco, i) =>
        i === index ? { ...eco, surveyed: true } : eco
      );
      set({ ecosystems: updated, currentSurveyIndex: null });
    },
    completeOceanQuest: () => set({ oceanQuestCompleted: true }),
    equipDivingSuit: () => set({ hasDivingSuit: true }),

    startCleanupQuest: () => set({ cleanupQuestStarted: true }),
    boardBoat: () => set({ inBoat: true }),
    exitBoat: () => set({ inBoat: false }),
    cleanSludge: (index: number) => {
      const { sludgePatches } = get();
      const updated = sludgePatches.map((patch, i) =>
        i === index ? { ...patch, cleaned: true } : patch
      );
      set({ sludgePatches: updated });
    },
    completeCleanupQuest: () => set({ cleanupQuestCompleted: true, oceanLessonPhase: 1 }),
    advanceOceanLesson: () => {
      const next = Math.min(get().oceanLessonPhase + 1, 3);
      set({ oceanLessonPhase: next });
      if (next === 3) {
        set({ oceanPracticeUnlocked: true });
      }
    },
    unlockOceanPractice: () => set({ oceanPracticeUnlocked: true }),
    openOceanPractice: () => set({ oceanPracticeActive: true }),
    closeOceanPractice: () => set({ oceanPracticeActive: false }),
    addOceanPracticeScore: (points: number) => set((state) => ({ oceanPracticeScore: state.oceanPracticeScore + points })),
    resetOceanPracticeScore: () => set({ oceanPracticeScore: 0 }),
    completeOceanPractice: () => set({ oceanPracticeCompleted: true, oceanPracticeActive: false, oceanPortalActive: true }),

    enterFactoryPortal: () => {
      set({
        currentWorld: "factory" as GameWorld,
        phase: "playing" as GamePhase,
        world2Dialogue: null,
        world2DialogueIndex: 0,
        oceanPracticeActive: false,
        world3Dialogue: null,
        world3DialogueIndex: 0,
      });
    },

    openWorld3Dialogue: (lines) =>
      set({ world3Dialogue: lines, world3DialogueIndex: 0 }),
    advanceWorld3Dialogue: () => {
      const { world3DialogueIndex, world3Dialogue } = get();
      if (world3Dialogue && world3DialogueIndex < world3Dialogue.length - 1) {
        set({ world3DialogueIndex: world3DialogueIndex + 1 });
      } else {
        set({ world3Dialogue: null, world3DialogueIndex: 0 });
      }
    },
    closeWorld3Dialogue: () =>
      set({ world3Dialogue: null, world3DialogueIndex: 0 }),
    startFactoryQuest: () => set({ factoryQuestStarted: true }),

    openMachineSettings: (machine) => set({ activeMachine: machine }),
    closeMachineSettings: () => set({ activeMachine: null }),
    submitMachineOrder: (machine, settings) => {
      const normalize = (s: string) => s.trim().toLowerCase();
      if (machine === "hat") {
        if (settings.quantity !== 2) return "Quantity should be 2 hats!";
        if (normalize(settings.size) !== "large") return "Size should be Large!";
        if (normalize(settings.color1) !== "white") return "Top color should be White!";
        if (normalize(settings.color2) !== "#43a047" && normalize(settings.color2) !== "green") return "Brim color should be Green!";
        if (normalize(settings.lettering) !== "italy") return 'Lettering should be "Italy"!';
        set({ hatMachineState: "produced", activeMachine: null });
        return null;
      } else if (machine === "tshirt") {
        if (settings.quantity !== 3) return "Quantity should be 3 t-shirts!";
        if (normalize(settings.size) !== "medium") return "Size should be Medium!";
        if (normalize(settings.color1) !== "#e53935" && normalize(settings.color1) !== "red") return "Sleeve color should be Red!";
        if (normalize(settings.color2) !== "#1e88e5" && normalize(settings.color2) !== "blue") return "Body color should be Blue!";
        if (normalize(settings.color3 || "") !== "white") return "Lettering color should be White!";
        if (normalize(settings.lettering) !== "usa") return 'Lettering should be "USA"!';
        set({ tshirtMachineState: "produced", activeMachine: null });
        return null;
      } else if (machine === "jacket") {
        if (settings.quantity !== 5) return "Quantity should be 5 jackets!";
        if (normalize(settings.size) !== "large") return "Size should be Large!";
        if (normalize(settings.color1) !== "black") return "Sleeve color should be Black!";
        if (normalize(settings.color2) !== "#e53935" && normalize(settings.color2) !== "red") return "Body color should be Red!";
        if (normalize(settings.color3 || "") !== "#fdd835" && normalize(settings.color3 || "") !== "yellow") return "Lettering color should be Yellow!";
        if (normalize(settings.lettering) !== "germany") return 'Lettering should be "Germany"!';
        set({ jacketMachineState: "produced", activeMachine: null });
        return null;
      }
      return null;
    },
    pickUpProduct: (product) => {
      if (product === "hats") set({ hatMachineState: "picked_up", carryingProduct: "hats" });
      else if (product === "tshirts") set({ tshirtMachineState: "picked_up", carryingProduct: "tshirts" });
      else if (product === "jackets") set({ jacketMachineState: "picked_up", carryingProduct: "jackets" });
    },
    boxProduct: () => {
      const { carryingProduct } = get();
      if (!carryingProduct) return;
      if (carryingProduct === "hats") set({ hatMachineState: "boxed", carryingProduct: null, carryingBox: "hats" });
      else if (carryingProduct === "tshirts") set({ tshirtMachineState: "boxed", carryingProduct: null, carryingBox: "tshirts" });
      else if (carryingProduct === "jackets") set({ jacketMachineState: "boxed", carryingProduct: null, carryingBox: "jackets" });
    },
    loadBox: () => {
      const { carryingBox } = get();
      if (!carryingBox) return;
      if (carryingBox === "hats") set({ hatMachineState: "loaded", carryingBox: null });
      else if (carryingBox === "tshirts") set({ tshirtMachineState: "loaded", carryingBox: null });
      else if (carryingBox === "jackets") set({ jacketMachineState: "loaded", carryingBox: null });
      const state = get();
      if (state.hatMachineState === "loaded" && state.tshirtMachineState === "loaded" && state.jacketMachineState === "loaded") {
        set({ factoryOrderComplete: true });
      }
    },
    checkFactoryComplete: () => {
      const { hatMachineState, tshirtMachineState, jacketMachineState } = get();
      if (hatMachineState === "loaded" && tshirtMachineState === "loaded" && jacketMachineState === "loaded") {
        set({ factoryOrderComplete: true });
      }
    },

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
