import { useGame } from "@/lib/stores/useGame";

const ITEM_LABELS: Record<string, string> = {
  sandbag: "Sandbag",
  wood_board: "Wood Board",
  flame_retardant: "Flame Retardant",
  rake: "Rake",
  safety_strap: "Safety Strap",
  book: "Book",
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
  const dropItem = useGame((s) => s.dropItem);

  if (activeDialogue) return null;

  let objective = "Find Dan at the USC Apparel stand and talk to him.";
  if (questCompleted) {
    objective = "Quest Complete! You successfully prepared for the disaster!";
  } else if (tasksActive && knownDisaster) {
    if (knownDisaster === "hurricane") {
      objective = "Prepare for the Hurricane! Board windows and sandbag doors.";
    } else if (knownDisaster === "wildfire") {
      objective = "Prepare for the Wildfire! Spray house and clear vegetation.";
    } else if (knownDisaster === "earthquake") {
      objective = "Prepare for the Earthquake! Strap furniture and secure books.";
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
      {/* Quest completed banner */}
      {questCompleted && (
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
            color: questCompleted ? "#66bb6a" : "#ffeb3b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {questCompleted ? "Completed" : "Objective"}
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
                  color: earthquakeTasks.booksInBag ? "#66bb6a" : "white",
                }}
              >
                {earthquakeTasks.booksInBag ? "✓" : "○"} Put books in brown bag
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
