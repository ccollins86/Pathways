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

    const commonState = {
      phase: "playing" as const,
      currentWorld: world,
      activeDialogue: null as { speaker: string; text: string }[] | null,
      dialogueIndex: 0,
      activeNpc: null as string | null,
      shopOpen: null as string | null,
    };

    switch (world) {
      case "town":
        setState({
          ...commonState,
          talkedToDan: false,
          talkedToBob: false,
          knownDisaster: null,
          reportedToDan: false,
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
          respawnTrigger: 0,
        });
        break;

      case "ocean":
        setState({
          ...commonState,
          world2Dialogue: null as { speaker: string; text: string }[] | null,
          world2DialogueIndex: 0,
          oceanQuestStarted: false,
          currentSurveyIndex: null as number | null,
          oceanQuestCompleted: false,
          hasDivingSuit: false,
          cleanupQuestStarted: false,
          inBoat: false,
          cleanupQuestCompleted: false,
          oceanLessonPhase: 0,
          oceanPracticeUnlocked: false,
          oceanPracticeActive: false,
          oceanPracticeScore: 0,
          oceanPracticeCompleted: false,
          oceanPortalActive: false,
        });
        break;

      case "factory":
        setState({
          ...commonState,
          world3Dialogue: null as { speaker: string; text: string }[] | null,
          world3DialogueIndex: 0,
          factoryQuestStarted: false,
          activeMachine: null as "hat" | "tshirt" | "jacket" | null,
          hatMachineState: "idle" as const,
          tshirtMachineState: "idle" as const,
          jacketMachineState: "idle" as const,
          carryingProduct: null,
          carryingBox: null,
          factoryOrderComplete: false,
          factoryLessonPhase: 0,
          factoryPracticeUnlocked: false,
          factoryPracticeActive: false,
          factoryPracticeScore: 0,
          factoryPracticeCompleted: false,
          factoryPortalActive: false,
        });
        break;

      case "psychic":
        setState({
          ...commonState,
          psychicBalance: 0,
          psychicCustomer: null,
          psychicGuesses: [],
          psychicGuessesRemaining: 10,
          psychicGamePhase: "instructions" as const,
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
