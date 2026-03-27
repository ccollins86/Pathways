import { useState, useEffect, useRef, useCallback } from "react";

export interface Question {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface QuizTheme {
  title: string;
  accentColor: string;
  hintColor: string;
  bgColor: string;
  borderColor: string;
  boxShadow: string;
  nextBtnTextColor: string;
  confettiColors: string[];
  confettiPrefix: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  spin: number;
  delay: number;
}

function createConfetti(colors: string[]): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < 40; i++) {
    pieces.push({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
      angle: Math.random() * 360,
      velocity: 80 + Math.random() * 120,
      spin: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.15,
    });
  }
  return pieces;
}

interface PracticeQuizBaseProps {
  questions: Question[];
  theme: QuizTheme;
  score: number;
  totalScore: number;
  onClose: () => void;
  onAddScore: (points: number) => void;
  onResetScore?: () => void;
  onComplete: () => void;
  onFirstTryBonus: () => void;
  closeOnComplete?: boolean;
  worldName: string;
}

interface ScorePopup {
  id: number;
  text: string;
  color: string;
  y: number;
}

export function PracticeQuizBase({
  questions,
  theme,
  score,
  totalScore,
  onClose,
  onAddScore,
  onResetScore,
  onComplete,
  onFirstTryBonus,
  closeOnComplete = false,
  worldName,
}: PracticeQuizBaseProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [firstTryCountLocal, setFirstTryCountLocal] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [summaryPhase, setSummaryPhase] = useState(0);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const popupIdRef = useRef(0);

  useEffect(() => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnsweredCorrectly(false);
    setWrongAttempt(false);
    setHadWrongAttempt(false);
    setShowHint(false);
    setFirstTryCountLocal(0);
    onResetScore?.();
    try {
      successSoundRef.current = new Audio("/sounds/success.mp3");
      successSoundRef.current.volume = 0.5;
    } catch {}
  }, []);

  const addPopup = useCallback((text: string, color: string) => {
    popupIdRef.current += 1;
    const popup: ScorePopup = { id: popupIdRef.current, text, color, y: 0 };
    setScorePopups((prev) => [...prev, popup]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== popup.id));
    }, 1500);
  }, []);

  const triggerCelebration = useCallback(() => {
    if (successSoundRef.current) {
      successSoundRef.current.currentTime = 0;
      successSoundRef.current.play().catch(() => {});
    }
    setConfetti(createConfetti(theme.confettiColors));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1200);
  }, [theme.confettiColors]);

  const question = questions[currentQ];
  const isLastQuestion = currentQ >= questions.length - 1;

  const handleAnswer = (index: number) => {
    if (answeredCorrectly) return;
    setSelectedAnswer(index);
    const correct = index === question.correctIndex;
    if (correct) {
      setAnsweredCorrectly(true);
      onAddScore(10);
      addPopup("+10", "#4ade80");
      triggerCelebration();
      if (!hadWrongAttempt) {
        onFirstTryBonus();
        setFirstTryCountLocal((c) => c + 1);
        setTimeout(() => addPopup("+5 First Try!", "#facc15"), 300);
      }
    } else {
      setWrongAttempt(true);
      setHadWrongAttempt(true);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 800);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSummary(true);
      setSummaryPhase(0);
      const baseScore = score + 10 + (!hadWrongAttempt ? 0 : 0);
      setAnimatedTotal(0);
      setTimeout(() => setSummaryPhase(1), 400);
      setTimeout(() => setSummaryPhase(2), 900);
      setTimeout(() => setSummaryPhase(3), 1400);
      setTimeout(() => setSummaryPhase(4), 1900);
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelectedAnswer(null);
    setAnsweredCorrectly(false);
    setWrongAttempt(false);
    setHadWrongAttempt(false);
    setShowHint(false);
  };

  const handleFinishSummary = () => {
    onComplete();
    if (closeOnComplete) onClose();
  };

  const basePoints = score + (answeredCorrectly ? 0 : 0);
  const firstTryBonusTotal = firstTryCountLocal * 5;
  const worldBonus = 50;

  if (showSummary) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)",
            borderRadius: 20,
            padding: "32px 40px",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            zIndex: 250,
            border: `2px solid ${theme.accentColor}`,
            boxShadow: `0 0 60px ${theme.accentColor}40, 0 20px 60px rgba(0,0,0,0.5)`,
            width: 480,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: theme.accentColor,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 4,
              opacity: summaryPhase >= 0 ? 1 : 0,
              transform: summaryPhase >= 0 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out",
            }}
          >
            {worldName} Practice Complete!
          </div>

          <div
            style={{
              fontSize: 48,
              marginBottom: 24,
              opacity: summaryPhase >= 0 ? 1 : 0,
              animation: summaryPhase >= 0 ? "trophy-bounce 0.6s ease-out" : "none",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block" }}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#facc15" stroke="#eab308" strokeWidth="0.5" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                opacity: summaryPhase >= 1 ? 1 : 0,
                transform: summaryPhase >= 1 ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4ade80" opacity="0.2"/><path d="M9 12l2 2 4-4" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Correct Answers</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>
                +{score}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                background: firstTryCountLocal > 0 ? "rgba(250, 204, 21, 0.08)" : "rgba(255,255,255,0.03)",
                borderRadius: 10,
                opacity: summaryPhase >= 2 ? 1 : 0,
                transform: summaryPhase >= 2 ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={firstTryCountLocal > 0 ? "#facc15" : "#475569"} opacity={firstTryCountLocal > 0 ? 1 : 0.5}/></svg>
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  First-Try Bonus ({firstTryCountLocal}/{questions.length})
                </span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: firstTryCountLocal > 0 ? "#facc15" : "#475569" }}>
                +{firstTryBonusTotal}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                background: "rgba(168, 85, 247, 0.08)",
                borderRadius: 10,
                opacity: summaryPhase >= 3 ? 1 : 0,
                transform: summaryPhase >= 3 ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#a855f7" opacity="0.9"/></svg>
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>World Completion</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#a855f7" }}>
                +{worldBonus}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: `linear-gradient(135deg, ${theme.accentColor}15, ${theme.accentColor}08)`,
                borderRadius: 10,
                border: `1px solid ${theme.accentColor}40`,
                opacity: summaryPhase >= 4 ? 1 : 0,
                transform: summaryPhase >= 4 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
                transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700 }}>Session Total</span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: theme.accentColor,
                  textShadow: summaryPhase >= 4 ? `0 0 12px ${theme.accentColor}60` : "none",
                }}
              >
                +{score + firstTryBonusTotal + worldBonus}
              </span>
            </div>
          </div>

          <div
            style={{
              opacity: summaryPhase >= 4 ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.3s",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 16,
              }}
            >
              Total Score: {totalScore}
            </div>
            <div
              onClick={handleFinishSummary}
              style={{
                display: "inline-block",
                padding: "12px 40px",
                background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}cc)`,
                border: "none",
                borderRadius: 10,
                color: theme.nextBtnTextColor,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 20px ${theme.accentColor}40`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLDivElement).style.transform = "scale(1.05)";
                (e.target as HTMLDivElement).style.boxShadow = `0 6px 28px ${theme.accentColor}60`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLDivElement).style.transform = "scale(1)";
                (e.target as HTMLDivElement).style.boxShadow = `0 4px 20px ${theme.accentColor}40`;
              }}
            >
              Continue
            </div>
          </div>

          <style>{`
            @keyframes trophy-bounce {
              0% { transform: scale(0) rotate(-15deg); }
              50% { transform: scale(1.2) rotate(5deg); }
              75% { transform: scale(0.95) rotate(-2deg); }
              100% { transform: scale(1) rotate(0deg); }
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
      {showConfetti && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 300, overflow: "hidden" }}>
          {confetti.map((piece) => {
            const rad = (piece.angle * Math.PI) / 180;
            const endX = Math.cos(rad) * piece.velocity;
            const endY = -Math.sin(rad) * piece.velocity + 200;
            return (
              <div
                key={piece.id}
                style={{
                  position: "absolute",
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  width: piece.size,
                  height: piece.size * 0.6,
                  background: piece.color,
                  borderRadius: piece.id % 3 === 0 ? "50%" : 2,
                  opacity: 1,
                  animation: `${theme.confettiPrefix}-${piece.id} 1.1s ease-out ${piece.delay}s forwards`,
                }}
              >
                <style>{`
                  @keyframes ${theme.confettiPrefix}-${piece.id} {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(${endX}px, ${endY}px) rotate(${piece.spin}deg); opacity: 0; }
                  }
                `}</style>
              </div>
            );
          })}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: theme.bgColor,
          borderRadius: 16,
          padding: "24px 32px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 200,
          border: `3px solid ${theme.borderColor}`,
          boxShadow: theme.boxShadow,
          width: 560,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: theme.accentColor }}>
            {theme.title}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative" }}>
            <div style={{ fontSize: 14, color: "#ffeb3b", fontWeight: 700 }}>
              Score: {score}
            </div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>
              {currentQ + 1} / {questions.length}
            </div>
            {scorePopups.map((popup) => (
              <div
                key={popup.id}
                style={{
                  position: "absolute",
                  right: 0,
                  top: -8,
                  fontSize: 14,
                  fontWeight: 800,
                  color: popup.color,
                  whiteSpace: "nowrap",
                  animation: "quiz-score-pop 1.5s ease-out forwards",
                  pointerEvents: "none",
                  textShadow: `0 0 8px ${popup.color}80`,
                }}
              >
                {popup.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#b0bec5" }}>
          {question.question}
        </div>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: 8,
            padding: "14px 18px",
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
            lineHeight: 1.7,
            marginBottom: 16,
            border: `1px solid ${theme.accentColor}33`,
            whiteSpace: "pre-wrap",
            color: "#e0e0e0",
          }}
        >
          {question.code}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {question.options.map((option, i) => {
            let bg = "rgba(255,255,255,0.05)";
            let border = "1px solid rgba(255,255,255,0.15)";
            let textColor = "white";

            if (answeredCorrectly && i === question.correctIndex) {
              bg = "rgba(76, 175, 80, 0.3)";
              border = "2px solid #66bb6a";
              textColor = "#66bb6a";
            } else if (selectedAnswer === i && !answeredCorrectly) {
              bg = "rgba(244, 67, 54, 0.3)";
              border = "2px solid #ef5350";
              textColor = "#ef5350";
            }

            return (
              <div
                key={i}
                onClick={() => handleAnswer(i)}
                style={{
                  padding: "10px 16px",
                  background: bg,
                  border,
                  borderRadius: 8,
                  cursor: answeredCorrectly ? "default" : "pointer",
                  fontSize: 14,
                  color: textColor,
                  fontWeight: (answeredCorrectly && i === question.correctIndex) || selectedAnswer === i ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {String.fromCharCode(65 + i)}) {option}
              </div>
            );
          })}
        </div>

        {answeredCorrectly && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(76, 175, 80, 0.15)",
              border: "1px solid #66bb6a",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#66bb6a", display: "flex", alignItems: "center", gap: 8 }}>
              <span>Correct! +10 pts</span>
              {!hadWrongAttempt && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#facc15",
                    background: "rgba(250, 204, 21, 0.15)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    border: "1px solid rgba(250, 204, 21, 0.3)",
                    animation: "first-try-glow 1s ease-in-out",
                  }}
                >
                  +5 First Try!
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
              {question.explanation}
            </div>
          </div>
        )}

        {!answeredCorrectly && wrongAttempt && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(244, 67, 54, 0.15)",
              border: "1px solid #ef5350",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#ef5350" }}>
              Not quite! Try again.
            </div>
            <div
              onClick={() => setShowHint(!showHint)}
              style={{
                fontSize: 13,
                color: theme.hintColor,
                cursor: "pointer",
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 10 }}>{showHint ? "\u25BC" : "\u25B6"}</span>
              {showHint ? "Hide Hint" : "Show Hint"}
            </div>
            {showHint && (
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginTop: 8, paddingLeft: 16, borderLeft: `2px solid ${theme.accentColor}66` }}>
                {question.hint}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            onClick={onClose}
            style={{
              padding: "8px 20px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              color: "white",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Exit
          </div>
          {answeredCorrectly && (
            <div
              onClick={handleNext}
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
              {isLastQuestion ? "View Results" : "Next Question"}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes quiz-score-pop {
          0% { opacity: 0; transform: translateY(0) scale(0.7); }
          15% { opacity: 1; transform: translateY(-12px) scale(1.1); }
          30% { transform: translateY(-18px) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.8); }
        }
        @keyframes first-try-glow {
          0% { box-shadow: 0 0 0 rgba(250, 204, 21, 0); }
          50% { box-shadow: 0 0 12px rgba(250, 204, 21, 0.4); }
          100% { box-shadow: 0 0 0 rgba(250, 204, 21, 0); }
        }
      `}</style>
    </>
  );
}
