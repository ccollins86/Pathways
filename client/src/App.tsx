import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback, useEffect, useRef } from "react";
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
import { FactoryPracticeQuizUI } from "./components/game/FactoryPracticeQuizUI";
import { PsychicPracticeQuizUI } from "./components/game/PsychicPracticeQuizUI";
import { AuthScreen } from "./components/AuthScreen";
import { PsychicWorld } from "./components/game/PsychicWorld";
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

function StartScreen({ username, onLogout }: { username: string; onLogout: () => void }) {
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
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 14, opacity: 0.8 }}>
          Signed in as <strong>{username}</strong>
        </span>
        <button
          onClick={onLogout}
          style={{
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            background: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
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
  const factoryLessonPhase = useGame((s) => s.factoryLessonPhase);
  const factoryPracticeActive = useGame((s) => s.factoryPracticeActive);
  const factoryPracticeUnlocked = useGame((s) => s.factoryPracticeUnlocked);
  const factoryPracticeCompleted = useGame((s) => s.factoryPracticeCompleted);
  const factoryPortalActive = useGame((s) => s.factoryPortalActive);

  if (world3Dialogue || activeMachine || factoryLessonPhase > 0 || factoryPracticeActive) return null;

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
  if (factoryPortalActive) {
    objectiveText = "A portal has appeared! Walk through it to enter the Psychic Shop!";
  } else if (factoryPracticeCompleted) {
    objectiveText = "Practice quiz complete! Talk to George.";
  } else if (factoryPracticeUnlocked) {
    objectiveText = "Visit the Practice Station to test your knowledge of functions!";
  } else if (factoryOrderComplete) {
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
              <div style={{ marginTop: 8, fontSize: 11 }}>
                <div style={{ marginBottom: 8, padding: "6px 10px", background: "rgba(244,67,54,0.15)", borderRadius: 6, borderLeft: "3px solid #f44336" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ color: stateColor(hatMachineState), fontSize: 14 }}>●</span>
                    <span style={{ fontWeight: 700, color: "#f44336" }}>Hats: {stateLabel(hatMachineState)}</span>
                  </div>
                  <div style={{ color: "#ccc", paddingLeft: 20, lineHeight: 1.4 }}>
                    Qty: 2 | Size: Large<br />
                    Top: White | Brim: Green<br />
                    Lettering: "Italy" (Red)
                  </div>
                </div>
                <div style={{ marginBottom: 8, padding: "6px 10px", background: "rgba(33,150,243,0.15)", borderRadius: 6, borderLeft: "3px solid #2196f3" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ color: stateColor(tshirtMachineState), fontSize: 14 }}>●</span>
                    <span style={{ fontWeight: 700, color: "#2196f3" }}>T-Shirts: {stateLabel(tshirtMachineState)}</span>
                  </div>
                  <div style={{ color: "#ccc", paddingLeft: 20, lineHeight: 1.4 }}>
                    Qty: 3 | Size: Medium<br />
                    Sleeves: Red | Body: Blue<br />
                    Lettering: "USA" (White)
                  </div>
                </div>
                <div style={{ padding: "6px 10px", background: "rgba(76,175,80,0.15)", borderRadius: 6, borderLeft: "3px solid #4caf50" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ color: stateColor(jacketMachineState), fontSize: 14 }}>●</span>
                    <span style={{ fontWeight: 700, color: "#4caf50" }}>Jackets: {stateLabel(jacketMachineState)}</span>
                  </div>
                  <div style={{ color: "#ccc", paddingLeft: 20, lineHeight: 1.4 }}>
                    Qty: 5 | Size: Large<br />
                    Sleeves: Black | Body: Red<br />
                    Lettering: "Germany" (Yellow)
                  </div>
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

function FactoryLessonUI() {
  const factoryLessonPhase = useGame((s) => s.factoryLessonPhase);
  const advanceFactoryLesson = useGame((s) => s.advanceFactoryLesson);
  const unlockFactoryPractice = useGame((s) => s.unlockFactoryPractice);
  const world3Dialogue = useGame((s) => s.world3Dialogue);

  if (world3Dialogue) return null;
  if (factoryLessonPhase < 1 || factoryLessonPhase > 2) return null;

  if (factoryLessonPhase === 1) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(30, 20, 5, 0.97)",
          borderRadius: 16,
          padding: "28px 36px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 200,
          border: "3px solid #ff9800",
          boxShadow: "0 0 40px rgba(255, 152, 0, 0.4)",
          maxWidth: 640,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#ff9800" }}>
          Functions in Programming
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
          Great job fulfilling the Olympic Village order! You just used <strong style={{ color: "#ffeb3b" }}>three different machines</strong>,
          each one taking specific inputs (quantity, size, colors, lettering) and producing a finished product as output.
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
          This is exactly how <strong style={{ color: "#ff9800" }}>functions</strong> work in programming!
          A function is a reusable block of code that takes <strong style={{ color: "#4fc3f7" }}>inputs (parameters)</strong>,
          does some work, and produces an <strong style={{ color: "#69f0ae" }}>output (return value)</strong>.
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
            border: "1px solid rgba(255, 152, 0, 0.3)",
            whiteSpace: "pre-wrap",
          }}
        >
          <span style={{ color: "#546e7a" }}>{"// The Hat Maker machine as a function:\n"}</span>
          <span style={{ color: "#c792ea" }}>function </span>
          <span style={{ color: "#82aaff" }}>makeHat</span>
          <span style={{ color: "#89ddff" }}>(</span>
          <span style={{ color: "#f78c6c" }}>quantity</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#f78c6c" }}>size</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#f78c6c" }}>topColor</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#f78c6c" }}>brimColor</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#f78c6c" }}>lettering</span>
          <span style={{ color: "#89ddff" }}>)</span>
          <span style={{ color: "#c3e88d" }}>{" {\n"}</span>
          <span style={{ color: "#546e7a" }}>{"  // The machine does all the work inside...\n"}</span>
          <span style={{ color: "#c3e88d" }}>{"  "}</span>
          <span style={{ color: "#c792ea" }}>return </span>
          <span style={{ color: "#f78c6c" }}>finishedHats</span>
          <span style={{ color: "#89ddff" }}>;</span>
          <span style={{ color: "#c3e88d" }}>{"\n}\n\n"}</span>
          <span style={{ color: "#546e7a" }}>{"// You called it with specific inputs:\n"}</span>
          <span style={{ color: "#c792ea" }}>let </span>
          <span style={{ color: "#f78c6c" }}>hats</span>
          <span style={{ color: "#89ddff" }}> = </span>
          <span style={{ color: "#82aaff" }}>makeHat</span>
          <span style={{ color: "#89ddff" }}>(</span>
          <span style={{ color: "#f78c6c" }}>2</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"large"'}</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"white"'}</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"green"'}</span>
          <span style={{ color: "#89ddff" }}>, </span>
          <span style={{ color: "#c3e88d" }}>{'"Italy"'}</span>
          <span style={{ color: "#89ddff" }}>);</span>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
          The <strong style={{ color: "#4fc3f7" }}>parameters</strong> (quantity, size, topColor, brimColor, lettering)
          are like the settings on the machine — they tell the function what to do.
          The <strong style={{ color: "#ffeb3b" }}>arguments</strong> (2, "large", "white", "green", "Italy")
          are the actual values you supplied.
          And the function <strong style={{ color: "#69f0ae" }}>returned</strong> the finished hats — your output!
        </div>

        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
          Each machine is like a different function — same concept, different purpose!
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={advanceFactoryLesson}
            style={{
              padding: "12px 32px",
              background: "#ff9800",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
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
        background: "rgba(30, 20, 5, 0.97)",
        borderRadius: 16,
        padding: "28px 36px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #69f0ae",
        boxShadow: "0 0 40px rgba(105, 240, 174, 0.4)",
        maxWidth: 640,
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#69f0ae" }}>
        Functions Group Tasks Together
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
        Think about what each machine did internally — it took raw materials, cut them to size, applied colors,
        stamped the lettering, and assembled the final product. That's <strong style={{ color: "#ffeb3b" }}>a lot of steps</strong>!
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
        But you didn't have to do each step manually. You just called the function with your inputs,
        and the machine handled all the complexity for you. That's the power of functions —
        they <strong style={{ color: "#69f0ae" }}>cluster all the tasks needed</strong> to accomplish something,
        so you can just call the function and get what you want.
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
        <span style={{ color: "#546e7a" }}>{"// Your full order — 3 function calls:\n\n"}</span>
        <span style={{ color: "#c792ea" }}>let </span>
        <span style={{ color: "#f78c6c" }}>hats</span>
        <span style={{ color: "#89ddff" }}>{" = "}</span>
        <span style={{ color: "#82aaff" }}>makeHat</span>
        <span style={{ color: "#89ddff" }}>(</span>
        <span style={{ color: "#f78c6c" }}>2</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"large"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"white"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"green"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"Italy"'}</span>
        <span style={{ color: "#89ddff" }}>);</span>
        {"\n"}
        <span style={{ color: "#c792ea" }}>let </span>
        <span style={{ color: "#f78c6c" }}>shirts</span>
        <span style={{ color: "#89ddff" }}>{" = "}</span>
        <span style={{ color: "#82aaff" }}>makeTshirt</span>
        <span style={{ color: "#89ddff" }}>(</span>
        <span style={{ color: "#f78c6c" }}>3</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"medium"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"red"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"blue"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"USA"'}</span>
        <span style={{ color: "#89ddff" }}>);</span>
        {"\n"}
        <span style={{ color: "#c792ea" }}>let </span>
        <span style={{ color: "#f78c6c" }}>jackets</span>
        <span style={{ color: "#89ddff" }}>{" = "}</span>
        <span style={{ color: "#82aaff" }}>makeJacket</span>
        <span style={{ color: "#89ddff" }}>(</span>
        <span style={{ color: "#f78c6c" }}>5</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"large"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"black"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"red"'}</span>
        <span style={{ color: "#89ddff" }}>, </span>
        <span style={{ color: "#c3e88d" }}>{'"Germany"'}</span>
        <span style={{ color: "#89ddff" }}>);</span>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
        Each function took <strong style={{ color: "#4fc3f7" }}>different inputs</strong> and
        produced <strong style={{ color: "#69f0ae" }}>different outputs</strong>, but they all
        followed the same pattern: <em>call the function, pass your inputs, get your result</em>.
      </div>

      <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
        Now head to the Practice Station to test your knowledge of functions!
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          onClick={unlockFactoryPractice}
          style={{
            padding: "12px 32px",
            background: "#69f0ae",
            border: "none",
            borderRadius: 8,
            color: "#1a1a1a",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Continue Playing
        </div>
      </div>
    </div>
  );
}

function FactoryPracticeQuizWrapper() {
  const factoryPracticeActive = useGame((s) => s.factoryPracticeActive);
  if (!factoryPracticeActive) return null;
  return <FactoryPracticeQuizUI />;
}

function PsychicPracticeQuizWrapper() {
  const psychicPracticeActive = useGame((s) => s.psychicPracticeActive);
  if (!psychicPracticeActive) return null;
  return <PsychicPracticeQuizUI />;
}

function PsychicInstructionsUI() {
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const dismissPsychicInstructions = useGame((s) => s.dismissPsychicInstructions);

  if (psychicGamePhase !== "instructions") return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(26, 10, 46, 0.97)",
        borderRadius: 16,
        padding: "32px 40px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #9b59b6",
        boxShadow: "0 0 60px rgba(155, 89, 182, 0.5)",
        maxWidth: 560,
        width: "90%",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, color: "#e0b0ff", textAlign: "center" }}>
        Welcome to Mystic Visions
      </div>
      <div style={{ fontSize: 14, color: "#9b59b6", textAlign: "center", marginBottom: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>
        Psychic Number Guessing Parlor
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
        You are the <strong style={{ color: "#ffd700" }}>resident psychic</strong>. Customers will enter through the door
        and sit across from you. Each customer has a <strong style={{ color: "#e0b0ff" }}>favorite number between 1 and 100</strong> written
        on their tablet (hidden from you).
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
        Your job: <strong style={{ color: "#69f0ae" }}>guess their number in 10 tries or fewer</strong>. If you guess wrong,
        the customer will simply say <strong style={{ color: "#e0b0ff" }}>"Try again!"</strong>
      </div>

      <div style={{
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 20,
        border: "1px solid rgba(155, 89, 182, 0.3)",
      }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>
          <span style={{ color: "#69f0ae", fontWeight: 700 }}>Correct guess:</span> You earn <strong style={{ color: "#ffd700" }}>$100</strong>
        </div>
        <div style={{ fontSize: 14, marginBottom: 6 }}>
          <span style={{ color: "#ff6b6b", fontWeight: 700 }}>10 wrong guesses:</span> You lose <strong style={{ color: "#ff6b6b" }}>$100</strong>
        </div>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: "#ffd700", fontWeight: 700 }}>Goal:</span> Reach a balance of <strong style={{ color: "#ffd700" }}>+$200</strong> to win the round!
        </div>
      </div>

      <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 20, textAlign: "center" }}>
        For this first round, just <strong>guess randomly</strong> — pick any number you think it might be!
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          onClick={dismissPsychicInstructions}
          style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #9b59b6, #6a0dad)",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 1,
            boxShadow: "0 4px 20px rgba(155, 89, 182, 0.4)",
          }}
        >
          Open for Business
        </div>
      </div>
    </div>
  );
}

