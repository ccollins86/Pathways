import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Game } from "./components/game/Game";
import { DialogueUI } from "./components/game/DialogueUI";
import { GameHUD } from "./components/game/GameHUD";
import { PracticeQuizUI } from "./components/game/PracticeQuizUI";
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

function PortalScreen() {
  const restart = useGame((s) => s.restart);

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
        background: "linear-gradient(135deg, #1a0033 0%, #4a148c 50%, #0d47a1 100%)",
        zIndex: 250,
        fontFamily: "'Inter', sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid #e040fb",
          boxShadow: "0 0 60px rgba(224, 64, 251, 0.6), inset 0 0 40px rgba(124, 77, 255, 0.4)",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          animation: "portalPulse 2s ease-in-out infinite",
        }}
      >
        <span role="img" aria-label="portal">🌀</span>
      </div>
      <style>{`
        @keyframes portalPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(224, 64, 251, 0.6), inset 0 0 40px rgba(124, 77, 255, 0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 80px rgba(224, 64, 251, 0.8), inset 0 0 50px rgba(124, 77, 255, 0.6); }
        }
      `}</style>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 800,
          marginBottom: 16,
          textAlign: "center",
          textShadow: "2px 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        New World Awaits...
      </h1>
      <p
        style={{
          fontSize: 18,
          marginBottom: 8,
          opacity: 0.85,
          textAlign: "center",
          maxWidth: 480,
          lineHeight: 1.6,
        }}
      >
        You've mastered disaster preparedness and programming concepts!
      </p>
      <p
        style={{
          fontSize: 16,
          marginBottom: 32,
          opacity: 0.6,
          textAlign: "center",
          maxWidth: 440,
        }}
      >
        A new game world is being prepared. Check back soon for the next adventure!
      </p>
      <button
        onClick={restart}
        style={{
          padding: "14px 40px",
          fontSize: 18,
          fontWeight: 700,
          background: "#e040fb",
          color: "white",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          letterSpacing: 1,
          boxShadow: "0 4px 20px rgba(224, 64, 251, 0.4)",
        }}
      >
        Play Again
      </button>
    </div>
  );
}

function App() {
  const phase = useGame((s) => s.phase);
  const practiceActive = useGame((s) => s.practiceActive);
  const portalActive = useGame((s) => s.portalActive);

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
      {phase === "ended" && portalActive && <PortalScreen />}

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
            <Game />
          </Suspense>
        </Canvas>

        {phase === "playing" && (
          <>
            <GameHUD />
            <DialogueUI />
            {practiceActive && <PracticeQuizUI />}
          </>
        )}
      </KeyboardControls>
    </div>
  );
}

export default App;
