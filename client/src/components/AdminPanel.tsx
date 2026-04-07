import { useState } from "react";
import { ADMIN_USERNAMES } from "../lib/adminConfig";
import { useGame, GameWorld } from "../lib/stores/useGame";
import { useQuestionPrefetch } from "../lib/stores/useQuestionPrefetch";
import { TOWN_QUESTIONS, TOWN_LESSON_QUESTIONS } from "./game/townQuestions";
import { OCEAN_QUESTIONS } from "./game/oceanQuestions";
import { FACTORY_QUESTIONS } from "./game/factoryQuestions";
import { PSYCHIC_QUESTIONS } from "./game/psychicQuestions";

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

  const handleSkipToPractice = (world: GameWorld) => {
    const prefetch = useQuestionPrefetch.getState().prefetchQuestions;
    const setState = useGame.setState;

    const clearAllPractice = {
      phase: "playing" as const,
      currentWorld: world,
      activeDialogue: null as { speaker: string; text: string }[] | null,
      dialogueIndex: 0,
      activeNpc: null as string | null,
      practiceActive: false,
      oceanPracticeActive: false,
      factoryPracticeActive: false,
      psychicPracticeActive: false,
    };

    switch (world) {
      case "town":
        prefetch("town", TOWN_QUESTIONS);
        prefetch("town-lesson", TOWN_LESSON_QUESTIONS);
        setState({
          ...clearAllPractice,
          practiceUnlocked: true,
          practiceActive: true,
          practiceScore: 0,
          practiceCompleted: false,
        });
        break;

      case "ocean":
        prefetch("ocean", OCEAN_QUESTIONS);
        setState({
          ...clearAllPractice,
          oceanPracticeUnlocked: true,
          oceanPracticeActive: true,
          oceanPracticeScore: 0,
          oceanPracticeCompleted: false,
          oceanLessonPhase: 0,
          currentSurveyIndex: null as number | null,
          world2Dialogue: null as { speaker: string; text: string }[] | null,
          world2DialogueIndex: 0,
        });
        break;

      case "factory":
        prefetch("factory", FACTORY_QUESTIONS);
        setState({
          ...clearAllPractice,
          factoryPracticeUnlocked: true,
          factoryPracticeActive: true,
          factoryPracticeScore: 0,
          factoryPracticeCompleted: false,
          factoryLessonPhase: 0,
          activeMachine: null as "hat" | "tshirt" | "jacket" | null,
          world3Dialogue: null as { speaker: string; text: string }[] | null,
          world3DialogueIndex: 0,
        });
        break;

      case "psychic":
        prefetch("psychic", PSYCHIC_QUESTIONS);
        setState({
          ...clearAllPractice,
          psychicPracticeActive: true,
          psychicPracticeScore: 0,
          psychicPracticeCompleted: false,
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
        bottom: 12,
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
            Skip to practice:
          </div>
          {WORLDS.map(({ label, world }) => (
            <button
              key={world}
              onClick={() => handleSkipToPractice(world)}
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
