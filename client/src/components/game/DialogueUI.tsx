import { useEffect } from "react";
import { useGame } from "@/lib/stores/useGame";

export function DialogueUI() {
  const activeDialogue = useGame((s) => s.activeDialogue);
  const dialogueIndex = useGame((s) => s.dialogueIndex);
  const advanceDialogue = useGame((s) => s.advanceDialogue);
  const activeNpc = useGame((s) => s.activeNpc);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        activeDialogue &&
        (e.key === "e" || e.key === "E" || e.key === " " || e.key === "Enter")
      ) {
        advanceDialogue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeDialogue, advanceDialogue]);

  if (!activeDialogue || dialogueIndex >= activeDialogue.length) return null;

  const current = activeDialogue[dialogueIndex];
  const isLastLine = dialogueIndex === activeDialogue.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(700px, 90vw)",
        background: "rgba(0, 0, 0, 0.85)",
        borderRadius: 12,
        padding: "20px 28px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 100,
        border: "2px solid rgba(255,255,255,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#ffeb3b",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {current.speaker}
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 12 }}>
        {current.text}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          textAlign: "right",
        }}
      >
        {isLastLine
          ? "Press E / Space / Enter to close"
          : `Press E / Space / Enter to continue (${dialogueIndex + 1}/${activeDialogue.length})`}
      </div>
    </div>
  );
}
