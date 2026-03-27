import { useState, useEffect, useRef } from "react";
import { useGame } from "@/lib/stores/useGame";

export function ScoreHUD() {
  const totalScore = useGame((s) => s.totalScore);
  const [displayScore, setDisplayScore] = useState(totalScore);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scorePopup, setScorePopup] = useState<{ amount: number; id: number } | null>(null);
  const prevScoreRef = useRef(totalScore);
  const popupIdRef = useRef(0);

  useEffect(() => {
    if (totalScore !== prevScoreRef.current) {
      const diff = totalScore - prevScoreRef.current;
      prevScoreRef.current = totalScore;
      setIsAnimating(true);
      popupIdRef.current += 1;
      setScorePopup({ amount: diff, id: popupIdRef.current });

      const startVal = displayScore;
      const endVal = totalScore;
      const duration = 600;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(startVal + (endVal - startVal) * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);

      setTimeout(() => setIsAnimating(false), 400);
      setTimeout(() => setScorePopup(null), 1200);
    }
  }, [totalScore]);

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.92) 100%)",
          borderRadius: 12,
          padding: "8px 16px",
          border: "1px solid rgba(250, 204, 21, 0.3)",
          boxShadow: isAnimating
            ? "0 0 20px rgba(250, 204, 21, 0.5), 0 0 40px rgba(250, 204, 21, 0.2)"
            : "0 4px 16px rgba(0, 0, 0, 0.3)",
          transform: isAnimating ? "scale(1.08)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            filter: isAnimating ? "brightness(1.5)" : "brightness(1)",
            transition: "filter 0.3s",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#facc15"
              stroke="#eab308"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(250, 204, 21, 0.7)",
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              lineHeight: 1,
            }}
          >
            Score
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#facc15",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.1,
              textShadow: isAnimating ? "0 0 10px rgba(250, 204, 21, 0.6)" : "none",
              transition: "text-shadow 0.3s",
            }}
          >
            {displayScore}
          </div>
        </div>
      </div>

      {scorePopup && (
        <div
          key={scorePopup.id}
          style={{
            marginTop: 4,
            fontSize: 16,
            fontWeight: 800,
            color: "#4ade80",
            fontFamily: "'Inter', sans-serif",
            textShadow: "0 0 8px rgba(74, 222, 128, 0.5)",
            animation: "score-popup-rise 1.2s ease-out forwards",
          }}
        >
          +{scorePopup.amount}
        </div>
      )}

      <style>{`
        @keyframes score-popup-rise {
          0% { opacity: 0; transform: translateY(8px) scale(0.8); }
          20% { opacity: 1; transform: translateY(0) scale(1.1); }
          40% { transform: translateY(-4px) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
