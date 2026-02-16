import { useGame } from "@/lib/stores/useGame";

export function GameHUD() {
  const talkedToDan = useGame((s) => s.talkedToDan);
  const talkedToBob = useGame((s) => s.talkedToBob);
  const knownDisaster = useGame((s) => s.knownDisaster);
  const activeDialogue = useGame((s) => s.activeDialogue);

  if (activeDialogue) return null;

  let objective = "Find Dan at the USC Apparel stand and talk to him.";
  if (talkedToDan && !talkedToBob) {
    objective = "Find Bob and ask him which natural disaster is coming tonight.";
  } else if (talkedToDan && talkedToBob && knownDisaster) {
    const disasterName = knownDisaster.charAt(0).toUpperCase() + knownDisaster.slice(1);
    objective = `Go back to Dan and tell him it's a ${disasterName}! He'll tell you what to do.`;
  }

  return (
    <>
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
          maxWidth: 350,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#ffeb3b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Objective
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>{objective}</div>
      </div>

      {/* Quest progress */}
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
          <div
            style={{
              color:
                talkedToDan && talkedToBob && knownDisaster ? "#66bb6a" : "white",
            }}
          >
            {talkedToDan && talkedToBob && knownDisaster ? "✓" : "○"} Report back to
            Dan
          </div>
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
        WASD / Arrows to move | E to interact
      </div>
    </>
  );
}
