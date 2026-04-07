import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useQuestionPrefetch } from "./useQuestionPrefetch";
import { TOWN_QUESTIONS, TOWN_LESSON_QUESTIONS } from "../../components/game/townQuestions";
import { FACTORY_QUESTIONS } from "../../components/game/factoryQuestions";
import { OCEAN_QUESTIONS } from "../../components/game/oceanQuestions";
import { PSYCHIC_QUESTIONS } from "../../components/game/psychicQuestions";

export type GamePhase = "ready" | "playing" | "ended";
export type GameWorld = "town" | "ocean" | "factory" | "psychic";
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
  factoryLessonPhase: number;
  factoryPracticeUnlocked: boolean;
  factoryPracticeActive: boolean;
  factoryPracticeScore: number;
  factoryPracticeCompleted: boolean;
  factoryPortalActive: boolean;

  psychicBalance: number;
  psychicCustomer: { name: string; color: string; favoriteNumber: number } | null;
  psychicGuesses: { guess: number; result: "high" | "low" | "correct" }[];
  psychicGuessesRemaining: number;
  psychicGamePhase: "instructions" | "waiting" | "entering" | "guessing" | "won" | "lost" | "round_win" | "round_lose" | "transition" | "lesson" | "practice";
  psychicCustomersServed: number;
  psychicRound: 1 | 2 | 3;
  psychicSequentialStart: number | null;
  psychicLastGuess: number | null;
  psychicBinaryMin: number;
  psychicBinaryMax: number;
  psychicGuessHint: string | null;
  psychicPracticeActive: boolean;
  psychicPracticeScore: number;
  psychicPracticeCompleted: boolean;
  psychicWorldBonusAwarded: boolean;

  totalScore: number;
  firstTryCount: number;
  townQuestBonusAwarded: boolean;
  oceanQuestBonusAwarded: boolean;
  factoryQuestBonusAwarded: boolean;
  factoryStagePointsAwarded: Set<string>;
  townWorldBonusAwarded: boolean;
  oceanWorldBonusAwarded: boolean;
  factoryWorldBonusAwarded: boolean;

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
  retryQuest: () => void;
  respawnTrigger: number;
  activateTasks: () => void;
  checkQuestCompletion: () => void;
  unlockPractice: () => void;
  openPractice: () => void;
  closePractice: () => void;
  addPracticeScore: (points: number) => void;
  resetPracticeScore: () => void;
  addTotalScore: (points: number) => void;
  incrementFirstTry: () => void;
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
  advanceFactoryLesson: () => void;
  unlockFactoryPractice: () => void;
  openFactoryPractice: () => void;
  closeFactoryPractice: () => void;
  addFactoryPracticeScore: (points: number) => void;
  resetFactoryPracticeScore: () => void;
  completeFactoryPractice: () => void;
  enterPsychicPortal: () => void;

  dismissPsychicInstructions: () => void;
  summonPsychicCustomer: () => void;
  seatPsychicCustomer: () => void;
  submitPsychicGuess: (guess: number) => void;
  psychicCustomerEnd: () => void;
  psychicAdvanceRound: () => void;
  psychicRetryRound: () => void;
  psychicStartLesson: () => void;
  openPsychicPractice: () => void;
  closePsychicPractice: () => void;
  addPsychicPracticeScore: (points: number) => void;
  resetPsychicPracticeScore: () => void;
  completePsychicPractice: () => void;
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
    respawnTrigger: 0,
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
    factoryLessonPhase: 0,
    factoryPracticeUnlocked: false,
    factoryPracticeActive: false,
    factoryPracticeScore: 0,
    factoryPracticeCompleted: false,
    factoryPortalActive: false,

    psychicBalance: 0,
    psychicCustomer: null,
    psychicGuesses: [],
    psychicGuessesRemaining: 10,
    psychicGamePhase: "instructions",
    psychicCustomersServed: 0,
    psychicRound: 1,
    psychicSequentialStart: null,
    psychicLastGuess: null,
    psychicBinaryMin: 1,
    psychicBinaryMax: 100,
    psychicGuessHint: null,
    psychicPracticeActive: false,
    psychicPracticeScore: 0,
    psychicPracticeCompleted: false,
    psychicWorldBonusAwarded: false,

    totalScore: 0,
    firstTryCount: 0,
    townQuestBonusAwarded: false,
    oceanQuestBonusAwarded: false,
    factoryQuestBonusAwarded: false,
    factoryStagePointsAwarded: new Set<string>(),
    townWorldBonusAwarded: false,
    oceanWorldBonusAwarded: false,
    factoryWorldBonusAwarded: false,

    start: () => {
      set((state) => {
        if (state.phase === "ready") {
          const prefetch = useQuestionPrefetch.getState().prefetchQuestions;
          prefetch("town", TOWN_QUESTIONS);
          prefetch("town-lesson", TOWN_LESSON_QUESTIONS);
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
        factoryLessonPhase: 0,
        factoryPracticeUnlocked: false,
        factoryPracticeActive: false,
        factoryPracticeScore: 0,
        factoryPracticeCompleted: false,
        factoryPortalActive: false,
        psychicBalance: 0,
        psychicCustomer: null,
        psychicGuesses: [],
        psychicGuessesRemaining: 10,
        psychicGamePhase: "instructions",
        psychicCustomersServed: 0,
        psychicRound: 1,
        psychicSequentialStart: null,
        psychicLastGuess: null,
        psychicBinaryMin: 1,
        psychicBinaryMax: 100,
        psychicGuessHint: null,
        psychicPracticeActive: false,
        psychicPracticeScore: 0,
        psychicPracticeCompleted: false,
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
        questCompleted: false,
        failReason: reason,
        carriedItem: null,
        consumedItems: newConsumed,
      });
    },

    retryQuest: () => {
      set((state) => ({
        questFailed: false,
        failReason: null,
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
        respawnTrigger: state.respawnTrigger + 1,
      }));
    },

    activateTasks: () => set({ tasksActive: true }),

    unlockPractice: () => set({ practiceUnlocked: true }),
    openPractice: () => set({ practiceActive: true }),
    closePractice: () => set({ practiceActive: false }),
    addPracticeScore: (points: number) => set((state) => ({ practiceScore: state.practiceScore + points, totalScore: state.totalScore + points })),
    resetPracticeScore: () => set({ practiceScore: 0 }),
    incrementFirstTry: () => set((state) => ({ firstTryCount: state.firstTryCount + 1, totalScore: state.totalScore + 5 })),
    addTotalScore: (points: number) => set((state) => ({ totalScore: state.totalScore + points })),
    completePractice: () => {
      const { questCompleted, townWorldBonusAwarded } = get();
      const bonus = townWorldBonusAwarded ? 0 : 50;
      set((state) => ({
        practiceCompleted: true,
        portalActive: questCompleted,
        townWorldBonusAwarded: true,
        totalScore: state.totalScore + bonus,
      }));
    },
    enterPortal: () => {
      const prefetch = useQuestionPrefetch.getState().prefetchQuestions;
      prefetch("ocean", OCEAN_QUESTIONS);
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
    completeOceanQuest: () => {
      const { oceanQuestBonusAwarded } = get();
      const bonus = oceanQuestBonusAwarded ? 0 : 25;
      set((state) => ({
        oceanQuestCompleted: true,
        oceanQuestBonusAwarded: true,
        totalScore: state.totalScore + bonus,
      }));
    },
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
    addOceanPracticeScore: (points: number) => set((state) => ({ oceanPracticeScore: state.oceanPracticeScore + points, totalScore: state.totalScore + points })),
    resetOceanPracticeScore: () => set({ oceanPracticeScore: 0 }),
    completeOceanPractice: () => {
      const { oceanWorldBonusAwarded } = get();
      const bonus = oceanWorldBonusAwarded ? 0 : 50;
      set((state) => ({
        oceanPracticeCompleted: true,
        oceanPortalActive: true,
        oceanWorldBonusAwarded: true,
        totalScore: state.totalScore + bonus,
      }));
    },

    enterFactoryPortal: () => {
      const prefetch = useQuestionPrefetch.getState().prefetchQuestions;
      prefetch("factory", FACTORY_QUESTIONS);
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
        if (settings.quantity !== 2) return "Check the quantity — that's not right.";
        if (normalize(settings.size) !== "large") return "Check the size — that's not right.";
        if (normalize(settings.color1) !== "white") return "Check the top color — that's not right.";
        if (normalize(settings.color2) !== "#43a047" && normalize(settings.color2) !== "green") return "Check the brim color — that's not right.";
        if (normalize(settings.lettering) !== "italy") return "Check the lettering — that's not right.";
        const key = "config-hat";
        const awarded = get().factoryStagePointsAwarded;
        const bonus = awarded.has(key) ? 0 : 5;
        set((s) => ({ hatMachineState: "produced", activeMachine: null, factoryStagePointsAwarded: new Set([...s.factoryStagePointsAwarded, key]), totalScore: s.totalScore + bonus }));
        return null;
      } else if (machine === "tshirt") {
        if (settings.quantity !== 3) return "Check the quantity — that's not right.";
        if (normalize(settings.size) !== "medium") return "Check the size — that's not right.";
        if (normalize(settings.color1) !== "#e53935" && normalize(settings.color1) !== "red") return "Check the sleeve color — that's not right.";
        if (normalize(settings.color2) !== "#1e88e5" && normalize(settings.color2) !== "blue") return "Check the body color — that's not right.";
        if (normalize(settings.color3 || "") !== "white") return "Check the lettering color — that's not right.";
        if (normalize(settings.lettering) !== "usa") return "Check the lettering — that's not right.";
        const key = "config-tshirt";
        const awarded = get().factoryStagePointsAwarded;
        const bonus = awarded.has(key) ? 0 : 5;
        set((s) => ({ tshirtMachineState: "produced", activeMachine: null, factoryStagePointsAwarded: new Set([...s.factoryStagePointsAwarded, key]), totalScore: s.totalScore + bonus }));
        return null;
      } else if (machine === "jacket") {
        if (settings.quantity !== 5) return "Check the quantity — that's not right.";
        if (normalize(settings.size) !== "large") return "Check the size — that's not right.";
        if (normalize(settings.color1) !== "black") return "Check the sleeve color — that's not right.";
        if (normalize(settings.color2) !== "#e53935" && normalize(settings.color2) !== "red") return "Check the body color — that's not right.";
        if (normalize(settings.color3 || "") !== "#fdd835" && normalize(settings.color3 || "") !== "yellow") return "Check the lettering color — that's not right.";
        if (normalize(settings.lettering) !== "germany") return "Check the lettering — that's not right.";
        const key = "config-jacket";
        const awarded = get().factoryStagePointsAwarded;
        const bonus = awarded.has(key) ? 0 : 5;
        set((s) => ({ jacketMachineState: "produced", activeMachine: null, factoryStagePointsAwarded: new Set([...s.factoryStagePointsAwarded, key]), totalScore: s.totalScore + bonus }));
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
      const loadKey = `load-${carryingBox}`;
      const loadAwarded = get().factoryStagePointsAwarded;
      const loadBonus = loadAwarded.has(loadKey) ? 0 : 5;
      if (carryingBox === "hats") set((s) => ({ hatMachineState: "loaded", carryingBox: null, factoryStagePointsAwarded: new Set([...s.factoryStagePointsAwarded, loadKey]), totalScore: s.totalScore + loadBonus }));
      else if (carryingBox === "tshirts") set((s) => ({ tshirtMachineState: "loaded", carryingBox: null, factoryStagePointsAwarded: new Set([...s.factoryStagePointsAwarded, loadKey]), totalScore: s.totalScore + loadBonus }));
      else if (carryingBox === "jackets") set((s) => ({ jacketMachineState: "loaded", carryingBox: null, factoryStagePointsAwarded: new Set([...s.factoryStagePointsAwarded, loadKey]), totalScore: s.totalScore + loadBonus }));
      const state = get();
      if (state.hatMachineState === "loaded" && state.tshirtMachineState === "loaded" && state.jacketMachineState === "loaded") {
        const bonus = state.factoryQuestBonusAwarded ? 0 : 25;
        set((s) => ({ factoryOrderComplete: true, factoryLessonPhase: 1, factoryQuestBonusAwarded: true, totalScore: s.totalScore + bonus }));
      }
    },
    checkFactoryComplete: () => {
      const { hatMachineState, tshirtMachineState, jacketMachineState, factoryQuestBonusAwarded } = get();
      if (hatMachineState === "loaded" && tshirtMachineState === "loaded" && jacketMachineState === "loaded") {
        const bonus = factoryQuestBonusAwarded ? 0 : 25;
        set((s) => ({ factoryOrderComplete: true, factoryLessonPhase: 1, factoryQuestBonusAwarded: true, totalScore: s.totalScore + bonus }));
      }
    },
    advanceFactoryLesson: () => {
      const { factoryLessonPhase } = get();
      if (factoryLessonPhase < 2) {
        set({ factoryLessonPhase: factoryLessonPhase + 1 });
      }
    },
    unlockFactoryPractice: () =>
      set({ factoryPracticeUnlocked: true, factoryLessonPhase: 0 }),
    openFactoryPractice: () =>
      set({ factoryPracticeActive: true, factoryPracticeScore: 0 }),
    closeFactoryPractice: () =>
      set({ factoryPracticeActive: false }),
    addFactoryPracticeScore: (points) =>
      set((s) => ({ factoryPracticeScore: s.factoryPracticeScore + points, totalScore: s.totalScore + points })),
    resetFactoryPracticeScore: () =>
      set({ factoryPracticeScore: 0 }),
    completeFactoryPractice: () => {
      const { factoryWorldBonusAwarded } = get();
      const bonus = factoryWorldBonusAwarded ? 0 : 50;
      set((state) => ({
        factoryPracticeCompleted: true,
        factoryPortalActive: true,
        factoryWorldBonusAwarded: true,
        totalScore: state.totalScore + bonus,
      }));
    },

    enterPsychicPortal: () => {
      const prefetch = useQuestionPrefetch.getState().prefetchQuestions;
      prefetch("psychic", PSYCHIC_QUESTIONS);
      set({
        currentWorld: "psychic" as GameWorld,
        phase: "playing" as GamePhase,
        world3Dialogue: null,
        world3DialogueIndex: 0,
        factoryPracticeActive: false,
        psychicGamePhase: "instructions",
        psychicCustomer: null,
        psychicGuesses: [],
        psychicGuessesRemaining: 10,
        psychicBalance: 0,
        psychicCustomersServed: 0,
        psychicRound: 1,
        psychicSequentialStart: null,
        psychicLastGuess: null,
        psychicBinaryMin: 1,
        psychicBinaryMax: 100,
        psychicGuessHint: null,
      });
    },

    dismissPsychicInstructions: () => set({ psychicGamePhase: "waiting" }),

    summonPsychicCustomer: () => {
      const names = ["Alex", "Jamie", "Morgan", "Casey", "Riley", "Jordan", "Taylor", "Quinn", "Avery", "Skyler", "Dakota", "Reese", "Parker", "Sage", "Finley", "Emery", "Rowan", "Phoenix", "Blair", "Drew"];
      const colors = ["#e53935", "#1e88e5", "#43a047", "#8e24aa", "#f4511e", "#00897b", "#d81b60", "#5e35b1", "#fb8c00", "#3949ab"];
      const name = names[Math.floor(Math.random() * names.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const favoriteNumber = Math.floor(Math.random() * 100) + 1;
      set({
        psychicCustomer: { name, color, favoriteNumber },
        psychicGuesses: [],
        psychicGuessesRemaining: 10,
        psychicGamePhase: "entering",
        psychicSequentialStart: null,
        psychicLastGuess: null,
        psychicBinaryMin: 1,
        psychicBinaryMax: 100,
        psychicGuessHint: null,
      });
    },

    seatPsychicCustomer: () => set({ psychicGamePhase: "guessing" }),

    submitPsychicGuess: (guess: number) => {
      const { psychicCustomer, psychicGuesses, psychicGuessesRemaining, psychicGamePhase, psychicRound, psychicLastGuess, psychicBinaryMin, psychicBinaryMax } = get();
      if (!psychicCustomer || psychicGuessesRemaining <= 0 || psychicGamePhase !== "guessing") return;

      if (psychicRound === 2 && psychicLastGuess !== null) {
        const expectedNext = psychicLastGuess + 1;
        if (expectedNext <= 100 && guess !== expectedNext) {
          set({ psychicGuessHint: `Remember, guess sequentially! Your next guess should be ${expectedNext}.` });
          return;
        }
      }

      if (psychicRound === 3) {
        const expectedGuess = Math.floor((psychicBinaryMin + psychicBinaryMax) / 2);
        if (guess !== expectedGuess) {
          set({ psychicGuessHint: `Use binary search! The range is ${psychicBinaryMin}-${psychicBinaryMax}, so guess the middle: ${expectedGuess}` });
          return;
        }
      }

      const target = psychicCustomer.favoriteNumber;
      let result: "high" | "low" | "correct";
      if (guess === target) result = "correct";
      else if (guess > target) result = "high";
      else result = "low";

      const newGuesses = [...psychicGuesses, { guess, result }];
      const remaining = psychicGuessesRemaining - 1;

      let newBinaryMin = psychicBinaryMin;
      let newBinaryMax = psychicBinaryMax;
      if (psychicRound === 3 && result !== "correct") {
        if (result === "low") newBinaryMin = guess + 1;
        if (result === "high") newBinaryMax = guess - 1;
      }

      if (result === "correct") {
        set((s) => ({
          psychicGuesses: newGuesses,
          psychicGuessesRemaining: remaining,
          psychicGamePhase: "won" as const,
          psychicBalance: s.psychicBalance + 100,
          psychicCustomersServed: s.psychicCustomersServed + 1,
          psychicLastGuess: guess,
          psychicBinaryMin: newBinaryMin,
          psychicBinaryMax: newBinaryMax,
          psychicGuessHint: null,
        }));
      } else if (remaining <= 0) {
        set((s) => ({
          psychicGuesses: newGuesses,
          psychicGuessesRemaining: 0,
          psychicGamePhase: "lost" as const,
          psychicBalance: s.psychicBalance - 100,
          psychicCustomersServed: s.psychicCustomersServed + 1,
          psychicLastGuess: guess,
          psychicBinaryMin: newBinaryMin,
          psychicBinaryMax: newBinaryMax,
          psychicGuessHint: null,
        }));
      } else {
        set({
          psychicGuesses: newGuesses,
          psychicGuessesRemaining: remaining,
          psychicLastGuess: guess,
          psychicBinaryMin: newBinaryMin,
          psychicBinaryMax: newBinaryMax,
          psychicGuessHint: null,
        });
      }
    },

    psychicCustomerEnd: () => {
      const { psychicBalance, psychicRound } = get();
      const winThreshold = psychicRound === 3 ? 300 : 200;
      const loseThreshold = -200;

      if (psychicBalance >= winThreshold) {
        set({ psychicGamePhase: "round_win" });
      } else if (psychicBalance <= loseThreshold) {
        set({ psychicGamePhase: "round_lose" });
      } else {
        set({
          psychicGamePhase: "waiting",
          psychicCustomer: null,
          psychicGuesses: [],
          psychicGuessesRemaining: 10,
          psychicGuessHint: null,
          psychicSequentialStart: null,
          psychicLastGuess: null,
          psychicBinaryMin: 1,
          psychicBinaryMax: 100,
        });
      }
    },

    psychicAdvanceRound: () => {
      const { psychicRound } = get();
      const nextRound = (psychicRound + 1) as 1 | 2 | 3;
      set({
        psychicGamePhase: "transition",
        psychicRound: nextRound,
        psychicBalance: 0,
        psychicCustomer: null,
        psychicGuesses: [],
        psychicGuessesRemaining: 10,
        psychicCustomersServed: 0,
        psychicSequentialStart: null,
        psychicLastGuess: null,
        psychicBinaryMin: 1,
        psychicBinaryMax: 100,
        psychicGuessHint: null,
      });
    },

    psychicRetryRound: () => {
      set({
        psychicGamePhase: "waiting",
        psychicBalance: 0,
        psychicCustomer: null,
        psychicGuesses: [],
        psychicGuessesRemaining: 10,
        psychicCustomersServed: 0,
        psychicSequentialStart: null,
        psychicLastGuess: null,
        psychicBinaryMin: 1,
        psychicBinaryMax: 100,
        psychicGuessHint: null,
      });
    },

    psychicStartLesson: () => set({ psychicGamePhase: "lesson" }),

    openPsychicPractice: () =>
      set({ psychicPracticeActive: true, psychicPracticeScore: 0, psychicGamePhase: "practice" }),
    closePsychicPractice: () =>
      set({ psychicPracticeActive: false, psychicGamePhase: "lesson" }),
    addPsychicPracticeScore: (points) =>
      set((s) => ({ psychicPracticeScore: s.psychicPracticeScore + points, totalScore: s.totalScore + points })),
    resetPsychicPracticeScore: () =>
      set({ psychicPracticeScore: 0 }),
    completePsychicPractice: () => {
      const s = get();
      const bonus = s.psychicWorldBonusAwarded ? 0 : 50;
      set({
        psychicPracticeCompleted: true,
        psychicWorldBonusAwarded: true,
        totalScore: s.totalScore + bonus,
      });
    },

    checkQuestCompletion: () => {
      const { knownDisaster, hurricaneTasks, wildfireTasks, earthquakeTasks, questFailed } = get();
      if (questFailed) return;
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
        const { practiceCompleted, townQuestBonusAwarded } = get();
        const bonus = townQuestBonusAwarded ? 0 : 25;
        set((state) => ({
          questCompleted: true,
          portalActive: practiceCompleted,
          townQuestBonusAwarded: true,
          totalScore: state.totalScore + bonus,
        }));
      }
    },
  }))
);
