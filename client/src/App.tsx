import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Game } from "./components/game/Game";
import { OceanWorld } from "./components/game/OceanWorld";
import { FactoryWorld } from "./components/game/FactoryWorld";
import { DialogueUI } from "./components/game/DialogueUI";
import { GameHUD } from "./components/game/GameHUD";
import { PracticeQuizUI } from "./components/game/PracticeQuizUI";
import { OceanPracticeQuizUI } from "./components/game/OceanPracticeQuizUI";
import { SurveyUI } from "./components/game/SurveyUI";
import { MachineSettingsUI } from "./components/game/MachineSettingsUI";
import { useGame } from "./lib/stores/useGame";
import "@fontsource/inter";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

const keyMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
];

function StartScreen() {
  const start = useGame((s) => s.start);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a237e 0%, #880e4f 100%)",
        zIndex: 200,
        fontFamily: "'Inter', sans-serif",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          marginBottom: 16,
          textAlign: "center",
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        Disaster Prep Quest
      </h1>
      <p
        style={{
          fontSize: 18,
          marginBottom: 8,
          opacity: 0.9,
          textAlign: "center",
          maxWidth: 500,
          lineHeight: 1.6,
        }}
      >
        A natural disaster is approaching the town. Talk to the townspeople,
        find out what's coming, and help prepare!
      </p>
      <p
        style={{
          fontSize: 14,
          marginBottom: 32,
          opacity: 0.6,
          textAlign: "center",
        }}
      >
        WASD / Arrow Keys to move | E to interact with NPCs
      </p>
      <button
        onClick={start}
        style={{
          padding: "16px 48px",
          fontSize: 20,
          fontWeight: 700,
          background: "#FFC72C",
          color: "#990000",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Start Game
      </button>
    </div>
  );
}

function World2DialogueUI() {
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const world2DialogueIndex = useGame((s) => s.world2DialogueIndex);
  const advanceWorld2Dialogue = useGame((s) => s.advanceWorld2Dialogue);

  useEffect(() => {
    if (!world2Dialogue) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E" || e.key === " " || e.key === "Enter") {
        e.stopImmediatePropagation();
        advanceWorld2Dialogue();
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [world2Dialogue, advanceWorld2Dialogue]);

  if (!world2Dialogue) return null;

  const line = world2Dialogue[world2DialogueIndex];
  const isLast = world2DialogueIndex >= world2Dialogue.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 30, 60, 0.92)",
        borderRadius: 12,
        padding: "20px 28px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 100,
        maxWidth: 520,
        width: "90%",
        border: "2px solid rgba(0, 188, 212, 0.4)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#00bcd4",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {line.speaker}
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.6 }}>{line.text}</div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          marginTop: 12,
          textAlign: "right",
        }}
      >
        {isLast ? "Press E to close" : "Press E to continue"}
      </div>
    </div>
  );
}

