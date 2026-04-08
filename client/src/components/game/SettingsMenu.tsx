import { useState, useRef, useEffect } from "react";
import type { GameWorld } from "@/lib/stores/useGame";

const WORLD_OPTIONS: { id: GameWorld; label: string; color: string }[] = [
  { id: "town", label: "Town", color: "#4fc3f7" },
  { id: "ocean", label: "Ocean", color: "#69f0ae" },
  { id: "factory", label: "Factory", color: "#ff9800" },
  { id: "psychic", label: "Psychic", color: "#9b59b6" },
];

interface SettingsMenuProps {
  onLogout: () => void;
  onResetProgress: () => void;
  gameCompleted: boolean;
  currentWorld: GameWorld;
  onWorldChange: (world: GameWorld) => void;
}

export function SettingsMenu({ onLogout, onResetProgress, gameCompleted, currentWorld, onWorldChange }: Readonly<SettingsMenuProps>) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showWorldPicker, setShowWorldPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmReset(false);
        setShowWorldPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        zIndex: 200,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <button
        onClick={() => { setOpen(!open); setConfirmReset(false); setShowWorldPicker(false); }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "1px solid rgba(148, 163, 184, 0.3)",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.92) 100%)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          boxShadow: open ? "0 0 12px rgba(148, 163, 184, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "1px solid rgba(148, 163, 184, 0.6)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "1px solid rgba(148, 163, 184, 0.3)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 0,
            minWidth: 200,
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.96) 100%)",
            backdropFilter: "blur(12px)",
            borderRadius: 12,
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            padding: 8,
            animation: "settings-fade-in 0.15s ease-out",
          }}
        >
          {(() => {
            if (!confirmReset && !showWorldPicker) return (
            <>
              {gameCompleted && (
                <button
                  onClick={() => setShowWorldPicker(true)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "#a78bfa",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(167, 139, 250, 0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Switch World
                </button>
              )}
              <button
                onClick={() => setConfirmReset(true)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: "#f87171",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248, 113, 113, 0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Reset Progress
              </button>
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: "#94a3b8",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(148, 163, 184, 0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </>
          );
            if (showWorldPicker) return (
            <div style={{ padding: "4px 6px" }}>
              <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Switch World
              </div>
              {WORLD_OPTIONS.map((world) => (
                <button
                  key={world.id}
                  onClick={() => {
                    if (world.id !== currentWorld) {
                      onWorldChange(world.id);
                    }
                    setShowWorldPicker(false);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: world.id === currentWorld ? `${world.color}20` : "transparent",
                    border: world.id === currentWorld ? `1px solid ${world.color}60` : "1px solid transparent",
                    borderRadius: 8,
                    color: world.id === currentWorld ? world.color : "#94a3b8",
                    fontSize: 14,
                    fontWeight: world.id === currentWorld ? 700 : 500,
                    fontFamily: "'Inter', sans-serif",
                    cursor: world.id === currentWorld ? "default" : "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (world.id !== currentWorld) {
                      e.currentTarget.style.background = `${world.color}15`;
                      e.currentTarget.style.color = world.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (world.id !== currentWorld) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#94a3b8";
                    }
                  }}
                >
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: world.color,
                    display: "inline-block",
                    opacity: world.id === currentWorld ? 1 : 0.5,
                  }} />
                  {world.label}
                  {world.id === currentWorld && (
                    <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.7 }}>current</span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setShowWorldPicker(false)}
                style={{
                  width: "100%",
                  padding: "6px 0",
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                Back
              </button>
            </div>
          );
            return (
            <div style={{ padding: "4px 6px" }}>
              <div style={{ color: "#f87171", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Are you sure? This will permanently erase all your game progress.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    background: "rgba(148, 163, 184, 0.15)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: 8,
                    color: "#94a3b8",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setOpen(false); setConfirmReset(false); onResetProgress(); }}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    background: "rgba(248, 113, 113, 0.2)",
                    border: "1px solid rgba(248, 113, 113, 0.4)",
                    borderRadius: 8,
                    color: "#f87171",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          );
          })()}
        </div>
      )}

      <style>{`
        @keyframes settings-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
