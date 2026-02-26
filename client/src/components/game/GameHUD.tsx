import { useState } from "react";
import { useGame } from "@/lib/stores/useGame";

const ITEM_LABELS: Record<string, string> = {
  sandbag: "Sandbag",
  wood_board: "Wood Board",
  flame_retardant: "Flame Retardant",
  rake: "Rake",
  safety_strap: "Safety Strap",
  wrench: "Wrench",
};

export function GameHUD() {
  const talkedToDan = useGame((s) => s.talkedToDan);
  const talkedToBob = useGame((s) => s.talkedToBob);
  const knownDisaster = useGame((s) => s.knownDisaster);
  const reportedToDan = useGame((s) => s.reportedToDan);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const tasksActive = useGame((s) => s.tasksActive);
  const carriedItemInfo = useGame((s) => s.carriedItem);
  const hurricaneTasks = useGame((s) => s.hurricaneTasks);
  const wildfireTasks = useGame((s) => s.wildfireTasks);
  const earthquakeTasks = useGame((s) => s.earthquakeTasks);
  const questCompleted = useGame((s) => s.questCompleted);
  const questFailed = useGame((s) => s.questFailed);
  const failReason = useGame((s) => s.failReason);
  const dropItem = useGame((s) => s.dropItem);
  const restart = useGame((s) => s.restart);
  const practiceUnlocked = useGame((s) => s.practiceUnlocked);
  const practiceActive = useGame((s) => s.practiceActive);
  const practiceScore = useGame((s) => s.practiceScore);
  const unlockPractice = useGame((s) => s.unlockPractice);
  const practiceCompleted = useGame((s) => s.practiceCompleted);
  const portalActive = useGame((s) => s.portalActive);

  const [showLesson, setShowLesson] = useState(false);

  if (activeDialogue) return null;

  let objective = "Find Dan at the USC Apparel stand and talk to him.";
  if (questFailed) {
    objective = "Quest Failed! You made the wrong preparation choice.";
  } else if (portalActive) {
    objective = "A portal has appeared! Walk into it to enter the next world!";
  } else if (questCompleted && practiceCompleted) {
    objective = "Practice complete! A portal should appear soon...";
  } else if (questCompleted && practiceUnlocked) {
    objective = "Visit the Practice Station booth to test your programming knowledge!";
  } else if (questCompleted) {
    objective = "Quest Complete! You successfully prepared for the disaster!";
  } else if (tasksActive && knownDisaster) {
    if (knownDisaster === "hurricane") {
      objective = "Prepare for the Hurricane! Board windows and sandbag doors.";
    } else if (knownDisaster === "wildfire") {
      objective = "Prepare for the Wildfire! Spray house and clear vegetation.";
    } else if (knownDisaster === "earthquake") {
      objective = "Prepare for the Earthquake! Strap furniture and shut off gas lines.";
    }
  } else if (talkedToDan && talkedToBob && knownDisaster && !reportedToDan) {
    const disasterName =
      knownDisaster.charAt(0).toUpperCase() + knownDisaster.slice(1);
    objective = `Go back to Dan and tell him it's a ${disasterName}!`;
  } else if (talkedToDan && !talkedToBob) {
    objective = "Find Bob and ask him which natural disaster is coming tonight.";
  }

  return (
    <>
      {/* Quest completed banner / lesson */}
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
            You successfully prepared the house for the{" "}
            {knownDisaster?.charAt(0).toUpperCase()}
            {knownDisaster?.slice(1)}!
          </div>
          <div style={{ fontSize: 14, marginTop: 12, opacity: 0.7 }}>
            Being prepared for natural disasters saves lives.
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
            Branching Statements in Programming
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
            In this quest, you found out that a <strong style={{ color: "#ffeb3b" }}>{knownDisaster}</strong> was coming.
            Even though items for <em>all three</em> disasters were available, you only performed the tasks
            for the {knownDisaster}. You ignored the other items because they didn't match the situation.
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 16 }}>
            This is exactly how <strong style={{ color: "#4fc3f7" }}>if / else-if / else</strong> statements
            work in programming! The computer checks each condition in order, and <em>only executes the
            code block</em> where the condition is true. The other blocks are skipped entirely — just like
            how you skipped the preparations for the other disasters.
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
            <span style={{ color: "#c792ea" }}>if</span>
            <span style={{ color: "#89ddff" }}> (</span>
            <span style={{ color: "#f78c6c" }}>disaster</span>
            <span style={{ color: "#89ddff" }}> === </span>
            <span style={{ color: "#c3e88d" }}>"hurricane"</span>
            <span style={{ color: "#89ddff" }}>)</span>
            <span style={{ color: knownDisaster === "hurricane" ? "#c3e88d" : "#546e7a" }}>{" {\n"}
            {"  "}sandBagDoors();{"\n"}
            {"  "}boardUpWindows();{"\n"}
            {"}"}</span>
            {"\n"}
            <span style={{ color: "#c792ea" }}>else if</span>
            <span style={{ color: "#89ddff" }}> (</span>
            <span style={{ color: "#f78c6c" }}>disaster</span>
            <span style={{ color: "#89ddff" }}> === </span>
            <span style={{ color: "#c3e88d" }}>"wildfire"</span>
            <span style={{ color: "#89ddff" }}>)</span>
            <span style={{ color: knownDisaster === "wildfire" ? "#c3e88d" : "#546e7a" }}>{" {\n"}
            {"  "}sprayFlameRetardant();{"\n"}
            {"  "}clearVegetation();{"\n"}
            {"}"}</span>
            {"\n"}
            <span style={{ color: "#c792ea" }}>else if</span>
            <span style={{ color: "#89ddff" }}> (</span>
            <span style={{ color: "#f78c6c" }}>disaster</span>
            <span style={{ color: "#89ddff" }}> === </span>
            <span style={{ color: "#c3e88d" }}>"earthquake"</span>
            <span style={{ color: "#89ddff" }}>)</span>
            <span style={{ color: knownDisaster === "earthquake" ? "#c3e88d" : "#546e7a" }}>{" {\n"}
            {"  "}strapFurniture();{"\n"}
            {"  "}shutOffGasLines();{"\n"}
            {"}"}</span>
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9, marginBottom: 8 }}>
            {knownDisaster === "hurricane" && (
              <>Because the disaster was <strong style={{ color: "#ffeb3b" }}>"hurricane"</strong>, only the first block ran — sandbagging doors and boarding windows. The wildfire and earthquake blocks were skipped, just like you skipped those items in the game!</>
            )}
            {knownDisaster === "wildfire" && (
              <>Because the disaster was <strong style={{ color: "#ffeb3b" }}>"wildfire"</strong>, only the second block ran — spraying flame retardant and clearing vegetation. The hurricane and earthquake blocks were skipped, just like you skipped those items in the game!</>
            )}
            {knownDisaster === "earthquake" && (
              <>Because the disaster was <strong style={{ color: "#ffeb3b" }}>"earthquake"</strong>, only the third block ran — strapping furniture and shutting off gas lines. The hurricane and wildfire blocks were skipped, just like you skipped those items in the game!</>
            )}
          </div>

          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
            Only one branch executes — the first one whose condition is true. The rest are ignored.
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

      {/* Quest failed banner */}
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
          <div style={{ fontSize: 14, marginTop: 12, opacity: 0.7 }}>
            Remember: match your preparations to the specific disaster that's coming!
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

      {/* Objective tracker */}
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

      {/* Carried item indicator */}
      {carriedItemInfo && (
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
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#ffeb3b",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Carrying
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {ITEM_LABELS[carriedItemInfo.type]}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              marginTop: 4,
              cursor: "pointer",
            }}
            onClick={dropItem}
          >
            Press Q to drop
          </div>
        </div>
      )}

      {/* Quest progress / Task list */}
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
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#ffeb3b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Quest Progress
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ color: talkedToDan ? "#66bb6a" : "white" }}>
            {talkedToDan ? "✓" : "○"} Talk to Dan
          </div>
          <div style={{ color: talkedToBob ? "#66bb6a" : "white" }}>
            {talkedToBob ? "✓" : "○"} Ask Bob about the disaster
          </div>
          <div style={{ color: reportedToDan ? "#66bb6a" : "white" }}>
            {reportedToDan ? "✓" : "○"} Report back to Dan
          </div>

          {tasksActive && knownDisaster === "hurricane" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ff9800",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                Hurricane Prep:
              </div>
              <div
                style={{
                  color: hurricaneTasks.frontDoorSandbagged
                    ? "#66bb6a"
                    : "white",
                }}
              >
                {hurricaneTasks.frontDoorSandbagged ? "✓" : "○"} Sandbag front
                door
              </div>
              <div
                style={{
                  color: hurricaneTasks.backDoorSandbagged
                    ? "#66bb6a"
                    : "white",
                }}
              >
                {hurricaneTasks.backDoorSandbagged ? "✓" : "○"} Sandbag back
                door
              </div>
              <div
                style={{
                  color: hurricaneTasks.window1Boarded ? "#66bb6a" : "white",
                }}
              >
                {hurricaneTasks.window1Boarded ? "✓" : "○"} Board window 1
              </div>
              <div
                style={{
                  color: hurricaneTasks.window2Boarded ? "#66bb6a" : "white",
                }}
              >
                {hurricaneTasks.window2Boarded ? "✓" : "○"} Board window 2
              </div>
            </>
          )}

          {tasksActive && knownDisaster === "wildfire" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ff9800",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                Wildfire Prep:
              </div>
              <div
                style={{
                  color: wildfireTasks.houseSprayed ? "#66bb6a" : "white",
                }}
              >
                {wildfireTasks.houseSprayed ? "✓" : "○"} Spray house with flame
                retardant
              </div>
              <div
                style={{
                  color: wildfireTasks.vegetationCleared ? "#66bb6a" : "white",
                }}
              >
                {wildfireTasks.vegetationCleared ? "✓" : "○"} Clear vegetation
              </div>
            </>
          )}

          {tasksActive && knownDisaster === "earthquake" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ff9800",
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                Earthquake Prep:
              </div>
              <div
                style={{
                  color: earthquakeTasks.furnitureStrapped
                    ? "#66bb6a"
                    : "white",
                }}
              >
                {earthquakeTasks.furnitureStrapped ? "✓" : "○"} Strap furniture
              </div>
              <div
                style={{
                  color: earthquakeTasks.gasShutOff ? "#66bb6a" : "white",
                }}
              >
                {earthquakeTasks.gasShutOff ? "✓" : "○"} Shut off gas lines
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls hint */}
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
        WASD / Arrows to move | E to interact{carriedItemInfo ? " | Q to drop" : ""}
      </div>
    </>
  );
}