function World2HUD() {
  const [hudOpen, setHudOpen] = useState(true);
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const currentSurveyIndex = useGame((s) => s.currentSurveyIndex);
  const restart = useGame((s) => s.restart);
  const oceanQuestStarted = useGame((s) => s.oceanQuestStarted);
  const ecosystems = useGame((s) => s.ecosystems);
  const oceanQuestCompleted = useGame((s) => s.oceanQuestCompleted);
  const hasDivingSuit = useGame((s) => s.hasDivingSuit);
  const cleanupQuestStarted = useGame((s) => s.cleanupQuestStarted);
  const cleanupQuestCompleted = useGame((s) => s.cleanupQuestCompleted);
  const sludgePatches = useGame((s) => s.sludgePatches);
  const inBoat = useGame((s) => s.inBoat);
  const oceanLessonPhase = useGame((s) => s.oceanLessonPhase);
  const oceanPracticeActive = useGame((s) => s.oceanPracticeActive);
  const oceanPracticeCompleted = useGame((s) => s.oceanPracticeCompleted);
  const oceanPracticeUnlocked = useGame((s) => s.oceanPracticeUnlocked);

  if (world2Dialogue || currentSurveyIndex !== null) return null;
  if (oceanLessonPhase >= 1 && oceanLessonPhase <= 2) return null;
  if (oceanPracticeActive) return null;

  const surveyedCount = ecosystems.filter((e) => e.surveyed).length;
  const sludgeCleanedCount = sludgePatches.filter((p) => p.cleaned).length;
  const allSludgeCleaned = sludgePatches.every((p) => p.cleaned);

  let objectiveText = "Talk to Josh at the Beach Station to get started!";
  if (oceanPracticeCompleted) {
    objectiveText = "Quiz complete! A portal has appeared — walk through it to enter the Manufacturing Plant!";
  } else if (oceanPracticeUnlocked) {
    objectiveText = "Visit the Ocean Practice Station to test your for/while loop knowledge!";
  } else if (cleanupQuestCompleted && oceanLessonPhase >= 3) {
    objectiveText = "Lessons complete! Visit the Ocean Practice Station to test your skills!";
  } else if (cleanupQuestCompleted) {
    objectiveText = "Chemical spill cleaned! You saved the ocean! Talk to Josh.";
  } else if (cleanupQuestStarted) {
    if (allSludgeCleaned) {
      objectiveText = "All sludge cleaned up! Return to Josh to report!";
    } else if (inBoat) {
      objectiveText = "Drive to the green sludge and press E to vacuum! Keep cleaning while there's still sludge!";
    } else {
      objectiveText = "Board the cleanup boat at the dock and vacuum up all the chemical sludge!";
    }
  } else if (oceanQuestCompleted) {
    objectiveText = "Talk to Josh — he has an urgent new task for you!";
  } else if (oceanQuestStarted) {
    if (surveyedCount === 4) {
      objectiveText = "All ecosystems surveyed! Report back to Josh.";
    } else if (!hasDivingSuit) {
      objectiveText = "Grab a diving suit from the station near the shore before entering the water!";
    } else {
      objectiveText = `Survey marine ecosystems (${surveyedCount}/4). Swim to a zone and press E.`;
    }
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => setHudOpen(!hudOpen)}
          style={{
            background: "rgba(0, 30, 60, 0.85)",
            border: "1px solid rgba(0, 188, 212, 0.4)",
            borderRadius: hudOpen ? "8px 8px 0 0" : 8,
            padding: "6px 14px",
            color: "#00bcd4",
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            width: "100%",
          }}
        >
          <span>Tasks</span>
          <span style={{ fontSize: 10 }}>{hudOpen ? "▼" : "▶"}</span>
        </button>
        {hudOpen && (
          <div
            style={{
              background: "rgba(0, 30, 60, 0.8)",
              borderRadius: "0 0 8px 8px",
              padding: "8px 18px 12px",
              color: "white",
              fontFamily: "'Inter', sans-serif",
              maxWidth: 380,
              border: "1px solid rgba(0, 188, 212, 0.3)",
              borderTop: "none",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              {objectiveText}
            </div>
            {oceanQuestStarted && !oceanQuestCompleted && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: hasDivingSuit ? "#66bb6a" : "#ff9800" }}>
                    {hasDivingSuit ? "✓" : "○"}
                  </span>
                  <span style={{ opacity: hasDivingSuit ? 0.5 : 1, fontWeight: !hasDivingSuit ? 600 : 400 }}>Diving Suit</span>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 4 }} />
                {ecosystems.map((eco, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ color: eco.surveyed ? "#66bb6a" : "#ff9800" }}>
                      {eco.surveyed ? "✓" : "○"}
                    </span>
                    <span style={{ opacity: eco.surveyed ? 0.5 : 1 }}>{eco.name}</span>
                  </div>
                ))}
              </div>
            )}
            {cleanupQuestStarted && !cleanupQuestCompleted && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#69f0ae", marginBottom: 4 }}>
                  Chemical Spill Cleanup:
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: inBoat ? "#66bb6a" : "#ff9800" }}>
                    {inBoat ? "✓" : "○"}
                  </span>
                  <span style={{ fontWeight: !inBoat ? 600 : 400 }}>Board cleanup boat</span>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 4 }} />
                <div style={{ marginBottom: 4 }}>
                  Sludge cleanup progress:
                </div>
                <div style={{
                  background: "rgba(57, 255, 20, 0.15)",
                  borderRadius: 4,
                  height: 8,
                  overflow: "hidden",
                  border: "1px solid rgba(57, 255, 20, 0.3)",
                }}>
                  <div style={{
                    width: `${(sludgeCleanedCount / sludgePatches.length) * 100}%`,
                    height: "100%",
                    background: "#39ff14",
                    transition: "width 0.3s ease",
                  }} />
                </div>
                {allSludgeCleaned && (
                  <div style={{ color: "#69f0ae", fontWeight: 600, marginTop: 4 }}>
                    All clean! Return to Josh!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          background: "rgba(0, 30, 60, 0.7)",
          borderRadius: 8,
          padding: "8px 14px",
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          zIndex: 50,
        }}
      >
        WASD / Arrows to move | E to interact{inBoat ? " | Drive to sludge & press E" : ""}
      </div>

      <div
        onClick={restart}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0, 30, 60, 0.8)",
          borderRadius: 8,
          padding: "8px 16px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 50,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        Back to Town
      </div>
    </>
  );
}

