import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useGame } from "./useGame";

function getState() {
  return useGame.getState();
}

function resetStore() {
  getState().restart();
}

describe("useGame store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("phase transitions", () => {
    it("starts in ready phase", () => {
      expect(getState().phase).toBe("ready");
    });

    it("transitions from ready to playing on start", () => {
      getState().start();
      expect(getState().phase).toBe("playing");
    });

    it("does not transition to playing if not in ready phase", () => {
      getState().start();
      getState().end();
      expect(getState().phase).toBe("ended");
      getState().start();
      expect(getState().phase).toBe("ended");
    });

    it("transitions from playing to ended on end", () => {
      getState().start();
      getState().end();
      expect(getState().phase).toBe("ended");
    });

    it("does not transition to ended if not in playing phase", () => {
      getState().end();
      expect(getState().phase).toBe("ready");
    });

    it("restart resets to ready phase", () => {
      getState().start();
      getState().restart();
      expect(getState().phase).toBe("ready");
    });
  });

  describe("disaster selection", () => {
    it("initializes with a valid disaster", () => {
      const disaster = getState().disaster;
      expect(["hurricane", "wildfire", "earthquake"]).toContain(disaster);
    });

    it("setDisaster updates the disaster", () => {
      getState().setDisaster("earthquake");
      expect(getState().disaster).toBe("earthquake");
    });
  });

  describe("NPC interactions", () => {
    it("sets talkedToDan", () => {
      expect(getState().talkedToDan).toBe(false);
      getState().setTalkedToDan();
      expect(getState().talkedToDan).toBe(true);
    });

    it("sets talkedToBob", () => {
      expect(getState().talkedToBob).toBe(false);
      getState().setTalkedToBob();
      expect(getState().talkedToBob).toBe(true);
    });

    it("sets knownDisaster", () => {
      expect(getState().knownDisaster).toBe(null);
      getState().setKnownDisaster("wildfire");
      expect(getState().knownDisaster).toBe("wildfire");
    });

    it("sets reportedToDan", () => {
      expect(getState().reportedToDan).toBe(false);
      getState().setReportedToDan();
      expect(getState().reportedToDan).toBe(true);
    });
  });

  describe("dialogue system", () => {
    const lines = [
      { speaker: "Dan", text: "Hello!" },
      { speaker: "Dan", text: "How are you?" },
      { speaker: "Dan", text: "Goodbye!" },
    ];

    it("opens dialogue with correct state", () => {
      getState().openDialogue("Dan", lines);
      expect(getState().activeDialogue).toEqual(lines);
      expect(getState().dialogueIndex).toBe(0);
      expect(getState().activeNpc).toBe("Dan");
    });

    it("advances dialogue through lines", () => {
      getState().openDialogue("Dan", lines);
      getState().advanceDialogue();
      expect(getState().dialogueIndex).toBe(1);
      getState().advanceDialogue();
      expect(getState().dialogueIndex).toBe(2);
    });

    it("closes dialogue when advancing past the last line", () => {
      getState().openDialogue("Dan", lines);
      getState().advanceDialogue();
      getState().advanceDialogue();
      getState().advanceDialogue();
      expect(getState().activeDialogue).toBe(null);
      expect(getState().dialogueIndex).toBe(0);
      expect(getState().activeNpc).toBe(null);
    });

    it("closes dialogue manually", () => {
      getState().openDialogue("Dan", lines);
      getState().closeDialogue();
      expect(getState().activeDialogue).toBe(null);
      expect(getState().activeNpc).toBe(null);
    });
  });

  describe("inventory system", () => {
    it("picks up an item when hands are empty", () => {
      getState().pickUpItem("sandbag", "sandbag-1");
      expect(getState().carriedItem).toEqual({ type: "sandbag", id: "sandbag-1" });
    });

    it("does not pick up a second item when already carrying one", () => {
      getState().pickUpItem("sandbag", "sandbag-1");
      getState().pickUpItem("rake", "rake-1");
      expect(getState().carriedItem).toEqual({ type: "sandbag", id: "sandbag-1" });
    });

    it("drops the carried item", () => {
      getState().pickUpItem("sandbag", "sandbag-1");
      getState().dropItem();
      expect(getState().carriedItem).toBe(null);
    });

    it("tracks consumed items", () => {
      expect(getState().isItemConsumed("sandbag-1")).toBe(false);
      getState().pickUpItem("sandbag", "sandbag-1");
      getState().setKnownDisaster("hurricane");
      getState().completeHurricaneTask("frontDoorSandbagged");
      expect(getState().isItemConsumed("sandbag-1")).toBe(true);
    });
  });

  describe("hurricane quest tasks", () => {
    beforeEach(() => {
      getState().setKnownDisaster("hurricane");
    });

    it("completes individual hurricane tasks", () => {
      getState().pickUpItem("sandbag", "s1");
      getState().completeHurricaneTask("frontDoorSandbagged");
      expect(getState().hurricaneTasks.frontDoorSandbagged).toBe(true);
      expect(getState().carriedItem).toBe(null);
    });

    it("consumes the item used for the task", () => {
      getState().pickUpItem("sandbag", "s1");
      getState().completeHurricaneTask("frontDoorSandbagged");
      expect(getState().isItemConsumed("s1")).toBe(true);
    });

    it("completes the quest when all hurricane tasks are done", () => {
      getState().pickUpItem("sandbag", "s1");
      getState().completeHurricaneTask("frontDoorSandbagged");
      getState().pickUpItem("sandbag", "s2");
      getState().completeHurricaneTask("backDoorSandbagged");
      getState().pickUpItem("wood_board", "w1");
      getState().completeHurricaneTask("window1Boarded");
      getState().pickUpItem("wood_board", "w2");
      getState().completeHurricaneTask("window2Boarded");

      vi.runAllTimers();
      expect(getState().questCompleted).toBe(true);
    });

    it("does not complete quest with partial hurricane tasks", () => {
      getState().pickUpItem("sandbag", "s1");
      getState().completeHurricaneTask("frontDoorSandbagged");
      getState().pickUpItem("sandbag", "s2");
      getState().completeHurricaneTask("backDoorSandbagged");

      vi.runAllTimers();
      expect(getState().questCompleted).toBe(false);
    });
  });

  describe("wildfire quest tasks", () => {
    beforeEach(() => {
      getState().setKnownDisaster("wildfire");
    });

    it("completes individual wildfire tasks", () => {
      getState().pickUpItem("flame_retardant", "f1");
      getState().completeWildfireTask("houseSprayed");
      expect(getState().wildfireTasks.houseSprayed).toBe(true);
      expect(getState().carriedItem).toBe(null);
    });

    it("completes the quest when all wildfire tasks are done", () => {
      getState().pickUpItem("flame_retardant", "f1");
      getState().completeWildfireTask("houseSprayed");
      getState().pickUpItem("rake", "r1");
      getState().completeWildfireTask("vegetationCleared");

      vi.runAllTimers();
      expect(getState().questCompleted).toBe(true);
    });

    it("does not complete quest with only one wildfire task", () => {
      getState().pickUpItem("flame_retardant", "f1");
      getState().completeWildfireTask("houseSprayed");

      vi.runAllTimers();
      expect(getState().questCompleted).toBe(false);
    });
  });

  describe("earthquake quest tasks", () => {
    beforeEach(() => {
      getState().setKnownDisaster("earthquake");
    });

    it("completes individual earthquake tasks", () => {
      getState().pickUpItem("safety_strap", "ss1");
      getState().completeEarthquakeTask("furnitureStrapped");
      expect(getState().earthquakeTasks.furnitureStrapped).toBe(true);
    });

    it("completes the quest when all earthquake tasks are done", () => {
      getState().pickUpItem("safety_strap", "ss1");
      getState().completeEarthquakeTask("furnitureStrapped");
      getState().pickUpItem("wrench", "wr1");
      getState().completeEarthquakeTask("gasShutOff");

      vi.runAllTimers();
      expect(getState().questCompleted).toBe(true);
    });

    it("does not complete quest with only one earthquake task", () => {
      getState().pickUpItem("safety_strap", "ss1");
      getState().completeEarthquakeTask("furnitureStrapped");

      vi.runAllTimers();
      expect(getState().questCompleted).toBe(false);
    });
  });

  describe("quest failure", () => {
    it("fails the quest with a reason", () => {
      getState().pickUpItem("sandbag", "s1");
      getState().failQuest("Used wrong item!");
      expect(getState().questFailed).toBe(true);
      expect(getState().failReason).toBe("Used wrong item!");
      expect(getState().carriedItem).toBe(null);
      expect(getState().isItemConsumed("s1")).toBe(true);
    });

    it("fails the quest without a carried item", () => {
      getState().failQuest("Wrong action!");
      expect(getState().questFailed).toBe(true);
      expect(getState().failReason).toBe("Wrong action!");
    });
  });

  describe("practice quiz", () => {
    it("unlocks practice", () => {
      getState().unlockPractice();
      expect(getState().practiceUnlocked).toBe(true);
    });

    it("opens and closes practice", () => {
      getState().openPractice();
      expect(getState().practiceActive).toBe(true);
      getState().closePractice();
      expect(getState().practiceActive).toBe(false);
    });

    it("adds and resets practice score", () => {
      getState().addPracticeScore(10);
      getState().addPracticeScore(10);
      expect(getState().practiceScore).toBe(20);
      getState().resetPracticeScore();
      expect(getState().practiceScore).toBe(0);
    });

    it("completes practice and activates portal when quest is complete", () => {
      getState().setKnownDisaster("wildfire");
      getState().pickUpItem("flame_retardant", "f1");
      getState().completeWildfireTask("houseSprayed");
      getState().pickUpItem("rake", "r1");
      getState().completeWildfireTask("vegetationCleared");
      vi.runAllTimers();

      getState().completePractice();
      expect(getState().practiceCompleted).toBe(true);
      expect(getState().portalActive).toBe(true);
    });

    it("completes practice but does not activate portal when quest is incomplete", () => {
      getState().completePractice();
      expect(getState().practiceCompleted).toBe(true);
      expect(getState().portalActive).toBe(false);
    });
  });

  describe("world transitions", () => {
    it("enters portal and transitions to ocean world", () => {
      getState().enterPortal();
      expect(getState().currentWorld).toBe("ocean");
      expect(getState().phase).toBe("playing");
    });

    it("enterPortal clears dialogue and practice state", () => {
      getState().openDialogue("Dan", [{ speaker: "Dan", text: "Hi" }]);
      getState().openPractice();
      getState().enterPortal();
      expect(getState().activeDialogue).toBe(null);
      expect(getState().dialogueIndex).toBe(0);
      expect(getState().activeNpc).toBe(null);
      expect(getState().practiceActive).toBe(false);
      expect(getState().world2Dialogue).toBe(null);
      expect(getState().world2DialogueIndex).toBe(0);
    });

    it("enters factory portal and transitions to factory world", () => {
      getState().enterFactoryPortal();
      expect(getState().currentWorld).toBe("factory");
      expect(getState().phase).toBe("playing");
    });

    it("enterFactoryPortal clears dialogue and practice state", () => {
      getState().openWorld2Dialogue([{ speaker: "Josh", text: "Hi" }]);
      getState().openOceanPractice();
      getState().enterFactoryPortal();
      expect(getState().world2Dialogue).toBe(null);
      expect(getState().world2DialogueIndex).toBe(0);
      expect(getState().oceanPracticeActive).toBe(false);
      expect(getState().world3Dialogue).toBe(null);
      expect(getState().world3DialogueIndex).toBe(0);
    });
  });

  describe("world 2 dialogue", () => {
    const lines = [
      { speaker: "Josh", text: "Welcome!" },
      { speaker: "Josh", text: "Let's explore!" },
    ];

    it("opens world 2 dialogue", () => {
      getState().openWorld2Dialogue(lines);
      expect(getState().world2Dialogue).toEqual(lines);
      expect(getState().world2DialogueIndex).toBe(0);
    });

    it("advances world 2 dialogue", () => {
      getState().openWorld2Dialogue(lines);
      getState().advanceWorld2Dialogue();
      expect(getState().world2DialogueIndex).toBe(1);
    });

    it("closes world 2 dialogue when advancing past the end", () => {
      getState().openWorld2Dialogue(lines);
      getState().advanceWorld2Dialogue();
      getState().advanceWorld2Dialogue();
      expect(getState().world2Dialogue).toBe(null);
      expect(getState().world2DialogueIndex).toBe(0);
    });

    it("closes world 2 dialogue manually", () => {
      getState().openWorld2Dialogue(lines);
      getState().closeWorld2Dialogue();
      expect(getState().world2Dialogue).toBe(null);
    });
  });

  describe("ocean quest", () => {
    it("starts the ocean quest", () => {
      getState().startOceanQuest();
      expect(getState().oceanQuestStarted).toBe(true);
    });

    it("generates 4 ecosystems", () => {
      expect(getState().ecosystems).toHaveLength(4);
    });

    it("ecosystems have valid structure", () => {
      const eco = getState().ecosystems[0];
      expect(eco).toHaveProperty("name");
      expect(eco).toHaveProperty("position");
      expect(eco).toHaveProperty("animalCount");
      expect(eco).toHaveProperty("plantCount");
      expect(eco).toHaveProperty("issue");
      expect(eco).toHaveProperty("surveyed");
      expect(eco.surveyed).toBe(false);
      expect(["trash", "nets", "oil_spill"]).toContain(eco.issue);
    });

    it("ecosystems have correct names", () => {
      const names = getState().ecosystems.map((e) => e.name);
      expect(names).toEqual(["Coral Reef", "Kelp Forest", "Tide Pool", "Seagrass Meadow"]);
    });

    it("opens and closes survey", () => {
      getState().openSurvey(0);
      expect(getState().currentSurveyIndex).toBe(0);
      getState().closeSurvey();
      expect(getState().currentSurveyIndex).toBe(null);
    });

    it("completes ecosystem survey", () => {
      getState().completeEcosystemSurvey(1);
      expect(getState().ecosystems[1].surveyed).toBe(true);
      expect(getState().ecosystems[0].surveyed).toBe(false);
      expect(getState().currentSurveyIndex).toBe(null);
    });

    it("completes multiple ecosystem surveys independently", () => {
      getState().completeEcosystemSurvey(0);
      getState().completeEcosystemSurvey(2);
      expect(getState().ecosystems[0].surveyed).toBe(true);
      expect(getState().ecosystems[1].surveyed).toBe(false);
      expect(getState().ecosystems[2].surveyed).toBe(true);
      expect(getState().ecosystems[3].surveyed).toBe(false);
    });

    it("completes the ocean quest", () => {
      getState().completeOceanQuest();
      expect(getState().oceanQuestCompleted).toBe(true);
    });

    it("equips diving suit", () => {
      getState().equipDivingSuit();
      expect(getState().hasDivingSuit).toBe(true);
    });
  });

  describe("cleanup quest", () => {
    it("starts the cleanup quest", () => {
      getState().startCleanupQuest();
      expect(getState().cleanupQuestStarted).toBe(true);
    });

    it("generates 8 sludge patches", () => {
      expect(getState().sludgePatches).toHaveLength(8);
    });

    it("sludge patches start uncleaned", () => {
      getState().sludgePatches.forEach((patch) => {
        expect(patch.cleaned).toBe(false);
      });
    });

    it("boards and exits boat", () => {
      getState().boardBoat();
      expect(getState().inBoat).toBe(true);
      getState().exitBoat();
      expect(getState().inBoat).toBe(false);
    });

    it("cleans a sludge patch", () => {
      getState().cleanSludge(0);
      expect(getState().sludgePatches[0].cleaned).toBe(true);
      expect(getState().sludgePatches[1].cleaned).toBe(false);
    });

    it("cleans multiple sludge patches independently", () => {
      getState().cleanSludge(0);
      getState().cleanSludge(3);
      getState().cleanSludge(7);
      expect(getState().sludgePatches[0].cleaned).toBe(true);
      expect(getState().sludgePatches[1].cleaned).toBe(false);
      expect(getState().sludgePatches[3].cleaned).toBe(true);
      expect(getState().sludgePatches[7].cleaned).toBe(true);
    });

    it("completes the cleanup quest", () => {
      getState().completeCleanupQuest();
      expect(getState().cleanupQuestCompleted).toBe(true);
      expect(getState().oceanLessonPhase).toBe(1);
    });
  });

  describe("ocean lesson and practice", () => {
    it("advances ocean lesson phases", () => {
      getState().completeCleanupQuest();
      expect(getState().oceanLessonPhase).toBe(1);
      getState().advanceOceanLesson();
      expect(getState().oceanLessonPhase).toBe(2);
      getState().advanceOceanLesson();
      expect(getState().oceanLessonPhase).toBe(3);
      expect(getState().oceanPracticeUnlocked).toBe(true);
    });

    it("does not advance ocean lesson past phase 3", () => {
      getState().completeCleanupQuest();
      getState().advanceOceanLesson();
      getState().advanceOceanLesson();
      getState().advanceOceanLesson();
      expect(getState().oceanLessonPhase).toBe(3);
    });

    it("unlocks ocean practice explicitly", () => {
      getState().unlockOceanPractice();
      expect(getState().oceanPracticeUnlocked).toBe(true);
    });

    it("opens and closes ocean practice", () => {
      getState().openOceanPractice();
      expect(getState().oceanPracticeActive).toBe(true);
      getState().closeOceanPractice();
      expect(getState().oceanPracticeActive).toBe(false);
    });

    it("adds and resets ocean practice score", () => {
      getState().addOceanPracticeScore(10);
      getState().addOceanPracticeScore(10);
      expect(getState().oceanPracticeScore).toBe(20);
      getState().resetOceanPracticeScore();
      expect(getState().oceanPracticeScore).toBe(0);
    });

    it("completes ocean practice and activates portal", () => {
      getState().completeOceanPractice();
      expect(getState().oceanPracticeCompleted).toBe(true);
      expect(getState().oceanPortalActive).toBe(true);
    });
  });

  describe("world 3 dialogue", () => {
    const lines = [
      { speaker: "George", text: "Welcome to the factory!" },
      { speaker: "George", text: "Let me show you around." },
    ];

    it("opens world 3 dialogue", () => {
      getState().openWorld3Dialogue(lines);
      expect(getState().world3Dialogue).toEqual(lines);
      expect(getState().world3DialogueIndex).toBe(0);
    });

    it("advances world 3 dialogue", () => {
      getState().openWorld3Dialogue(lines);
      getState().advanceWorld3Dialogue();
      expect(getState().world3DialogueIndex).toBe(1);
    });

    it("closes world 3 dialogue when advancing past the end", () => {
      getState().openWorld3Dialogue(lines);
      getState().advanceWorld3Dialogue();
      getState().advanceWorld3Dialogue();
      expect(getState().world3Dialogue).toBe(null);
    });

    it("closes world 3 dialogue manually", () => {
      getState().openWorld3Dialogue(lines);
      getState().closeWorld3Dialogue();
      expect(getState().world3Dialogue).toBe(null);
    });
  });

  describe("factory quest", () => {
    it("starts the factory quest", () => {
      getState().startFactoryQuest();
      expect(getState().factoryQuestStarted).toBe(true);
    });

    it("opens and closes machine settings", () => {
      getState().openMachineSettings("hat");
      expect(getState().activeMachine).toBe("hat");
      getState().closeMachineSettings();
      expect(getState().activeMachine).toBe(null);
    });

    it("opens machine settings for different machines", () => {
      getState().openMachineSettings("tshirt");
      expect(getState().activeMachine).toBe("tshirt");
      getState().openMachineSettings("jacket");
      expect(getState().activeMachine).toBe("jacket");
    });
  });

  describe("submitMachineOrder - hat", () => {
    it("accepts correct hat order", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Large",
        color1: "White",
        color2: "Green",
        lettering: "Italy",
      });
      expect(result).toBe(null);
      expect(getState().hatMachineState).toBe("produced");
      expect(getState().activeMachine).toBe(null);
    });

    it("accepts hat order with hex color code for brim", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Large",
        color1: "White",
        color2: "#43a047",
        lettering: "Italy",
      });
      expect(result).toBe(null);
      expect(getState().hatMachineState).toBe("produced");
    });

    it("rejects wrong quantity for hats", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 3,
        size: "Large",
        color1: "White",
        color2: "Green",
        lettering: "Italy",
      });
      expect(result).toBe("Quantity should be 2 hats!");
      expect(getState().hatMachineState).toBe("idle");
    });

    it("rejects wrong size for hats", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Medium",
        color1: "White",
        color2: "Green",
        lettering: "Italy",
      });
      expect(result).toBe("Size should be Large!");
    });

    it("rejects wrong top color for hats", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Large",
        color1: "Red",
        color2: "Green",
        lettering: "Italy",
      });
      expect(result).toBe("Top color should be White!");
    });

    it("rejects wrong brim color for hats", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Large",
        color1: "White",
        color2: "Red",
        lettering: "Italy",
      });
      expect(result).toBe("Brim color should be Green!");
    });

    it("rejects wrong lettering for hats", () => {
      const result = getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Large",
        color1: "White",
        color2: "Green",
        lettering: "France",
      });
      expect(result).toBe('Lettering should be "Italy"!');
    });
  });

  describe("submitMachineOrder - tshirt", () => {
    it("accepts correct tshirt order", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Medium",
        color1: "Red",
        color2: "Blue",
        color3: "White",
        lettering: "USA",
      });
      expect(result).toBe(null);
      expect(getState().tshirtMachineState).toBe("produced");
    });

    it("accepts tshirt order with hex color codes", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Medium",
        color1: "#e53935",
        color2: "#1e88e5",
        color3: "White",
        lettering: "USA",
      });
      expect(result).toBe(null);
      expect(getState().tshirtMachineState).toBe("produced");
    });

    it("rejects wrong quantity for tshirts", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 2,
        size: "Medium",
        color1: "Red",
        color2: "Blue",
        color3: "White",
        lettering: "USA",
      });
      expect(result).toBe("Quantity should be 3 t-shirts!");
    });

    it("rejects wrong size for tshirts", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Large",
        color1: "Red",
        color2: "Blue",
        color3: "White",
        lettering: "USA",
      });
      expect(result).toBe("Size should be Medium!");
    });

    it("rejects wrong sleeve color for tshirts", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Medium",
        color1: "Green",
        color2: "Blue",
        color3: "White",
        lettering: "USA",
      });
      expect(result).toBe("Sleeve color should be Red!");
    });

    it("rejects wrong body color for tshirts", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Medium",
        color1: "Red",
        color2: "Green",
        color3: "White",
        lettering: "USA",
      });
      expect(result).toBe("Body color should be Blue!");
    });

    it("rejects wrong lettering color for tshirts", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Medium",
        color1: "Red",
        color2: "Blue",
        color3: "Red",
        lettering: "USA",
      });
      expect(result).toBe("Lettering color should be White!");
    });

    it("rejects wrong lettering for tshirts", () => {
      const result = getState().submitMachineOrder("tshirt", {
        quantity: 3,
        size: "Medium",
        color1: "Red",
        color2: "Blue",
        color3: "White",
        lettering: "Canada",
      });
      expect(result).toBe('Lettering should be "USA"!');
    });
  });

  describe("submitMachineOrder - jacket", () => {
    it("accepts correct jacket order", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Large",
        color1: "Black",
        color2: "Red",
        color3: "Yellow",
        lettering: "Germany",
      });
      expect(result).toBe(null);
      expect(getState().jacketMachineState).toBe("produced");
    });

    it("accepts jacket order with hex color codes", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Large",
        color1: "Black",
        color2: "#e53935",
        color3: "#fdd835",
        lettering: "Germany",
      });
      expect(result).toBe(null);
      expect(getState().jacketMachineState).toBe("produced");
    });

    it("rejects wrong quantity for jackets", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 3,
        size: "Large",
        color1: "Black",
        color2: "Red",
        color3: "Yellow",
        lettering: "Germany",
      });
      expect(result).toBe("Quantity should be 5 jackets!");
    });

    it("rejects wrong size for jackets", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Medium",
        color1: "Black",
        color2: "Red",
        color3: "Yellow",
        lettering: "Germany",
      });
      expect(result).toBe("Size should be Large!");
    });

    it("rejects wrong sleeve color for jackets", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Large",
        color1: "White",
        color2: "Red",
        color3: "Yellow",
        lettering: "Germany",
      });
      expect(result).toBe("Sleeve color should be Black!");
    });

    it("rejects wrong body color for jackets", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Large",
        color1: "Black",
        color2: "Green",
        color3: "Yellow",
        lettering: "Germany",
      });
      expect(result).toBe("Body color should be Red!");
    });

    it("rejects wrong lettering color for jackets", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Large",
        color1: "Black",
        color2: "Red",
        color3: "Blue",
        lettering: "Germany",
      });
      expect(result).toBe("Lettering color should be Yellow!");
    });

    it("rejects wrong lettering for jackets", () => {
      const result = getState().submitMachineOrder("jacket", {
        quantity: 5,
        size: "Large",
        color1: "Black",
        color2: "Red",
        color3: "Yellow",
        lettering: "France",
      });
      expect(result).toBe('Lettering should be "Germany"!');
    });
  });

  describe("factory product workflow", () => {
    it("picks up product", () => {
      getState().submitMachineOrder("hat", {
        quantity: 2,
        size: "Large",
        color1: "White",
        color2: "Green",
        lettering: "Italy",
      });
      getState().pickUpProduct("hats");
      expect(getState().hatMachineState).toBe("picked_up");
      expect(getState().carryingProduct).toBe("hats");
    });

    it("boxes a product", () => {
      getState().pickUpProduct("tshirts");
      getState().boxProduct();
      expect(getState().tshirtMachineState).toBe("boxed");
      expect(getState().carryingProduct).toBe(null);
      expect(getState().carryingBox).toBe("tshirts");
    });

    it("does not box when not carrying a product", () => {
      getState().boxProduct();
      expect(getState().carryingBox).toBe(null);
    });

    it("loads a box", () => {
      getState().pickUpProduct("jackets");
      getState().boxProduct();
      getState().loadBox();
      expect(getState().jacketMachineState).toBe("loaded");
      expect(getState().carryingBox).toBe(null);
    });

    it("does not load when not carrying a box", () => {
      getState().loadBox();
      expect(getState().hatMachineState).toBe("idle");
    });

    it("completes factory order when all products are loaded", () => {
      getState().pickUpProduct("hats");
      getState().boxProduct();
      getState().loadBox();

      getState().pickUpProduct("tshirts");
      getState().boxProduct();
      getState().loadBox();

      getState().pickUpProduct("jackets");
      getState().boxProduct();
      getState().loadBox();

      expect(getState().factoryOrderComplete).toBe(true);
      expect(getState().factoryLessonPhase).toBe(1);
    });

    it("does not complete factory order with partial loads", () => {
      getState().pickUpProduct("hats");
      getState().boxProduct();
      getState().loadBox();

      getState().pickUpProduct("tshirts");
      getState().boxProduct();
      getState().loadBox();

      expect(getState().factoryOrderComplete).toBe(false);
    });
  });

  describe("factory lesson and practice", () => {
    it("advances factory lesson phases", () => {
      expect(getState().factoryLessonPhase).toBe(0);
      getState().advanceFactoryLesson();
      expect(getState().factoryLessonPhase).toBe(1);
      getState().advanceFactoryLesson();
      expect(getState().factoryLessonPhase).toBe(2);
    });

    it("does not advance factory lesson past phase 2", () => {
      getState().advanceFactoryLesson();
      getState().advanceFactoryLesson();
      getState().advanceFactoryLesson();
      expect(getState().factoryLessonPhase).toBe(2);
    });

    it("unlocks factory practice and resets lesson phase", () => {
      getState().advanceFactoryLesson();
      getState().unlockFactoryPractice();
      expect(getState().factoryPracticeUnlocked).toBe(true);
      expect(getState().factoryLessonPhase).toBe(0);
    });

    it("opens factory practice with reset score", () => {
      getState().addFactoryPracticeScore(20);
      getState().openFactoryPractice();
      expect(getState().factoryPracticeActive).toBe(true);
      expect(getState().factoryPracticeScore).toBe(0);
    });

    it("closes factory practice", () => {
      getState().openFactoryPractice();
      getState().closeFactoryPractice();
      expect(getState().factoryPracticeActive).toBe(false);
    });

    it("adds and resets factory practice score", () => {
      getState().addFactoryPracticeScore(10);
      getState().addFactoryPracticeScore(10);
      expect(getState().factoryPracticeScore).toBe(20);
      getState().resetFactoryPracticeScore();
      expect(getState().factoryPracticeScore).toBe(0);
    });

    it("completes factory practice", () => {
      getState().openFactoryPractice();
      getState().completeFactoryPractice();
      expect(getState().factoryPracticeCompleted).toBe(true);
    });
  });

  describe("checkQuestCompletion", () => {
    it("does not mark quest complete when no disaster is set", () => {
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(false);
    });

    it("marks quest complete for hurricane when all tasks done", () => {
      getState().setKnownDisaster("hurricane");
      useGame.setState({
        hurricaneTasks: {
          frontDoorSandbagged: true,
          backDoorSandbagged: true,
          window1Boarded: true,
          window2Boarded: true,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(true);
    });

    it("does not mark quest complete for hurricane with partial tasks", () => {
      getState().setKnownDisaster("hurricane");
      useGame.setState({
        hurricaneTasks: {
          frontDoorSandbagged: true,
          backDoorSandbagged: false,
          window1Boarded: true,
          window2Boarded: true,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(false);
    });

    it("marks quest complete for wildfire when all tasks done", () => {
      getState().setKnownDisaster("wildfire");
      useGame.setState({
        wildfireTasks: {
          houseSprayed: true,
          vegetationCleared: true,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(true);
    });

    it("does not mark quest complete for wildfire with partial tasks", () => {
      getState().setKnownDisaster("wildfire");
      useGame.setState({
        wildfireTasks: {
          houseSprayed: true,
          vegetationCleared: false,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(false);
    });

    it("marks quest complete for earthquake when all tasks done", () => {
      getState().setKnownDisaster("earthquake");
      useGame.setState({
        earthquakeTasks: {
          furnitureStrapped: true,
          gasShutOff: true,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(true);
    });

    it("does not mark quest complete for earthquake with partial tasks", () => {
      getState().setKnownDisaster("earthquake");
      useGame.setState({
        earthquakeTasks: {
          furnitureStrapped: true,
          gasShutOff: false,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(false);
    });

    it("activates portal on quest completion when practice is already complete", () => {
      getState().setKnownDisaster("wildfire");
      useGame.setState({
        practiceCompleted: true,
        wildfireTasks: {
          houseSprayed: true,
          vegetationCleared: true,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(true);
      expect(getState().portalActive).toBe(true);
    });

    it("does not activate portal on quest completion when practice is incomplete", () => {
      getState().setKnownDisaster("earthquake");
      useGame.setState({
        practiceCompleted: false,
        earthquakeTasks: {
          furnitureStrapped: true,
          gasShutOff: true,
        },
      });
      getState().checkQuestCompletion();
      expect(getState().questCompleted).toBe(true);
      expect(getState().portalActive).toBe(false);
    });
  });

  describe("checkFactoryComplete", () => {
    it("does not mark complete when not all loaded", () => {
      useGame.setState({ hatMachineState: "loaded", tshirtMachineState: "loaded", jacketMachineState: "boxed" });
      getState().checkFactoryComplete();
      expect(getState().factoryOrderComplete).toBe(false);
    });

    it("marks complete when all loaded", () => {
      useGame.setState({ hatMachineState: "loaded", tshirtMachineState: "loaded", jacketMachineState: "loaded" });
      getState().checkFactoryComplete();
      expect(getState().factoryOrderComplete).toBe(true);
      expect(getState().factoryLessonPhase).toBe(1);
    });

    it("does not mark complete with idle machines", () => {
      getState().checkFactoryComplete();
      expect(getState().factoryOrderComplete).toBe(false);
    });
  });

  describe("restart resets all state", () => {
    it("resets all quest and world state on restart", () => {
      getState().start();
      getState().setTalkedToDan();
      getState().setTalkedToBob();
      getState().setKnownDisaster("hurricane");
      getState().setReportedToDan();
      getState().pickUpItem("sandbag", "s1");
      getState().completeHurricaneTask("frontDoorSandbagged");
      vi.runAllTimers();
      getState().activateTasks();
      getState().unlockPractice();
      getState().openPractice();
      getState().addPracticeScore(30);
      getState().completePractice();
      getState().enterPortal();
      getState().startOceanQuest();
      getState().equipDivingSuit();
      getState().completeEcosystemSurvey(0);
      getState().completeOceanQuest();
      getState().startCleanupQuest();
      getState().boardBoat();
      getState().cleanSludge(0);
      getState().completeCleanupQuest();
      getState().advanceOceanLesson();
      getState().advanceOceanLesson();
      getState().openOceanPractice();
      getState().addOceanPracticeScore(40);
      getState().completeOceanPractice();
      getState().enterFactoryPortal();
      getState().startFactoryQuest();
      getState().openMachineSettings("hat");

      getState().restart();

      const state = getState();
      expect(state.phase).toBe("ready");
      expect(["hurricane", "wildfire", "earthquake"]).toContain(state.disaster);
      expect(state.talkedToDan).toBe(false);
      expect(state.talkedToBob).toBe(false);
      expect(state.knownDisaster).toBe(null);
      expect(state.reportedToDan).toBe(false);
      expect(state.activeDialogue).toBe(null);
      expect(state.dialogueIndex).toBe(0);
      expect(state.activeNpc).toBe(null);
      expect(state.carriedItem).toBe(null);
      expect(state.consumedItems.size).toBe(0);
      expect(state.hurricaneTasks).toEqual({
        frontDoorSandbagged: false,
        backDoorSandbagged: false,
        window1Boarded: false,
        window2Boarded: false,
      });
      expect(state.wildfireTasks).toEqual({
        houseSprayed: false,
        vegetationCleared: false,
      });
      expect(state.earthquakeTasks).toEqual({
        furnitureStrapped: false,
        gasShutOff: false,
      });
      expect(state.questCompleted).toBe(false);
      expect(state.questFailed).toBe(false);
      expect(state.failReason).toBe(null);
      expect(state.tasksActive).toBe(false);
      expect(state.practiceUnlocked).toBe(false);
      expect(state.practiceActive).toBe(false);
      expect(state.practiceScore).toBe(0);
      expect(state.practiceCompleted).toBe(false);
      expect(state.portalActive).toBe(false);
      expect(state.currentWorld).toBe("town");
      expect(state.world2Dialogue).toBe(null);
      expect(state.world2DialogueIndex).toBe(0);
      expect(state.oceanQuestStarted).toBe(false);
      expect(state.ecosystems).toHaveLength(4);
      expect(state.ecosystems.every((e) => !e.surveyed)).toBe(true);
      expect(state.currentSurveyIndex).toBe(null);
      expect(state.oceanQuestCompleted).toBe(false);
      expect(state.hasDivingSuit).toBe(false);
      expect(state.cleanupQuestStarted).toBe(false);
      expect(state.inBoat).toBe(false);
      expect(state.sludgePatches).toHaveLength(8);
      expect(state.sludgePatches.every((p) => !p.cleaned)).toBe(true);
      expect(state.cleanupQuestCompleted).toBe(false);
      expect(state.oceanLessonPhase).toBe(0);
      expect(state.oceanPracticeUnlocked).toBe(false);
      expect(state.oceanPracticeActive).toBe(false);
      expect(state.oceanPracticeScore).toBe(0);
      expect(state.oceanPracticeCompleted).toBe(false);
      expect(state.oceanPortalActive).toBe(false);
      expect(state.world3Dialogue).toBe(null);
      expect(state.world3DialogueIndex).toBe(0);
      expect(state.factoryQuestStarted).toBe(false);
      expect(state.activeMachine).toBe(null);
      expect(state.hatMachineState).toBe("idle");
      expect(state.tshirtMachineState).toBe("idle");
      expect(state.jacketMachineState).toBe("idle");
      expect(state.carryingProduct).toBe(null);
      expect(state.carryingBox).toBe(null);
      expect(state.factoryOrderComplete).toBe(false);
      expect(state.factoryLessonPhase).toBe(0);
      expect(state.factoryPracticeUnlocked).toBe(false);
      expect(state.factoryPracticeActive).toBe(false);
      expect(state.factoryPracticeScore).toBe(0);
      expect(state.factoryPracticeCompleted).toBe(false);
    });
  });

  describe("activateTasks", () => {
    it("activates tasks", () => {
      expect(getState().tasksActive).toBe(false);
      getState().activateTasks();
      expect(getState().tasksActive).toBe(true);
    });
  });

  describe("learning validation progression", () => {
    it("gates progression through lessons, practice, and portals across all three worlds", () => {
      getState().start();

      expect(getState().practiceUnlocked).toBe(false);
      expect(getState().portalActive).toBe(false);

      getState().setKnownDisaster("wildfire");
      getState().pickUpItem("flame_retardant", "f1");
      getState().completeWildfireTask("houseSprayed");
      getState().pickUpItem("rake", "r1");
      getState().completeWildfireTask("vegetationCleared");
      vi.runAllTimers();
      expect(getState().questCompleted).toBe(true);

      expect(getState().portalActive).toBe(false);
      getState().unlockPractice();
      expect(getState().practiceUnlocked).toBe(true);
      getState().openPractice();
      getState().addPracticeScore(10);
      getState().addPracticeScore(10);
      expect(getState().practiceScore).toBe(20);
      getState().completePractice();
      expect(getState().practiceCompleted).toBe(true);
      expect(getState().portalActive).toBe(true);

      getState().enterPortal();
      expect(getState().currentWorld).toBe("ocean");

      expect(getState().oceanPracticeUnlocked).toBe(false);
      expect(getState().oceanPortalActive).toBe(false);

      getState().completeCleanupQuest();
      expect(getState().oceanLessonPhase).toBe(1);
      expect(getState().oceanPracticeUnlocked).toBe(false);

      getState().advanceOceanLesson();
      expect(getState().oceanLessonPhase).toBe(2);
      expect(getState().oceanPracticeUnlocked).toBe(false);

      getState().advanceOceanLesson();
      expect(getState().oceanLessonPhase).toBe(3);
      expect(getState().oceanPracticeUnlocked).toBe(true);

      expect(getState().oceanPortalActive).toBe(false);
      getState().openOceanPractice();
      getState().addOceanPracticeScore(10);
      getState().completeOceanPractice();
      expect(getState().oceanPracticeCompleted).toBe(true);
      expect(getState().oceanPortalActive).toBe(true);

      getState().enterFactoryPortal();
      expect(getState().currentWorld).toBe("factory");

      expect(getState().factoryPracticeUnlocked).toBe(false);

      getState().pickUpProduct("hats");
      getState().boxProduct();
      getState().loadBox();
      getState().pickUpProduct("tshirts");
      getState().boxProduct();
      getState().loadBox();
      getState().pickUpProduct("jackets");
      getState().boxProduct();
      getState().loadBox();
      expect(getState().factoryOrderComplete).toBe(true);
      expect(getState().factoryLessonPhase).toBe(1);

      getState().advanceFactoryLesson();
      expect(getState().factoryLessonPhase).toBe(2);

      getState().unlockFactoryPractice();
      expect(getState().factoryPracticeUnlocked).toBe(true);

      getState().openFactoryPractice();
      getState().addFactoryPracticeScore(10);
      getState().completeFactoryPractice();
      expect(getState().factoryPracticeCompleted).toBe(true);
    });
  });
});