function PsychicTransitionUI() {
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const psychicRound = useGame((s) => s.psychicRound);
  const dismissPsychicInstructions = useGame((s) => s.dismissPsychicInstructions);

  if (psychicGamePhase !== "transition") return null;

  const roundDescriptions: Record<number, { title: string; body: string; detail: string }> = {
    2: {
      title: "Round 2: Sequential Guessing",
      body: "There has to be a better way to do this! Randomly guessing is too unpredictable. This time, pick a starting number and then guess sequentially from there.",
      detail: "For example, if you start with 20, your next guesses must be 21, 22, 23, 24, and so on. Let's see if a systematic approach works better!",
    },
    3: {
      title: "Round 3: A Smarter Strategy",
      body: "There has to be a better way to do this! Sequential guessing still takes too long. This time, we're going to try a completely different approach.",
      detail: "Always start by guessing 50 (the middle of 1-100). Then based on whether the answer is higher or lower, guess the middle of the remaining range. The formula is: guess = (min + max) / 2, rounded down to the nearest whole number. Let's see how powerful this strategy is!",
    },
  };

  const desc = roundDescriptions[psychicRound];
  if (!desc) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(26, 10, 46, 0.97)",
        borderRadius: 16,
        padding: "32px 40px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #9b59b6",
        boxShadow: "0 0 60px rgba(155, 89, 182, 0.5)",
        maxWidth: 560,
        width: "90%",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: "#e0b0ff", textAlign: "center" }}>
        {desc.title}
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
        {desc.body}
      </div>

      <div style={{
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 20,
        border: "1px solid rgba(155, 89, 182, 0.3)",
        fontSize: 14,
        lineHeight: 1.7,
      }}>
        {desc.detail}
      </div>

      {psychicRound === 3 && (
        <div style={{
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: 8,
          padding: "12px 18px",
          marginBottom: 20,
          border: "1px solid rgba(105, 240, 174, 0.3)",
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          color: "#69f0ae",
          textAlign: "center",
        }}>
          guess = (min + max) / 2
        </div>
      )}

      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16, textAlign: "center" }}>
        {psychicRound === 3
          ? "Reach +$300 to win this round! (You should find this much easier...)"
          : "Reach +$200 to win, or -$200 to lose. Good luck!"}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          onClick={dismissPsychicInstructions}
          style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #9b59b6, #6a0dad)",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 1,
            boxShadow: "0 4px 20px rgba(155, 89, 182, 0.4)",
          }}
        >
          Let's Go!
        </div>
      </div>
    </div>
  );
}