function World3DialogueUI() {
  const world3Dialogue = useGame((s) => s.world3Dialogue);
  const world3DialogueIndex = useGame((s) => s.world3DialogueIndex);
  const advanceWorld3Dialogue = useGame((s) => s.advanceWorld3Dialogue);

  useEffect(() => {
    if (!world3Dialogue) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E" || e.key === " " || e.key === "Enter") {
        e.stopImmediatePropagation();
        advanceWorld3Dialogue();
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [world3Dialogue, advanceWorld3Dialogue]);

  if (!world3Dialogue) return null;

  const line = world3Dialogue[world3DialogueIndex];
  const isLast = world3DialogueIndex >= world3Dialogue.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(40, 30, 10, 0.92)",
        borderRadius: 12,
        padding: "20px 28px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 100,
        maxWidth: 520,
        width: "90%",
        border: "2px solid rgba(255, 152, 0, 0.4)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#ff9800",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {line.speaker}
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.6 }}>{line.text}</div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          marginTop: 12,
          textAlign: "right",
        }}
      >
        {isLast ? "Press E to close" : "Press E to continue"}
      </div>
    </div>
  );
}

function World3HUD() {
  const [hudOpen, setHudOpen] = useState(true);
  const world3Dialogue = useGame((s) => s.world3Dialogue);
  const activeMachine = useGame((s) => s.activeMachine);
  const restart = useGame((s) => s.restart);
  const factoryQuestStarted = useGame((s) => s.factoryQuestStarted);
  const hatMachineState = useGame((s) => s.hatMachineState);
  const tshirtMachineState = useGame((s) => s.tshirtMachineState);
  const jacketMachineState = useGame((s) => s.jacketMachineState);
  const carryingProduct = useGame((s) => s.carryingProduct);
  const carryingBox = useGame((s) => s.carryingBox);
  const factoryOrderComplete = useGame((s) => s.factoryOrderComplete);

  if (world3Dialogue || activeMachine) return null;

  const stateLabel = (state: string) => {
    if (state === "idle") return "Not started";
    if (state === "produced") return "Pick up products";
    if (state === "picked_up") return "Pack in box";
    if (state === "boxed") return "Load on truck";
    if (state === "loaded") return "Done!";
    return state;
  };

  const stateColor = (state: string) => {
    if (state === "loaded") return "#4caf50";
    if (state === "idle") return "#999";
    return "#ffeb3b";
  };

  let objectiveText = "Talk to George, the floor manager, to get started!";
  if (factoryOrderComplete) {
    objectiveText = "Order complete! Talk to George.";
  } else if (carryingBox) {
    objectiveText = `Carrying a box of ${carryingBox} — load it on the shipping truck!`;
  } else if (carryingProduct) {
    objectiveText = `Carrying ${carryingProduct} — go to the packing table to box them!`;
  } else if (factoryQuestStarted) {
    objectiveText = "Fulfill the Olympic Village order! Configure machines, pick up products, box them, and load the truck.";
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => setHudOpen(!hudOpen)}
          style={{
            background: "rgba(40, 30, 10, 0.85)",
            border: "1px solid rgba(255, 152, 0, 0.4)",
            borderRadius: hudOpen ? "8px 8px 0 0" : 8,
            padding: "6px 14px",
            color: "#ff9800",
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            width: "100%",
          }}
        >
          <span>Tasks</span>
          <span style={{ fontSize: 10 }}>{hudOpen ? "▼" : "▶"}</span>
        </button>
        {hudOpen && (
          <div
            style={{
              background: "rgba(40, 30, 10, 0.8)",
              borderRadius: "0 0 8px 8px",
              padding: "8px 18px 12px",
              color: "white",
              fontFamily: "'Inter', sans-serif",
              maxWidth: 380,
              border: "1px solid rgba(255, 152, 0, 0.3)",
              borderTop: "none",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              {objectiveText}
            </div>
            {factoryQuestStarted && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: stateColor(hatMachineState) }}>●</span>
                  <span>Hats (2 Large): {stateLabel(hatMachineState)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: stateColor(tshirtMachineState) }}>●</span>
                  <span>T-Shirts (3 Medium): {stateLabel(tshirtMachineState)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: stateColor(jacketMachineState) }}>●</span>
                  <span>Jackets (5 Large): {stateLabel(jacketMachineState)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {(carryingProduct || carryingBox) && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: carryingBox ? "rgba(76, 175, 80, 0.9)" : "rgba(255, 152, 0, 0.9)",
            borderRadius: 12,
            padding: "10px 24px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            zIndex: 50,
            textAlign: "center",
            border: "2px solid white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          {carryingProduct && `Carrying: ${carryingProduct.charAt(0).toUpperCase() + carryingProduct.slice(1)}`}
          {carryingBox && `Carrying Box: ${carryingBox.charAt(0).toUpperCase() + carryingBox.slice(1)}`}
        </div>
      )}

      <div
        onClick={restart}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(40, 30, 10, 0.8)",
          borderRadius: 8,
          padding: "8px 16px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 50,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        Back to Town
      </div>
    </>
  );
}

