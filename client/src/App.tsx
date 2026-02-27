import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Game } from "./components/game/Game";
import { OceanWorld } from "./components/game/OceanWorld";
import { DialogueUI } from "./components/game/DialogueUI";
import { GameHUD } from "./components/game/GameHUD";
import { PracticeQuizUI } from "./components/game/PracticeQuizUI";
import { SurveyUI } from "./components/game/SurveyUI";
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
        advanceWorld2Dialogue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
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
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const currentSurveyIndex = useGame((s) => s.currentSurveyIndex);
  const restart = useGame((s) => s.restart);
  const oceanQuestStarted = useGame((s) => s.oceanQuestStarted);
  const ecosystems = useGame((s) => s.ecosystems);
  const oceanQuestCompleted = useGame((s) => s.oceanQuestCompleted);

  if (world2Dialogue || currentSurveyIndex !== null) return null;

  const surveyedCount = ecosystems.filter((e) => e.surveyed).length;

  let objectiveText = "Talk to Josh at the Beach Station to get started!";
  if (oceanQuestCompleted) {
    objectiveText = "Quest complete! Josh will have more tasks soon.";
  } else if (oceanQuestStarted) {
    if (surveyedCount === 4) {
      objectiveText = "All ecosystems surveyed! Report back to Josh.";
    } else {
      objectiveText = `Survey marine ecosystems (${surveyedCount}/4). Walk to a zone and press E.`;
    }
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(0, 30, 60, 0.8)",
          borderRadius: 8,
          padding: "12px 18px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 50,
          maxWidth: 380,
          border: "1px solid rgba(0, 188, 212, 0.3)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#00bcd4",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Ocean World
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          {objectiveText}
        </div>
        {oceanQuestStarted && !oceanQuestCompleted && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
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
        WASD / Arrows to move | E to interact
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
            far: 200,
          }}
          gl={{
            antialias: true,
            powerPreference: "default",
          }}
        >
          <Suspense fallback={null}>
            {currentWorld === "town" ? <Game /> : <OceanWorld />}
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
          </>
        )}
      </KeyboardControls>
    </div>
  );
}

export default App;
