import { useState } from "react";
import { ADMIN_USERNAMES } from "../lib/adminConfig";
import { useGame, GameWorld } from "../lib/stores/useGame";

interface AdminPanelProps {
  username: string;
}

const WORLDS: { label: string; world: GameWorld }[] = [
  { label: "Town", world: "town" },
  { label: "Ocean", world: "ocean" },
  { label: "Factory", world: "factory" },
  { label: "Psychic", world: "psychic" },
];

export function AdminPanel({ username }: Readonly<AdminPanelProps>) {
  const [collapsed, setCollapsed] = useState(true);

  const isAdmin = ADMIN_USERNAMES.some(
    (admin) => admin.toLowerCase() === username.toLowerCase()
  );

  if (!isAdmin) return null;

  const handleGoToWorld = (world: GameWorld) => {
    const setState = useGame.setState;

    const baseState = {
      phase: "playing" as const,
      currentWorld: world,
      activeDialogue: null as { speaker: string; text: string }[] | null,
      dialogueIndex: 0,
      activeNpc: null as string | null,
      practiceActive: false,
      practiceUnlocked: false,
      practiceScore: 0,
      practiceCompleted: false,
      oceanPracticeActive: false,
      oceanPracticeUnlocked: false,
      oceanPracticeScore: 0,
      oceanPracticeCompleted: false,
      factoryPracticeActive: false,
      factoryPracticeUnlocked: false,
      factoryPracticeScore: 0,
      factoryPracticeCompleted: false,
      psychicPracticeActive: false,
      psychicPracticeScore: 0,
      psychicPracticeCompleted: false,
    };

    switch (world) {
      case "town":
        setState({
          ...baseState,
        });
        break;

      case "ocean":
        setState({
          ...baseState,
          oceanLessonPhase: 0,
          currentSurveyIndex: null as number | null,
          world2Dialogue: null as { speaker: string; text: string }[] | null,
          world2DialogueIndex: 0,
        });
        break;

      case "factory":
        setState({
          ...baseState,
          factoryLessonPhase: 0,
          activeMachine: null as "hat" | "tshirt" | "jacket" | null,
          world3Dialogue: null as { speaker: string; text: string }[] | null,
          world3DialogueIndex: 0,
        });
        break;

      case "psychic":
        setState({
          ...baseState,
          psychicGamePhase: "waiting" as const,
          psychicCustomer: null,
          psychicGuesses: [],
          psychicGuessesRemaining: 10,
          psychicGuessHint: null,
          psychicLastGuess: null,
          psychicBinaryMin: 1,
          psychicBinaryMax: 100,
          psychicSequentialStart: null,
        });
        break;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 60,
        left: 12,
        zIndex: 9999,
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        userSelect: "none",
      }}
    >
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: "rgba(30, 30, 30, 0.85)",
            color: "#94a3b8",
            border: "1px solid rgba(100, 116, 139, 0.4)",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Admin ▸
        </button>
      ) : (
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            border: "1px solid rgba(100, 116, 139, 0.4)",
            borderRadius: 8,
            padding: "8px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 140,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#94a3b8",
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            <span>Admin</span>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: 14,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ color: "#64748b", fontSize: 10, marginBottom: 2 }}>
            Go to world:
          </div>
          {WORLDS.map(({ label, world }) => (
            <button
              key={world}
              onClick={() => handleGoToWorld(world)}
              style={{
                background: "rgba(51, 65, 85, 0.6)",
                color: "#e2e8f0",
                border: "1px solid rgba(100, 116, 139, 0.3)",
                borderRadius: 5,
                padding: "5px 8px",
                cursor: "pointer",
                fontSize: 12,
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(71, 85, 105, 0.8)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(51, 65, 85, 0.6)")
              }
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
