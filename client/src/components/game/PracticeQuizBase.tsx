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
  onClose: () => void;
  onAddScore: (points: number) => void;
  onResetScore?: () => void;
  onComplete: () => void;
  closeOnComplete?: boolean;
  onMarkServed?: (index: number) => void;
}

export function PracticeQuizBase({
  questions,
  theme,
  score,
  onClose,
  onAddScore,
  onResetScore,
  onComplete,
  closeOnComplete = false,
  onMarkServed,
}: PracticeQuizBaseProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnsweredCorrectly(false);
    setWrongAttempt(false);
    setShowHint(false);
    onResetScore?.();
    onMarkServed?.(0);
    try {
      successSoundRef.current = new Audio("/sounds/success.mp3");
      successSoundRef.current.volume = 0.5;
    } catch {}
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
      triggerCelebration();
    } else {
      setWrongAttempt(true);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 800);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
      if (closeOnComplete) onClose();
      return;
    }
    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    onMarkServed?.(nextQ);
    setSelectedAnswer(null);
    setAnsweredCorrectly(false);
    setWrongAttempt(false);
    setShowHint(false);
  };

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
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ fontSize: 14, color: "#ffeb3b", fontWeight: 700 }}>
              Score: {score}
            </div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>
              {currentQ + 1} / {questions.length}
            </div>
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
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#66bb6a" }}>
              Correct! +10 points
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
              {isLastQuestion ? "Finish" : "Next Question"}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
