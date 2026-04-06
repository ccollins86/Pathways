import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useQuestionPrefetch } from "@/lib/stores/useQuestionPrefetch";
import { PSYCHIC_QUESTIONS } from "./psychicQuestions";

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

const CONFETTI_COLORS = ["#9b59b6", "#69f0ae", "#e0b0ff", "#ffd700", "#4fc3f7", "#ff6b6b", "#ffeb3b", "#6a0dad"];

function createConfetti(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < 40; i++) {
    pieces.push({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 4 + Math.random() * 6,
      angle: Math.random() * 360,
      velocity: 80 + Math.random() * 120,
      spin: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.15,
    });
  }
  return pieces;
}

export function PsychicPracticeQuizUI() {
  const addPsychicPracticeScore = useGame((s) => s.addPsychicPracticeScore);
  const completePsychicPractice = useGame((s) => s.completePsychicPractice);
  const psychicPracticeScore = useGame((s) => s.psychicPracticeScore);

  const questions = useQuestionPrefetch((s) => s.getQuestions("psychic", PSYCHIC_QUESTIONS));

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [animating, setAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;
  const isLastQuestion = currentQuestion >= questions.length - 1;

  useEffect(() => {
    try {
      audioRef.current = new Audio("/sounds/success.mp3");
      audioRef.current.volume = 0.3;
    } catch {}
  }, []);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null || animating) return;
      setSelectedAnswer(index);
      setShowExplanation(true);

      if (index === question.correctIndex) {
        addPsychicPracticeScore(10);
        setConfetti(createConfetti());
        try {
          audioRef.current?.play();
        } catch {}
        setAnimating(true);
        setTimeout(() => {
          setAnimating(false);
          setConfetti([]);
        }, 1500);
      }
    },
    [selectedAnswer, animating, question.correctIndex, addPsychicPracticeScore]
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      completePsychicPractice();
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [isLastQuestion, completePsychicPractice]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(26, 10, 46, 0.97)",
        borderRadius: 16,
        padding: "24px 32px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #9b59b6",
        boxShadow: "0 0 40px rgba(155, 89, 182, 0.4)",
        maxWidth: 640,
        maxHeight: "88vh",
        overflowY: "auto",
        width: "92%",
      }}
    >
      {confetti.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: "absolute",
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.size > 7 ? "50%" : 2,
            animation: `confetti-fall 1.5s ease-out ${piece.delay}s forwards`,
            transform: `rotate(${piece.angle}deg)`,
            pointerEvents: "none",
            zIndex: 300,
          }}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#e0b0ff" }}>
          Binary Search Practice
        </div>
        <div style={{ fontSize: 13, color: "#9b59b6", fontWeight: 700 }}>
          Question {currentQuestion + 1}/{questions.length} | Score: {psychicPracticeScore}
        </div>
      </div>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: 8,
          padding: "14px 18px",
          fontFamily: "'Courier New', monospace",
          fontSize: 13,
          lineHeight: 1.7,
          marginBottom: 14,
          border: "1px solid rgba(155, 89, 182, 0.3)",
          whiteSpace: "pre-wrap",
          color: "#e0b0ff",
        }}
      >
        {question.code}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "white" }}>
        {question.question}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {question.options.map((option, i) => {
          let bg = "rgba(155, 89, 182, 0.1)";
          let border = "1px solid rgba(155, 89, 182, 0.3)";
          let color = "white";

          if (selectedAnswer !== null) {
            if (i === question.correctIndex) {
              bg = "rgba(105, 240, 174, 0.2)";
              border = "2px solid #69f0ae";
              color = "#69f0ae";
            } else if (i === selectedAnswer && !isCorrect) {
              bg = "rgba(255, 107, 107, 0.2)";
              border = "2px solid #ff6b6b";
              color = "#ff6b6b";
            }
          }

          return (
            <div
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: bg,
                border,
                color,
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedAnswer === null ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              {option}
            </div>
          );
        })}
      </div>

      {showExplanation && (
        <div
          style={{
            background: isCorrect ? "rgba(105, 240, 174, 0.1)" : "rgba(255, 107, 107, 0.1)",
            border: `1px solid ${isCorrect ? "rgba(105, 240, 174, 0.4)" : "rgba(255, 107, 107, 0.4)"}`,
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 14,
            fontSize: 13,
            lineHeight: 1.6,
            color: isCorrect ? "#a5d6a7" : "#ef9a9a",
          }}
        >
          <strong>{isCorrect ? "Correct!" : "Not quite."}</strong> {question.explanation}
        </div>
      )}

      {showExplanation && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={handleNext}
            style={{
              padding: "10px 28px",
              background: "linear-gradient(135deg, #9b59b6, #6a0dad)",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </div>
        </div>
      )}
    </div>
  );
}
