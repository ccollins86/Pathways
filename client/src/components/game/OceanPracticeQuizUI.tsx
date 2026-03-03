import { useState, useEffect, useRef, useCallback } from "react";
import { useGame, type Question } from "@/lib/stores/useGame";

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 1,
    code: `let fruits = ["apple", "banana", "cherry"];

for (let fruit of fruits) {
  console.log(fruit);
}`,
    question: "How many times does console.log run?",
    options: ["1 time", "2 times", "3 times", "It runs forever"],
    correctIndex: 2,
    explanation: "The for...of loop runs once for each item in the array. Since there are 3 fruits, console.log runs exactly 3 times — once for each fruit.",
  },
  {
    id: 2,
    code: `let ecosystems = ["Coral Reef", "Kelp Forest", "Tide Pool"];
let count = 0;

for (let eco of ecosystems) {
  count = count + 1;
}`,
    question: "What is the value of count after the loop?",
    options: ["0", "1", "3", "It depends on the ecosystem"],
    correctIndex: 2,
    explanation: "The loop runs once for each of the 3 ecosystems in the array. Each time, count increases by 1. So count goes from 0 → 1 → 2 → 3.",
  },
  {
    id: 3,
    code: `let water = 10;

while (water > 3) {
  water = water - 2;
}`,
    question: "What is the value of water after the loop?",
    options: ["1", "2", "3", "0"],
    correctIndex: 1,
    explanation: "The loop runs while water > 3. It goes: 10→8→6→4→2. When water is 2, the condition (2 > 3) is false, so the loop stops. Water is 2.",
  },
  {
    id: 4,
    code: `let sludgePatches = 5;

while (sludgePatches > 0) {
  vacuumSludge();
  sludgePatches = sludgePatches - 1;
}`,
    question: "How many times does vacuumSludge() get called?",
    options: ["4 times", "5 times", "6 times", "It runs forever"],
    correctIndex: 1,
    explanation: "The loop starts with 5 patches and subtracts 1 each time. It runs for values 5, 4, 3, 2, 1 — that's 5 iterations. When patches reaches 0, the condition is false and the loop stops.",
  },
  {
    id: 5,
    code: `let animals = ["fish", "turtle", "crab", "seahorse"];
let total = 0;

for (let animal of animals) {
  total = total + 1;
}`,
    question: "What does total equal after the loop finishes?",
    options: ["0", "1", "4", "It never stops"],
    correctIndex: 2,
    explanation: "The for loop iterates over all 4 animals in the array. Each iteration adds 1 to total, so total ends up as 4 — one for each animal, just like counting animals at each ecosystem!",
  },
  {
    id: 6,
    code: `let dirty = true;
let scrubs = 0;

while (dirty) {
  scrubs = scrubs + 1;
  if (scrubs >= 3) {
    dirty = false;
  }
}`,
    question: "How many times does the while loop run?",
    options: ["0 times", "2 times", "3 times", "It runs forever"],
    correctIndex: 2,
    explanation: "The loop runs while dirty is true. After 3 scrubs, dirty becomes false and the loop stops. It runs exactly 3 times — just like cleaning until a condition changes!",
  },
  {
    id: 7,
    code: `let zones = ["reef", "kelp", "pool"];

for (let zone of zones) {
  survey(zone);
  report(zone);
}`,
    question: "How many total function calls are made?",
    options: ["3 (one per zone)", "6 (two per zone)", "2 (survey and report)", "9"],
    correctIndex: 1,
    explanation: "The loop runs 3 times (once per zone). Each iteration calls 2 functions: survey() and report(). So 3 × 2 = 6 total function calls. This is like doing multiple tasks at each ecosystem!",
  },
  {
    id: 8,
    code: `// Which loop should you use?
// Task: Process each student in a class roster

// Option A:
for (let student of roster) {
  gradeExam(student);
}

// Option B:
while (roster.length > 0) {
  gradeExam(roster.pop());
}`,
    question: "Which loop type is the best choice for this task?",
    options: [
      "For loop — you know exactly how many students",
      "While loop — you don't know when to stop",
      "Both are equally good choices",
      "Neither — you don't need a loop",
    ],
    correctIndex: 0,
    explanation: "A for loop is ideal here because you have a known collection (the roster) and want to do something for each item. While loops are better when you're waiting for a condition to change, like cleaning sludge until none remains.",
  },
];

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

