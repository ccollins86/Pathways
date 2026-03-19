import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/lib/stores/useGame";

interface Question {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    code: `// Searching for the number 73 in range 1-100
// Using binary search:
let min = 1, max = 100;
let guess = Math.floor((min + max) / 2); // guess = ?`,
    question: "What is the first guess when using binary search on the range 1-100?",
    options: ["1", "25", "50", "100"],
    correctIndex: 2,
    explanation:
      "Binary search always starts with the middle of the range. Math.floor((1 + 100) / 2) = Math.floor(50.5) = 50. Starting in the middle eliminates half the possibilities with every guess!",
  },
  {
    id: 2,
    code: `// Binary search: target is GREATER than 50
// Before: min = 1, max = 100, guess = 50
// Update: min = guess + 1 = 51
// New guess = Math.floor((51 + 100) / 2) = ?`,
    question: "If the first guess of 50 is too LOW, what should the next guess be?",
    options: ["51", "75", "76", "100"],
    correctIndex: 1,
    explanation:
      "Since 50 was too low, the target must be between 51 and 100. The new guess is Math.floor((51 + 100) / 2) = Math.floor(75.5) = 75. We just eliminated half the remaining numbers!",
  },
  {
    id: 3,
    code: `// Binary search: target is LESS than 50
// Before: min = 1, max = 100, guess = 50
// Update: max = guess - 1 = 49
// New guess = Math.floor((1 + 49) / 2) = ?`,
    question: "If the first guess of 50 is too HIGH, what should the next guess be?",
    options: ["1", "24", "25", "49"],
    correctIndex: 2,
    explanation:
      "Since 50 was too high, the target must be between 1 and 49. The new guess is Math.floor((1 + 49) / 2) = Math.floor(25) = 25. Again, we cut the search space in half!",
  },
  {
    id: 4,
    code: `// Worst case scenarios for finding a number 1-100:
// Random search: up to ??? guesses
// Linear search: up to ??? guesses
// Binary search: up to ??? guesses`,
    question: "In the WORST case, how many guesses does binary search need to find a number between 1 and 100?",
    options: ["7", "10", "50", "100"],
    correctIndex: 0,
    explanation:
      "Binary search cuts the range in half each time: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1. That's only 7 steps! This is called O(log n) — logarithmic time. Compare that to linear search which could take up to 100 guesses!",
  },
  {
    id: 5,
    code: `function binarySearch(arr, target) {
  let min = 0, max = arr.length - 1;
  while (min <= max) {
    let mid = Math.floor((min + max) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) min = mid + 1;
    else max = mid - 1;
  }
  return -1; // not found
}`,
    question: "What does binary search return if the target is NOT in the array?",
    options: ["0", "null", "-1", "undefined"],
    correctIndex: 2,
    explanation:
      "When min exceeds max, the while loop ends and the function returns -1, which is the conventional way to indicate 'not found' in search algorithms. The loop condition (min <= max) guarantees we stop when there's nothing left to search.",
  },
  {
    id: 6,
    code: `// Searching a sorted list of 1,000,000 names
// Linear search: check one by one from the start
// Binary search: divide in half each time

// Linear: worst case = 1,000,000 checks
// Binary: worst case = ??? checks`,
    question: "How many guesses would binary search need at MOST to search through 1,000,000 sorted items?",
    options: ["100", "1,000", "20", "500,000"],
    correctIndex: 2,
    explanation:
      "Binary search needs at most log₂(1,000,000) ≈ 20 guesses! Each guess halves the search space: 1M → 500K → 250K → ... → 1. That's the power of logarithmic time — even a million items only needs about 20 steps!",
  },
  {
    id: 7,
    code: `let numbers = [3, 7, 11, 15, 22, 34, 50, 68, 91];
// Can we use binary search on this array?

let words = ["banana", "grape", "apple", "cherry"];
// Can we use binary search on this array?`,
    question: "Binary search requires one important condition. Which array can we use it on?",
    options: [
      "Both arrays",
      "Only the numbers array (it's sorted)",
      "Only the words array (it has strings)",
      "Neither array",
    ],
    correctIndex: 1,
    explanation:
      "Binary search only works on SORTED data! The numbers array [3, 7, 11, 15, 22, 34, 50, 68, 91] is in order, so binary search works. The words array is NOT sorted alphabetically (apple should come before banana), so binary search would give wrong results.",
  },
  {
    id: 8,
    code: `// Binary search steps to find 73:
// Step 1: guess 50 → "Greater" → min=51, max=100
// Step 2: guess 75 → "Less"    → min=51, max=74
// Step 3: guess 62 → "Greater" → min=63, max=74
// Step 4: guess 68 → "Greater" → min=69, max=74
// Step 5: guess 71 → "Greater" → min=72, max=74
// Step 6: guess 73 → "Correct!"`,
    question: "How many guesses did binary search need to find 73 out of 100 numbers?",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    explanation:
      "It took exactly 6 guesses to find 73. Each guess narrowed the range: 100 → 50 → 24 → 12 → 6 → 3 → found! That's way better than random guessing (could take up to 100) or linear search (would take 73 if starting from 1).",
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

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [animating, setAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const question = QUESTIONS[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;
  const isLastQuestion = currentQuestion >= QUESTIONS.length - 1;

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
          Question {currentQuestion + 1}/{QUESTIONS.length} | Score: {psychicPracticeScore}
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