function PsychicRoundResultUI() {
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const psychicRound = useGame((s) => s.psychicRound);
  const psychicAdvanceRound = useGame((s) => s.psychicAdvanceRound);
  const psychicStartLesson = useGame((s) => s.psychicStartLesson);

  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const failSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSoundRef.current = new Audio("/sounds/success.mp3");
    failSoundRef.current = new Audio("/sounds/hit.mp3");
  }, []);

  useEffect(() => {
    if (psychicGamePhase === "round_win") {
      successSoundRef.current?.play().catch(() => {});
    } else if (psychicGamePhase === "round_lose") {
      failSoundRef.current?.play().catch(() => {});
    }
  }, [psychicGamePhase]);

  if (psychicGamePhase !== "round_win" && psychicGamePhase !== "round_lose") return null;

  const isWin = psychicGamePhase === "round_win";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(26, 10, 46, 0.97)",
        borderRadius: 16,
        padding: "32px 40px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: `3px solid ${isWin ? "#69f0ae" : "#ff6b6b"}`,
        boxShadow: `0 0 60px ${isWin ? "rgba(105,240,174,0.5)" : "rgba(255,107,107,0.5)"}`,
        maxWidth: 480,
        width: "90%",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: isWin ? "#69f0ae" : "#ff6b6b" }}>
        {isWin ? "Congrats, you won!" : "Unfortunately, you lost!"}
      </div>

      {isWin && psychicRound < 3 && (
        <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, opacity: 0.9 }}>
          You won, but there has to be a better way to do this.
        </div>
      )}

      {isWin && psychicRound === 3 && (
        <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, opacity: 0.9 }}>
          Amazing! Binary search made this almost effortless, didn't it?
        </div>
      )}

      {!isWin && psychicRound < 3 && (
        <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, opacity: 0.9 }}>
          That was tough! Let's try a different strategy in the next round.
        </div>
      )}

      {!isWin && psychicRound === 3 && (
        <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, opacity: 0.9 }}>
          Don't worry! Let's review what we learned about search algorithms.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <div
            onClick={psychicRound === 3 ? psychicStartLesson : psychicAdvanceRound}
            style={{
              padding: "14px 36px",
              background: isWin
                ? "linear-gradient(135deg, #69f0ae, #00c853)"
                : "linear-gradient(135deg, #ff6b6b, #e53935)",
              border: "none",
              borderRadius: 10,
              color: isWin ? "#1a1a1a" : "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {psychicRound === 3 ? "Continue to Lesson" : "Next Round"}
          </div>
      </div>
    </div>
  );
}