function OceanLessonUI() {
  const oceanLessonPhase = useGame((s) => s.oceanLessonPhase);
  const advanceOceanLesson = useGame((s) => s.advanceOceanLesson);
  const world2Dialogue = useGame((s) => s.world2Dialogue);

  if (world2Dialogue) return null;
  if (oceanLessonPhase < 1 || oceanLessonPhase > 2) return null;

  if (oceanLessonPhase === 1) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 20, 50, 0.96)",
          borderRadius: 16,
          padding: "28px 36px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 200,
          border: "3px solid #4fc3f7",
          boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
          maxWidth: 600,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#4fc3f7" }}>
          For Loops in Programming
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
          In the survey task, you visited <strong style={{ color: "#ffeb3b" }}>each of the 4 marine ecosystems</strong> and
          performed the same set of actions at every one: count the animals, count the plants, and identify the
          environmental issue.
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
          This is exactly how a <strong style={{ color: "#4fc3f7" }}>for loop</strong> works in programming!
          A for loop repeats the same block of code <em>for each item</em> in a collection. You knew exactly
          how many ecosystems there were (4), and you did the same survey steps at each one.
        </div>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: 8,
            padding: "16px 20px",
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
            lineHeight: 1.8,
            marginBottom: 16,
            border: "1px solid rgba(79, 195, 247, 0.3)",
            whiteSpace: "pre-wrap",
          }}
        >
          <span style={{ color: "#546e7a" }}>{"// The ecosystems you surveyed:\n"}</span>
          <span style={{ color: "#c792ea" }}>const </span>
          <span style={{ color: "#f78c6c" }}>ecosystems</span>
          <span style={{ color: "#89ddff" }}> = [</span>
          <span style={{ color: "#c3e88d" }}>{'"Coral Reef"'}</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"Kelp Forest"'}</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"Tide Pool"'}</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"Seagrass Meadow"'}</span>
          <span style={{ color: "#89ddff" }}>];</span>
          {"\n\n"}
          <span style={{ color: "#c792ea" }}>for </span>
          <span style={{ color: "#89ddff" }}>(</span>
          <span style={{ color: "#c792ea" }}>const </span>
          <span style={{ color: "#f78c6c" }}>ecosystem</span>
          <span style={{ color: "#c792ea" }}> of </span>
          <span style={{ color: "#f78c6c" }}>ecosystems</span>
          <span style={{ color: "#89ddff" }}>)</span>
          <span style={{ color: "#c3e88d" }}>{" {\n"}</span>
          <span style={{ color: "#c3e88d" }}>{"  "}</span>
          <span style={{ color: "#82aaff" }}>countAnimals</span>
          <span style={{ color: "#89ddff" }}>(</span>
          <span style={{ color: "#f78c6c" }}>ecosystem</span>
          <span style={{ color: "#89ddff" }}>)</span>
          <span style={{ color: "#c3e88d" }}>{";\n"}</span>
          <span style={{ color: "#c3e88d" }}>{"  "}</span>
          <span style={{ color: "#82aaff" }}>countPlants</span>
          <span style={{ color: "#89ddff" }}>(</span>
          <span style={{ color: "#f78c6c" }}>ecosystem</span>
          <span style={{ color: "#89ddff" }}>)</span>
          <span style={{ color: "#c3e88d" }}>{";\n"}</span>
          <span style={{ color: "#c3e88d" }}>{"  "}</span>
          <span style={{ color: "#82aaff" }}>identifyIssue</span>
          <span style={{ color: "#89ddff" }}>(</span>
          <span style={{ color: "#f78c6c" }}>ecosystem</span>
          <span style={{ color: "#89ddff" }}>)</span>
          <span style={{ color: "#c3e88d" }}>{";\n"}</span>
          <span style={{ color: "#c3e88d" }}>{"}"}</span>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
          Just like you visited each ecosystem one by one and performed the same survey tasks,
          the <strong style={{ color: "#4fc3f7" }}>for loop</strong> goes through the array of ecosystems
          one by one and runs the same code block for each one. The loop body executes exactly
          <strong style={{ color: "#ffeb3b" }}> 4 times</strong> — once per ecosystem!
        </div>

        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
          For loops are used when you know how many times you need to repeat something — like surveying a known list of ecosystems.
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={advanceOceanLesson}
            style={{
              padding: "12px 32px",
              background: "#4fc3f7",
              border: "none",
              borderRadius: 8,
              color: "#0d47a1",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continue
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 20, 50, 0.96)",
        borderRadius: 16,
        padding: "28px 36px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #69f0ae",
        boxShadow: "0 0 40px rgba(105, 240, 174, 0.4)",
        maxWidth: 600,
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#69f0ae" }}>
        While Loops in Programming
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
        In the cleanup task, you drove the boat around the ocean vacuuming up chemical sludge.
        You didn't know exactly how many patches were out there — you just kept cleaning
        <strong style={{ color: "#ffeb3b" }}> while there was still sludge</strong> in the water.
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
        This is exactly how a <strong style={{ color: "#69f0ae" }}>while loop</strong> works!
        A while loop keeps repeating a block of code <em>as long as a condition is true</em>.
        You didn't count the sludge patches — you just kept going until the ocean was clean.
      </div>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: 8,
          padding: "16px 20px",
          fontFamily: "'Courier New', monospace",
          fontSize: 13,
          lineHeight: 1.8,
          marginBottom: 16,
          border: "1px solid rgba(105, 240, 174, 0.3)",
          whiteSpace: "pre-wrap",
        }}
      >
        <span style={{ color: "#546e7a" }}>{"// Keep cleaning while there's still sludge!\n"}</span>
        <span style={{ color: "#c792ea" }}>while </span>
        <span style={{ color: "#89ddff" }}>(</span>
        <span style={{ color: "#82aaff" }}>oceanHasSludge</span>
        <span style={{ color: "#89ddff" }}>()</span>
        <span style={{ color: "#89ddff" }}>)</span>
        <span style={{ color: "#c3e88d" }}>{" {\n"}</span>
        <span style={{ color: "#c3e88d" }}>{"  "}</span>
        <span style={{ color: "#82aaff" }}>driveToSludge</span>
        <span style={{ color: "#89ddff" }}>()</span>
        <span style={{ color: "#c3e88d" }}>{";\n"}</span>
        <span style={{ color: "#c3e88d" }}>{"  "}</span>
        <span style={{ color: "#82aaff" }}>vacuumSludge</span>
        <span style={{ color: "#89ddff" }}>()</span>
        <span style={{ color: "#c3e88d" }}>{";\n"}</span>
        <span style={{ color: "#c3e88d" }}>{"}"}</span>
        {"\n\n"}
        <span style={{ color: "#546e7a" }}>{"// The loop stops when oceanHasSludge() returns false\n"}</span>
        <span style={{ color: "#82aaff" }}>reportToJosh</span>
        <span style={{ color: "#89ddff" }}>()</span>
        <span style={{ color: "#c3e88d" }}>;</span>
        <span style={{ color: "#546e7a" }}>{" // Done!"}</span>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
        Just like you kept vacuuming sludge until the ocean was clean, the
        <strong style={{ color: "#69f0ae" }}> while loop</strong> keeps running its code block as long as
        <code style={{ color: "#82aaff" }}> oceanHasSludge()</code> returns true. Once all the sludge
        is gone, the condition becomes false and the loop stops — just like you stopped cleaning
        and reported back to Josh!
      </div>

      <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
        While loops are used when you don't know in advance how many times you'll need to repeat — you just keep going until a condition changes.
      </div>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 16,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "#ffeb3b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
          For vs While
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>
          <strong style={{ color: "#4fc3f7" }}>For loop:</strong> Use when you know the items — "survey <em>each of</em> these 4 ecosystems"
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>
          <strong style={{ color: "#69f0ae" }}>While loop:</strong> Use when you have a condition — "keep cleaning <em>while</em> there's still sludge"
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          onClick={advanceOceanLesson}
          style={{
            padding: "12px 32px",
            background: "#69f0ae",
            border: "none",
            borderRadius: 8,
            color: "#1b5e20",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
}

function OceanPracticeQuizWrapper() {
  const oceanPracticeActive = useGame((s) => s.oceanPracticeActive);
  if (!oceanPracticeActive) return null;
  return <OceanPracticeQuizUI />;
}

function App() {
  const phase = useGame((s) => s.phase);
  const practiceActive = useGame((s) => s.practiceActive);
  const currentWorld = useGame((s) => s.currentWorld);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {phase === "ready" && <StartScreen />}

      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 10, 17],
            fov: 50,
            near: 0.1,
            far: 300,
          }}
          gl={{
            antialias: true,
            powerPreference: "default",
          }}
        >
          <Suspense fallback={null}>
            {currentWorld === "town" && <Game />}
            {currentWorld === "ocean" && <OceanWorld />}
            {currentWorld === "factory" && <FactoryWorld />}
          </Suspense>
        </Canvas>

        {phase === "playing" && currentWorld === "town" && (
          <>
            <GameHUD />
            <DialogueUI />
            {practiceActive && <PracticeQuizUI />}
          </>
        )}

        {phase === "playing" && currentWorld === "ocean" && (
          <>
            <World2HUD />
            <World2DialogueUI />
            <SurveyUI />
            <OceanLessonUI />
            <OceanPracticeQuizWrapper />
          </>
        )}

        {phase === "playing" && currentWorld === "factory" && (
          <>
            <World3HUD />
            <World3DialogueUI />
            <MachineSettingsUI />
          </>
        )}
      </KeyboardControls>
    </div>
  );
}

export default App;