const CONFETTI_COLORS = ["#4fc3f7", "#69f0ae", "#ffeb3b", "#ff9800", "#e040fb", "#ff6b6b", "#ffd93d", "#6bcb77"];

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

export function OceanPracticeQuizUI() {
  const closeOceanPractice = useGame((s) => s.closeOceanPractice);
  const addOceanPracticeScore = useGame((s) => s.addOceanPracticeScore);
  const oceanPracticeScore = useGame((s) => s.oceanPracticeScore);
  const completeOceanPractice = useGame((s) => s.completeOceanPractice);
  const oceanQuestions = useGame((s) => s.oceanQuestions);
  const oceanQuestionsLoading = useGame((s) => s.oceanQuestionsLoading);

  const QUESTIONS = oceanQuestions || FALLBACK_QUESTIONS;

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredCorrectly(false);
    useGame.getState().resetOceanPracticeScore();
    successSoundRef.current = new Audio("/sounds/success.mp3");
    successSoundRef.current.volume = 0.5;
  }, []);

  const triggerCelebration = useCallback(() => {
    if (successSoundRef.current) {
      successSoundRef.current.currentTime = 0;
      successSoundRef.current.play().catch(() => {});
    }
    setConfetti(createConfetti());
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1200);
  }, []);

  if (oceanQuestionsLoading && !oceanQuestions) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 20, 50, 0.97)",
          borderRadius: 16,
          padding: "32px 40px",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          zIndex: 200,
          border: "3px solid #69f0ae",
          boxShadow: "0 0 40px rgba(105, 240, 174, 0.4)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "#69f0ae", marginBottom: 12 }}>
          Generating Questions...
        </div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>
          The AI is creating fresh practice questions for you!
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQ];
  const isLastQuestion = currentQ >= QUESTIONS.length - 1;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const correct = index === question.correctIndex;
    setAnsweredCorrectly(correct);
    if (correct) {
      addOceanPracticeScore(10);
      triggerCelebration();
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completeOceanPractice();
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredCorrectly(false);
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
                animation: `ocean-confetti-${piece.id} 1.1s ease-out ${piece.delay}s forwards`,
              }}
            >
              <style>{`
                @keyframes ocean-confetti-${piece.id} {
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
        background: "rgba(0, 20, 50, 0.97)",
        borderRadius: 16,
        padding: "24px 32px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #69f0ae",
        boxShadow: "0 0 40px rgba(105, 240, 174, 0.4)",
        width: 560,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#69f0ae" }}>
          Ocean Practice Station
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 14, color: "#ffeb3b", fontWeight: 700 }}>
            Score: {oceanPracticeScore}
          </div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>
            {currentQ + 1} / {QUESTIONS.length}
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
          border: "1px solid rgba(105, 240, 174, 0.2)",
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

          if (showResult) {
            if (i === question.correctIndex) {
              bg = "rgba(76, 175, 80, 0.3)";
              border = "2px solid #66bb6a";
              textColor = "#66bb6a";
            } else if (i === selectedAnswer && i !== question.correctIndex) {
              bg = "rgba(244, 67, 54, 0.3)";
              border = "2px solid #ef5350";
              textColor = "#ef5350";
            }
          } else if (selectedAnswer === i) {
            bg = "rgba(105, 240, 174, 0.2)";
            border = "2px solid #69f0ae";
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
                cursor: showResult ? "default" : "pointer",
                fontSize: 14,
                color: textColor,
                fontWeight: selectedAnswer === i ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {String.fromCharCode(65 + i)}) {option}
            </div>
          );
        })}
      </div>

      {showResult && (
        <div
          style={{
            padding: "12px 16px",
            background: answeredCorrectly ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
            border: `1px solid ${answeredCorrectly ? "#66bb6a" : "#ef5350"}`,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: answeredCorrectly ? "#66bb6a" : "#ef5350" }}>
            {answeredCorrectly ? "Correct! +10 points" : "Not quite!"}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
            {question.explanation}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          onClick={closeOceanPractice}
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
        {showResult && (
          <div
            onClick={handleNext}
            style={{
              padding: "10px 24px",
              background: "#69f0ae",
              border: "none",
              borderRadius: 8,
              color: "#1b5e20",
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
