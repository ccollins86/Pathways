import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/lib/stores/useGame";

interface Question {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    code: `let weather = "rainy";

if (weather === "sunny") {
  goToBeach();
} else if (weather === "rainy") {
  bringUmbrella();
} else {
  stayHome();
}`,
    question: "Which function gets called?",
    options: ["goToBeach()", "bringUmbrella()", "stayHome()", "All three"],
    correctIndex: 1,
    explanation: 'Since weather is "rainy", the else-if condition is true, so bringUmbrella() runs. The other branches are skipped.',
    hint: "Look at the value of weather and check which condition matches it exactly.",
  },
  {
    id: 2,
    code: `let temperature = 95;

if (temperature > 100) {
  alert("Extreme heat!");
} else if (temperature > 80) {
  alert("It's hot!");
} else {
  alert("Nice weather!");
}`,
    question: "What alert message appears?",
    options: ['"Extreme heat!"', '"It\'s hot!"', '"Nice weather!"', "No alert appears"],
    correctIndex: 1,
    explanation: "95 is not greater than 100, so the first condition is false. But 95 is greater than 80, so the else-if runs and shows \"It's hot!\"",
    hint: "Check each condition from top to bottom. Is 95 greater than 100? If not, move to the next condition.",
  },
  {
    id: 3,
    code: `let score = 45;

if (score >= 90) {
  grade = "A";
} else if (score >= 70) {
  grade = "B";
} else if (score >= 50) {
  grade = "C";
} else {
  grade = "F";
}`,
    question: "What grade is assigned?",
    options: ["A", "B", "C", "F"],
    correctIndex: 3,
    explanation: "Score is 45. It's not >= 90, not >= 70, and not >= 50. None of the if/else-if conditions are true, so the else block runs and grade becomes \"F\".",
    hint: "Test whether 45 passes any of the three conditions. What happens when none of them are true?",
  },
  {
    id: 4,
    code: `let animal = "cat";

if (animal === "dog") {
  sound = "Woof!";
} else if (animal === "cat") {
  sound = "Meow!";
} else if (animal === "bird") {
  sound = "Tweet!";
}`,
    question: "What is the value of sound?",
    options: ['"Woof!"', '"Meow!"', '"Tweet!"', '"Woof!" and "Meow!"'],
    correctIndex: 1,
    explanation: 'The variable animal is "cat", which matches the second condition. Only "Meow!" is assigned — the computer stops checking after finding the first true condition.',
    hint: 'Remember: the computer checks conditions one at a time and stops at the first match. Which condition does "cat" match?',
  },
  {
    id: 5,
    code: `let hour = 14;

if (hour < 12) {
  greeting = "Good morning!";
} else if (hour < 17) {
  greeting = "Good afternoon!";
} else {
  greeting = "Good evening!";
}`,
    question: "What greeting is set?",
    options: ['"Good morning!"', '"Good afternoon!"', '"Good evening!"', "None of them"],
    correctIndex: 1,
    explanation: "Hour is 14. It's not less than 12, so the first condition is false. But 14 is less than 17, so the else-if runs and greeting becomes \"Good afternoon!\"",
    hint: "Is 14 less than 12? If not, check the next condition: is 14 less than 17?",
  },
  {
    id: 6,
    code: `let fruit = "apple";

if (fruit === "banana") {
  color = "yellow";
} else if (fruit === "apple") {
  color = "red";
} else if (fruit === "apple") {
  color = "green";
}`,
    question: 'There are two conditions checking for "apple". What is color?',
    options: ['"yellow"', '"red"', '"green"', '"red" and "green"'],
    correctIndex: 1,
    explanation: 'Even though both else-if conditions check for "apple", only the FIRST matching branch executes. Once "red" is assigned, the rest are skipped entirely.',
    hint: "When multiple conditions could be true, think about which one the computer reaches first. Does it keep going after finding a match?",
  },
  {
    id: 7,
    code: `let age = 25;

if (age < 13) {
  category = "child";
} else if (age < 20) {
  category = "teenager";
} else if (age < 65) {
  category = "adult";
} else {
  category = "senior";
}`,
    question: "What category is assigned?",
    options: ['"child"', '"teenager"', '"adult"', '"senior"'],
    correctIndex: 2,
    explanation: "Age is 25. Not less than 13, not less than 20, but IS less than 65. So the third condition is the first true one, and category becomes \"adult\".",
    hint: "Check each condition with the value 25. Which is the first one that evaluates to true?",
  },
  {
    id: 8,
    code: `let day = "Saturday";

if (day === "Monday") {
  plan = "Work";
} else if (day === "Saturday" || day === "Sunday") {
  plan = "Relax";
} else {
  plan = "Work";
}`,
    question: "What is plan set to?",
    options: ['"Work" (from the if)', '"Relax"', '"Work" (from the else)', "Nothing"],
    correctIndex: 1,
    explanation: '"Saturday" doesn\'t match "Monday", but the else-if checks if day is "Saturday" OR "Sunday". Since it\'s "Saturday", the condition is true and plan becomes "Relax".',
    hint: 'Pay attention to the || (OR) operator. Does "Saturday" satisfy either side of that condition?',
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

const CONFETTI_COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fff", "#4fc3f7", "#ffeb3b", "#ff9800"];

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

export function PracticeQuizUI() {
  const closePractice = useGame((s) => s.closePractice);
  const addPracticeScore = useGame((s) => s.addPracticeScore);
  const practiceScore = useGame((s) => s.practiceScore);
  const completePractice = useGame((s) => s.completePractice);

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
    useGame.getState().resetPracticeScore();
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

  const question = QUESTIONS[currentQ];
  const isLastQuestion = currentQ >= QUESTIONS.length - 1;

  const handleAnswer = (index: number) => {
    if (answeredCorrectly) return;
    setSelectedAnswer(index);
    const correct = index === question.correctIndex;
    if (correct) {
      setAnsweredCorrectly(true);
      addPracticeScore(10);
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
      completePractice();
      closePractice();
      return;
    }
    setCurrentQ((q) => q + 1);
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
                animation: `confetti-fly-${piece.id} 1.1s ease-out ${piece.delay}s forwards`,
              }}
            >
              <style>{`
                @keyframes confetti-fly-${piece.id} {
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
        background: "rgba(13, 25, 48, 0.97)",
        borderRadius: 16,
        padding: "24px 32px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #4fc3f7",
        boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
        width: 560,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#4fc3f7" }}>
          Practice Station
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 14, color: "#ffeb3b", fontWeight: 700 }}>
            Score: {practiceScore}
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
          border: "1px solid rgba(79, 195, 247, 0.2)",
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
              color: "#4fc3f7",
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
            <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginTop: 8, paddingLeft: 16, borderLeft: "2px solid rgba(79, 195, 247, 0.4)" }}>
              {question.hint}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          onClick={closePractice}
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
              background: "#4fc3f7",
              border: "none",
              borderRadius: 8,
              color: "#0d47a1",
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
