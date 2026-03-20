import type { QuizTheme } from "./PracticeQuizBase";

interface QuizLoadingOverlayProps {
  loading: boolean;
  error: string | null;
  theme: QuizTheme;
  onRetry: () => void;
  onClose: () => void;
}

export function QuizLoadingOverlay({ loading, error, theme, onRetry, onClose }: QuizLoadingOverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: theme.bgColor,
        borderRadius: 16,
        padding: "32px 40px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: `3px solid ${theme.borderColor}`,
        boxShadow: theme.boxShadow,
        width: 420,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, color: theme.accentColor, marginBottom: 20 }}>
        {theme.title}
      </div>

      {loading && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: `4px solid rgba(255,255,255,0.1)`,
                borderTop: `4px solid ${theme.accentColor}`,
                borderRadius: "50%",
                margin: "0 auto",
                animation: "quiz-spinner 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes quiz-spinner { to { transform: rotate(360deg); } }`}</style>
          </div>
          <div style={{ fontSize: 15, opacity: 0.8 }}>
            Generating fresh questions...
          </div>
        </>
      )}

      {error && (
        <>
          <div style={{ fontSize: 14, color: "#ff8a80", marginBottom: 20, lineHeight: 1.6 }}>
            {error}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <div
              onClick={onRetry}
              style={{
                padding: "10px 24px",
                background: theme.accentColor,
                border: "none",
                borderRadius: 8,
                color: theme.nextBtnTextColor,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try Again
            </div>
            <div
              onClick={onClose}
              style={{
                padding: "10px 24px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Exit
            </div>
          </div>
        </>
      )}
    </div>
  );
}