function PsychicLessonUI() {
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const restart = useGame((s) => s.restart);
  const openPsychicPractice = useGame((s) => s.openPsychicPractice);
  const psychicPracticeCompleted = useGame((s) => s.psychicPracticeCompleted);

  if (psychicGamePhase !== "lesson") return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(26, 10, 46, 0.97)",
        borderRadius: 16,
        padding: "28px 36px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #69f0ae",
        boxShadow: "0 0 40px rgba(105, 240, 174, 0.4)",
        maxWidth: 640,
        maxHeight: "85vh",
        overflowY: "auto",
        width: "92%",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: "#69f0ae", textAlign: "center" }}>
        Search Algorithms: What You Just Learned
      </div>

      <div style={{
        background: "rgba(255, 107, 107, 0.1)",
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 14,
        border: "1px solid rgba(255, 107, 107, 0.3)",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#ff6b6b", marginBottom: 6 }}>
          Round 1: Random Search
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
          You picked numbers at random — sometimes lucky, usually not. With 100 possible numbers and only 10 guesses,
          your odds of finding the right one were slim. This is like looking for a word in a dictionary by flipping to random pages.
        </div>
      </div>

      <div style={{
        background: "rgba(255, 193, 7, 0.1)",
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 14,
        border: "1px solid rgba(255, 193, 7, 0.3)",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#ffc107", marginBottom: 6 }}>
          Round 2: Linear Search (Sequential)
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
          You started at a number and checked one by one: 20, 21, 22, 23... This is <strong>linear search</strong> —
          you check every single element in order. In the worst case, you'd need up to 100 guesses!
          With only 10, you could only cover 10 numbers. Still very hard to win.
        </div>
      </div>

      <div style={{
        background: "rgba(105, 240, 174, 0.1)",
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 14,
        border: "1px solid rgba(105, 240, 174, 0.3)",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#69f0ae", marginBottom: 6 }}>
          Round 3: Binary Search
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
          You always guessed the <strong>middle</strong> of the remaining range. Each guess cut the possibilities
          <strong> in half</strong>! Starting with 100 numbers: after 1 guess you had 50 left, then 25, then 12, then 6, then 3, then 1.
          That's why you could <strong>always find any number in 7 guesses or fewer</strong> — making it nearly impossible to lose!
        </div>
      </div>

      <div style={{
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: 8,
        padding: "16px 20px",
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        lineHeight: 1.8,
        marginBottom: 16,
        border: "1px solid rgba(105, 240, 174, 0.3)",
        whiteSpace: "pre-wrap",
      }}>
        <span style={{ color: "#546e7a" }}>{"// Binary search divides the space in half each time:\n\n"}</span>
        <span style={{ color: "#c792ea" }}>{"function "}</span>
        <span style={{ color: "#82aaff" }}>{"binarySearch"}</span>
        <span style={{ color: "#89ddff" }}>{"(target, min, max) {\n"}</span>
        <span style={{ color: "#89ddff" }}>{"  while "}</span>
        <span style={{ color: "#89ddff" }}>{"(min <= max) {\n"}</span>
        <span style={{ color: "#c792ea" }}>{"    let "}</span>
        <span style={{ color: "#f78c6c" }}>{"guess"}</span>
        <span style={{ color: "#89ddff" }}>{" = Math.floor((min + max) / 2);\n"}</span>
        <span style={{ color: "#89ddff" }}>{"    if (guess === target) return "}</span>
        <span style={{ color: "#c3e88d" }}>{'"Found it!"'}</span>
        <span style={{ color: "#89ddff" }}>{";\n"}</span>
        <span style={{ color: "#89ddff" }}>{"    if (guess < target) min = guess + 1;\n"}</span>
        <span style={{ color: "#89ddff" }}>{"    else max = guess - 1;\n"}</span>
        <span style={{ color: "#89ddff" }}>{"  }\n"}</span>
        <span style={{ color: "#89ddff" }}>{"}"}</span>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
        Binary search is one of the most powerful algorithms in computer science. By <strong style={{ color: "#69f0ae" }}>dividing
        the search space in half</strong> with each step, it finds answers in <strong style={{ color: "#ffd700" }}>logarithmic time</strong> —
        dramatically faster than checking every possibility one by one.
      </div>

      <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
        Random search: ~100 guesses worst case | Linear search: ~100 guesses worst case | Binary search: ~7 guesses worst case
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {!psychicPracticeCompleted && (
          <div
            onClick={openPsychicPractice}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #9b59b6, #6a0dad)",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Practice
          </div>
        )}
        <div
          onClick={restart}
          style={{
            padding: "12px 32px",
            background: "#69f0ae",
            border: "none",
            borderRadius: 8,
            color: "#1a1a1a",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Back to Town
        </div>
      </div>
    </div>
  );
}

function PsychicGuessingUI() {
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const psychicCustomer = useGame((s) => s.psychicCustomer);
  const psychicGuesses = useGame((s) => s.psychicGuesses);
  const psychicGuessesRemaining = useGame((s) => s.psychicGuessesRemaining);
  const psychicRound = useGame((s) => s.psychicRound);
  const psychicGuessHint = useGame((s) => s.psychicGuessHint);
  const submitPsychicGuess = useGame((s) => s.submitPsychicGuess);
  const psychicCustomerEnd = useGame((s) => s.psychicCustomerEnd);
  const [inputValue, setInputValue] = useState("");

  const chachingSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    chachingSoundRef.current = new Audio("/sounds/success.mp3");
  }, []);

  useEffect(() => {
    if (psychicGamePhase === "won") {
      chachingSoundRef.current?.play().catch(() => {});
    }
  }, [psychicGamePhase]);

  const handleSubmit = useCallback(() => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 1 || num > 100) return;
    submitPsychicGuess(num);
    setInputValue("");
  }, [inputValue, submitPsychicGuess]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    e.stopPropagation();
  }, [handleSubmit]);

  if (psychicGamePhase !== "guessing" && psychicGamePhase !== "won" && psychicGamePhase !== "lost") return null;
  if (!psychicCustomer) return null;

  const isGameOver = psychicGamePhase === "won" || psychicGamePhase === "lost";

  const roundLabel = psychicRound === 1 ? "Random Guessing" : psychicRound === 2 ? "Sequential Guessing" : "Binary Search";

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(26, 10, 46, 0.95)",
        borderRadius: 14,
        padding: "20px 28px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 100,
        maxWidth: 520,
        width: "92%",
        border: `2px solid ${isGameOver ? (psychicGamePhase === "won" ? "#69f0ae" : "#ff6b6b") : "#9b59b6"}`,
        boxShadow: `0 4px 30px ${isGameOver ? (psychicGamePhase === "won" ? "rgba(105,240,174,0.3)" : "rgba(255,107,107,0.3)") : "rgba(155,89,182,0.3)"}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0b0ff" }}>
          Customer: <span style={{ color: psychicCustomer.color }}>{psychicCustomer.name}</span>
        </div>
        <div style={{ fontSize: 12, color: "#9b59b6", fontWeight: 600 }}>
          {roundLabel}
        </div>
      </div>

      <div style={{ fontSize: 12, color: psychicGuessesRemaining <= 3 ? "#ff6b6b" : "rgba(255,255,255,0.5)", fontWeight: 700, marginBottom: 10 }}>
        {psychicGuessesRemaining} guesses left
      </div>

      {psychicGuesses.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {psychicGuesses.map((g, i) => (
            <div key={i} style={{
              padding: "6px 12px",
              marginBottom: 4,
              borderRadius: 6,
              fontSize: 13,
              background: g.result === "correct"
                ? "rgba(105, 240, 174, 0.15)"
                : "rgba(155, 89, 182, 0.1)",
              border: `1px solid ${g.result === "correct" ? "#69f0ae" : "rgba(155,89,182,0.2)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontWeight: 600 }}>
                Is it <strong>{g.guess}</strong>?
              </span>
              <span style={{
                color: g.result === "correct" ? "#69f0ae" : psychicRound === 1 ? "#e0b0ff" : g.result === "high" ? "#ff6b6b" : "#4fc3f7",
                fontWeight: 700,
              }}>
                {g.result === "correct"
                  ? `Aw man! You got it! It's ${g.guess}!`
                  : psychicRound === 1
                  ? "Try again!"
                  : g.result === "high"
                  ? `Less than ${g.guess}`
                  : `Greater than ${g.guess}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {psychicGuessHint && (
        <div style={{
          padding: "8px 12px",
          marginBottom: 10,
          borderRadius: 6,
          background: "rgba(255, 193, 7, 0.15)",
          border: "1px solid rgba(255, 193, 7, 0.4)",
          fontSize: 13,
          color: "#ffc107",
          fontWeight: 600,
        }}>
          {psychicGuessHint}
        </div>
      )}

      {isGameOver ? (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 8,
            color: psychicGamePhase === "won" ? "#69f0ae" : "#ff6b6b",
          }}>
            {psychicGamePhase === "won"
              ? `${psychicCustomer.name}: "Aw man! You won, here's the $100!"`
              : `Out of guesses! It was ${psychicCustomer.favoriteNumber}.`}
          </div>
          <div style={{ fontSize: 16, marginBottom: 14, color: psychicGamePhase === "won" ? "#ffd700" : "#ff6b6b" }}>
            {psychicGamePhase === "won" ? "+$100" : "-$100"}
          </div>
          <div
            onClick={psychicCustomerEnd}
            style={{
              display: "inline-block",
              padding: "10px 28px",
              background: "linear-gradient(135deg, #9b59b6, #6a0dad)",
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Next Customer
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            min={1}
            max={100}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1-100"
            autoFocus
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: "2px solid #9b59b6",
              background: "rgba(0,0,0,0.4)",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              outline: "none",
            }}
          />
          <div
            onClick={handleSubmit}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #9b59b6, #6a0dad)",
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Guess
          </div>
        </div>
      )}
    </div>
  );
}

function PsychicHUD() {
  const psychicBalance = useGame((s) => s.psychicBalance);
  const psychicCustomersServed = useGame((s) => s.psychicCustomersServed);
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const psychicRound = useGame((s) => s.psychicRound);
  const restart = useGame((s) => s.restart);

  if (psychicGamePhase === "instructions" || psychicGamePhase === "transition" || psychicGamePhase === "round_win" || psychicGamePhase === "round_lose" || psychicGamePhase === "lesson") return null;

  const roundLabel = psychicRound === 1 ? "Round 1: Random" : psychicRound === 2 ? "Round 2: Sequential" : "Round 3: Binary Search";
  const winTarget = psychicRound === 3 ? 300 : 200;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 50,
          background: "rgba(26, 10, 46, 0.9)",
          borderRadius: 10,
          padding: "12px 20px",
          fontFamily: "'Inter', sans-serif",
          border: "1px solid rgba(155, 89, 182, 0.4)",
          minWidth: 200,
        }}
      >
        <div style={{ fontSize: 11, color: "#9b59b6", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          {roundLabel}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: psychicBalance >= 0 ? "#ffd700" : "#ff6b6b", marginBottom: 4 }}>
          ${psychicBalance}
        </div>
        <div style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 4,
        }}>
          Goal: ${winTarget} to win | -$200 = lose
        </div>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: 4,
          height: 6,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${Math.max(0, Math.min(100, ((psychicBalance + 200) / (winTarget + 200)) * 100))}%`,
            height: "100%",
            background: psychicBalance >= 0 ? "#69f0ae" : "#ff6b6b",
            transition: "width 0.3s ease",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
          Customers served: {psychicCustomersServed}
        </div>
        {psychicGamePhase === "waiting" && (
          <div style={{ fontSize: 11, color: "#e0b0ff", marginTop: 4, fontStyle: "italic" }}>
            Waiting for next customer...
          </div>
        )}
      </div>

      <div
        onClick={restart}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(26, 10, 46, 0.8)",
          borderRadius: 8,
          padding: "8px 16px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          zIndex: 50,
          border: "1px solid rgba(155, 89, 182, 0.3)",
        }}
      >
        Back to Town
      </div>
    </>
  );
}

function App() {
  const phase = useGame((s) => s.phase);
  const practiceActive = useGame((s) => s.practiceActive);
  const currentWorld = useGame((s) => s.currentWorld);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.id) setUser(data);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#0a1628",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthenticated={setUser} />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {phase === "ready" && <StartScreen username={user.username} onLogout={handleLogout} />}

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
            {currentWorld === "psychic" && <PsychicWorld />}
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
            <FactoryLessonUI />
            <FactoryPracticeQuizWrapper />
          </>
        )}

        {phase === "playing" && currentWorld === "psychic" && (
          <>
            <PsychicHUD />
            <PsychicInstructionsUI />
            <PsychicTransitionUI />
            <PsychicRoundResultUI />
            <PsychicLessonUI />
            <PsychicGuessingUI />
            <PsychicPracticeQuizWrapper />
          </>
        )}
      </KeyboardControls>
    </div>
  );
}

export default App;
