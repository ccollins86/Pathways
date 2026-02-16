import { useState } from "react";
import { useGame } from "@/lib/stores/useGame";
import GAME_CONFIG from "../../gameConfig";

export function GameHUD() {
  const talkedToQuestGiver = useGame((s) => s.talkedToQuestGiver);
  const talkedToRevealer = useGame((s) => s.talkedToRevealer);
  const knownScenario = useGame((s) => s.knownScenario);
  const reportedBack = useGame((s) => s.reportedBack);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const tasksActive = useGame((s) => s.tasksActive);
  const carriedItem = useGame((s) => s.carriedItem);
  const completedTasks = useGame((s) => s.completedTasks);
  const scenario = useGame((s) => s.scenario);
  const questCompleted = useGame((s) => s.questCompleted);
  const questFailed = useGame((s) => s.questFailed);
  const failReason = useGame((s) => s.failReason);
  const dropItem = useGame((s) => s.dropItem);
  const restart = useGame((s) => s.restart);
  const practiceUnlocked = useGame((s) => s.practiceUnlocked);
  const unlockPractice = useGame((s) => s.unlockPractice);

  const [showLesson, setShowLesson] = useState(false);

  const config = GAME_CONFIG;
  const questGiverName = config.questGiverName;
  const revealerName = config.infoRevealerName;
  const currentScenario = config.scenarios.find((s) => s.id === scenario);
  const scenarioName = currentScenario?.name ?? scenario;

  if (activeDialogue) return null;

  let objective = `Find ${questGiverName} and talk to them.`;
  if (questFailed) {
    objective = "Quest Failed! You made the wrong choice.";
  } else if (questCompleted && practiceUnlocked) {
    objective = "Visit the Practice Station booth to test your knowledge!";
  } else if (questCompleted) {
    objective = "Quest Complete! Great job!";
  } else if (tasksActive && knownScenario) {
    objective = `Prepare for ${scenarioName}! ${currentScenario?.description ?? ""}`;
  } else if (talkedToQuestGiver && talkedToRevealer && knownScenario && !reportedBack) {
    objective = `Go back to ${questGiverName} and tell them it's ${scenarioName}!`;
  } else if (talkedToQuestGiver && !talkedToRevealer) {
    objective = `Find ${revealerName} and ask them what's happening.`;
  }

  const scenarioTargets = config.taskTargets.filter(
    (t) => t.forScenario === scenario
  );

  return (
    <>
      {questCompleted && !showLesson && !practiceUnlocked && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 100, 0, 0.9)",
            borderRadius: 16,
            padding: "32px 48px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            textAlign: "center",
            border: "3px solid #66bb6a",
            boxShadow: "0 0 40px rgba(102, 187, 106, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Quest Complete!
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.9 }}>
            You successfully completed all tasks for {scenarioName}!
          </div>
          <div
            onClick={() => setShowLesson(true)}
            style={{
              marginTop: 20,
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
            View Programming Lesson
          </div>
        </div>
      )}

      {questCompleted && showLesson && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(13, 25, 48, 0.96)",
            borderRadius: 16,
            padding: "28px 36px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            border: "3px solid #4fc3f7",
            boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
            maxWidth: 580,
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#4fc3f7" }}>
            {config.lesson.title}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
            {config.lesson.subtitle}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
            {config.lesson.explanation}
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
              color: "#e0e0e0",
            }}
          >
            {config.lesson.codeExample}
          </div>

          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
            {config.lesson.footnote}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div
              onClick={() => { setShowLesson(false); unlockPractice(); }}
              style={{
                padding: "10px 24px",
                background: "#4fc3f7",
                border: "none",
                borderRadius: 8,
                color: "#0d47a1",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Continue Playing
            </div>
            <div
              onClick={() => { setShowLesson(false); restart(); }}
              style={{
                padding: "10px 24px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Play Again
            </div>
          </div>
        </div>
      )}

      {questFailed && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(120, 0, 0, 0.92)",
            borderRadius: 16,
            padding: "32px 48px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 150,
            textAlign: "center",
            border: "3px solid #ef5350",
            boxShadow: "0 0 40px rgba(239, 83, 80, 0.5)",
            maxWidth: 440,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Quest Failed!
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.9 }}>
            {failReason}
          </div>
          <div
            onClick={restart}
            style={{
              marginTop: 20,
              padding: "10px 28px",
              background: "#ef5350",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try Again
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(0, 0, 0, 0.75)",
          borderRadius: 8,
          padding: "12px 18px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 50,
          maxWidth: 380,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: questFailed ? "#ef5350" : questCompleted ? "#66bb6a" : "#ffeb3b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {questFailed ? "Failed" : questCompleted ? "Completed" : "Objective"}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>{objective}</div>
      </div>

      {carriedItem && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 16,
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: 8,
            padding: "10px 16px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 50,
            border: "2px solid #ffeb3b",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "#ffeb3b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Carrying
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {carriedItem}
          </div>
          <div
            style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, cursor: "pointer" }}
            onClick={dropItem}
          >
            Press Q to drop
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0, 0, 0, 0.75)",
          borderRadius: 8,
          padding: "12px 18px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 50,
          border: "1px solid rgba(255,255,255,0.15)",
          minWidth: 220,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: "#ffeb3b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
          Quest Progress
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ color: talkedToQuestGiver ? "#66bb6a" : "white" }}>
            {talkedToQuestGiver ? "✓" : "○"} Talk to {questGiverName}
          </div>
          <div style={{ color: talkedToRevealer ? "#66bb6a" : "white" }}>
            {talkedToRevealer ? "✓" : "○"} Ask {revealerName}
          </div>
          <div style={{ color: reportedBack ? "#66bb6a" : "white" }}>
            {reportedBack ? "✓" : "○"} Report back to {questGiverName}
          </div>

          {tasksActive && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ff9800", marginTop: 8, marginBottom: 2 }}>
                {scenarioName} Tasks:
              </div>
              {scenarioTargets.map((target) => (
                <div
                  key={target.id}
                  style={{ color: completedTasks[target.id] ? "#66bb6a" : "white" }}
                >
                  {completedTasks[target.id] ? "✓" : "○"} {target.label}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          background: "rgba(0, 0, 0, 0.65)",
          borderRadius: 8,
          padding: "8px 14px",
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          zIndex: 50,
        }}
      >
        WASD / Arrows to move | E to interact{carriedItem ? " | Q to drop" : ""}
      </div>
    </>
  );
}
