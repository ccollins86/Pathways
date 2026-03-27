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
    code: `function makeHat(size, topColor, brimColor, lettering) {
  // assemble the hat with specified parts
  return finishedHat;
}

let myHat = makeHat("large", "white", "green", "Italy");`,
    question: "What are the PARAMETERS of the makeHat function?",
    options: [
      '"large", "white", "green", "Italy"',
      "size, topColor, brimColor, lettering",
      "finishedHat",
      "myHat",
    ],
    correctIndex: 1,
    explanation:
      'Parameters are the variable names listed in the function definition (size, topColor, brimColor, lettering). The actual values like "large" and "white" are called arguments \u2014 those are the specific inputs you pass in when you call the function.',
  },
  {
    id: 2,
    code: `function makeTshirt(quantity, size, sleeveColor, bodyColor) {
  let shirts = [];
  for (let i = 0; i < quantity; i++) {
    shirts.push(assembleShirt(size, sleeveColor, bodyColor));
  }
  return shirts;
}

let order = makeTshirt(3, "medium", "red", "blue");`,
    question: "How many shirts will be in the 'order' array?",
    options: ["1", "2", "3", "It depends"],
    correctIndex: 2,
    explanation:
      'The function creates a shirt for each iteration of the loop. Since quantity is 3, the loop runs 3 times, pushing 3 shirts into the array. The function returns exactly what you asked for \u2014 3 medium shirts!',
  },
  {
    id: 3,
    code: `function calculateCost(itemType, quantity) {
  let pricePerItem;
  if (itemType === "hat") {
    pricePerItem = 15;
  } else if (itemType === "tshirt") {
    pricePerItem = 25;
  } else if (itemType === "jacket") {
    pricePerItem = 50;
  }
  return pricePerItem * quantity;
}`,
    question: 'What does calculateCost("jacket", 5) return?',
    options: ["15", "25", "50", "250"],
    correctIndex: 3,
    explanation:
      'Since itemType is "jacket", pricePerItem is set to 50. Then the function returns 50 \u00d7 5 = 250. Functions can use if/else inside them too \u2014 combining the concepts you learned earlier!',
  },
  {
    id: 4,
    code: `function makeJacket(sleeveColor, bodyColor, letteringColor, text) {
  let jacket = createBlankJacket();
  colorSleeves(jacket, sleeveColor);
  colorBody(jacket, bodyColor);
  addLettering(jacket, text, letteringColor);
  return jacket;
}`,
    question: "What does this function RETURN?",
    options: [
      "The sleeve color",
      "A finished jacket with all customizations applied",
      "Nothing \u2014 it has no return statement",
      "The text for the lettering",
    ],
    correctIndex: 1,
    explanation:
      "The function creates a blank jacket, then applies customizations step by step (coloring sleeves, body, adding lettering), and returns the finished product. This is like how the jacket machine takes your inputs and outputs a completed jacket!",
  },
  {
    id: 5,
    code: `function fulfillOrder(hatOrder, shirtOrder, jacketOrder) {
  let hats = makeHat(hatOrder);
  let shirts = makeTshirt(shirtOrder);
  let jackets = makeJacket(jacketOrder);
  
  let box = packItems(hats, shirts, jackets);
  return box;
}`,
    question: "How many other functions does fulfillOrder call?",
    options: ["1", "3", "4", "5"],
    correctIndex: 2,
    explanation:
      "fulfillOrder calls 4 functions: makeHat(), makeTshirt(), makeJacket(), and packItems(). Functions can call other functions! This is like how the full order process involves using multiple machines and then packing everything together.",
  },
  {
    id: 6,
    code: `function greet(name) {
  return "Hello, " + name + "!";
}

let message1 = greet("Italy");
let message2 = greet("USA");
let message3 = greet("Germany");`,
    question: "What is the value of message2?",
    options: ['"Hello, Italy!"', '"Hello, USA!"', '"Hello, Germany!"', '"Hello, name!"'],
    correctIndex: 1,
    explanation:
      'When greet("USA") is called, the parameter name gets the value "USA". The function returns "Hello, " + "USA" + "!" which is "Hello, USA!". Same function, different input, different output \u2014 just like the same machine producing different products based on your settings!',
  },
  {
    id: 7,
    code: `function processOrder(type, qty) {
  if (qty <= 0) {
    return "Invalid order!";
  }
  
  let items = produce(type, qty);
  let box = pack(items);
  ship(box);
  return "Order shipped!";
}`,
    question: 'What happens if you call processOrder("hat", 0)?',
    options: [
      'It returns "Order shipped!"',
      "It produces 0 hats and ships an empty box",
      'It returns "Invalid order!" without producing anything',
      "It crashes with an error",
    ],
    correctIndex: 2,
    explanation:
      'Since qty is 0, the condition (qty <= 0) is true, so the function returns "Invalid order!" immediately. The return statement exits the function right away \u2014 produce, pack, and ship never run. This is called an early return, and it\'s useful for input validation!',
  },
  {
    id: 8,
    code: `// Which is a correct function call?

// Function definition:
function makeHat(quantity, size, topColor, brimColor, lettering) {
  // ... makes hats ...
  return hats;
}`,
    question: "Which call correctly orders 2 large hats with white top, green brim, labeled 'Italy'?",
    options: [
      'makeHat(2, "large", "white", "green", "Italy")',
      'makeHat("large", 2, "white", "green", "Italy")',
      'makeHat(2, "large", "green", "white", "Italy")',
      'makeHat("Italy", "white", "green", "large", 2)',
    ],
    correctIndex: 0,
    explanation:
      "The order of arguments must match the order of parameters in the function definition: quantity first (2), then size (\"large\"), then topColor (\"white\"), brimColor (\"green\"), and lettering (\"Italy\"). Getting the order wrong is a common bug \u2014 just like entering the wrong settings on a machine!",
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

const CONFETTI_COLORS = ["#ff9800", "#4caf50", "#f44336", "#2196f3", "#e040fb", "#ffeb3b", "#69f0ae", "#ff6b6b"];

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

interface ScorePopup {
  id: number;
  text: string;
  color: string;
}

export function FactoryPracticeQuizUI() {
  const closeFactoryPractice = useGame((s) => s.closeFactoryPractice);
  const addFactoryPracticeScore = useGame((s) => s.addFactoryPracticeScore);
  const completeFactoryPractice = useGame((s) => s.completeFactoryPractice);
  const factoryPracticeScore = useGame((s) => s.factoryPracticeScore);
  const totalScore = useGame((s) => s.totalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [animating, setAnimating] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [firstTryCountLocal, setFirstTryCountLocal] = useState(0);
  const [summaryPhase, setSummaryPhase] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const popupIdRef = useRef(0);

  const question = QUESTIONS[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;
  const isLastQuestion = currentQuestion >= QUESTIONS.length - 1;

  useEffect(() => {
    try {
      audioRef.current = new Audio("/sounds/success.mp3");
      audioRef.current.volume = 0.3;
    } catch {}
  }, []);

  const addPopup = useCallback((text: string, color: string) => {
    popupIdRef.current += 1;
    const id = popupIdRef.current;
    setScorePopups((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== id));
    }, 1500);
  }, []);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null || animating) return;
      setSelectedAnswer(index);
      setShowExplanation(true);

      if (index === question.correctIndex) {
        addFactoryPracticeScore(10);
        addPopup("+10", "#4ade80");
        setConfetti(createConfetti());
        try {
          audioRef.current?.play();
        } catch {}
        setAnimating(true);
        setTimeout(() => {
          setAnimating(false);
          setConfetti([]);
        }, 1500);
        if (!hadWrongAttempt) {
          incrementFirstTry();
          setFirstTryCountLocal((c) => c + 1);
          setTimeout(() => addPopup("+5 First Try!", "#facc15"), 300);
        }
      } else {
        setHadWrongAttempt(true);
      }
    },
    [selectedAnswer, animating, question.correctIndex, addFactoryPracticeScore, hadWrongAttempt, incrementFirstTry, addPopup]
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setShowSummary(true);
      setSummaryPhase(0);
      setTimeout(() => setSummaryPhase(1), 400);
      setTimeout(() => setSummaryPhase(2), 900);
      setTimeout(() => setSummaryPhase(3), 1400);
      setTimeout(() => setSummaryPhase(4), 1900);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setHadWrongAttempt(false);
    }
  }, [isLastQuestion]);

  const handleFinishSummary = () => {
    completeFactoryPractice();
  };

  const firstTryBonusTotal = firstTryCountLocal * 5;
  const worldBonus = 50;
  const accentColor = "#ff9800";

  if (showSummary) {
    return (
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
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 60px ${accentColor}40, 0 20px 60px rgba(0,0,0,0.5)`,
          width: 480,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 4,
            opacity: summaryPhase >= 0 ? 1 : 0,
            transform: summaryPhase >= 0 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.5s ease-out",
          }}
        >
          Factory Practice Complete!
        </div>

        <div
          style={{
            fontSize: 48,
            marginBottom: 24,
            opacity: summaryPhase >= 0 ? 1 : 0,
            animation: summaryPhase >= 0 ? "factory-trophy-bounce 0.6s ease-out" : "none",
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4ade80" opacity="0.2"/><path d="M9 12l2 2 4-4" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Correct Answers</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>+{factoryPracticeScore}</span>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={firstTryCountLocal > 0 ? "#facc15" : "#475569"} opacity={firstTryCountLocal > 0 ? 1 : 0.5}/></svg>
              <span style={{ fontSize: 14, fontWeight: 500 }}>First-Try Bonus ({firstTryCountLocal}/{QUESTIONS.length})</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: firstTryCountLocal > 0 ? "#facc15" : "#475569" }}>+{firstTryBonusTotal}</span>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#a855f7" opacity="0.9"/></svg>
              <span style={{ fontSize: 14, fontWeight: 500 }}>World Completion</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#a855f7" }}>+{worldBonus}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
              borderRadius: 10,
              border: `1px solid ${accentColor}40`,
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
                color: accentColor,
                textShadow: summaryPhase >= 4 ? `0 0 12px ${accentColor}60` : "none",
              }}
            >
              +{factoryPracticeScore + firstTryBonusTotal + worldBonus}
            </span>
          </div>
        </div>

        <div style={{ opacity: summaryPhase >= 4 ? 1 : 0, transition: "opacity 0.5s ease-out 0.3s" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
            Total Score: {totalScore}
          </div>
          <div
            onClick={handleFinishSummary}
            style={{
              display: "inline-block",
              padding: "12px 40px",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              border: "none",
              borderRadius: 10,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 20px ${accentColor}40`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLDivElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLDivElement).style.transform = "scale(1)";
            }}
          >
            Continue
          </div>
        </div>

        <style>{`
          @keyframes factory-trophy-bounce {
            0% { transform: scale(0) rotate(-15deg); }
            50% { transform: scale(1.2) rotate(5deg); }
            75% { transform: scale(0.95) rotate(-2deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(30, 20, 5, 0.97)",
        borderRadius: 16,
        padding: "24px 32px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        zIndex: 200,
        border: "3px solid #ff9800",
        boxShadow: "0 0 40px rgba(255, 152, 0, 0.4)",
        maxWidth: 640,
        width: "90vw",
        maxHeight: "85vh",
        overflowY: "auto",
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
            transform: `rotate(${piece.angle}deg)`,
            animation: `confetti-fall 1.2s ease-out ${piece.delay}s forwards`,
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(${200 + Math.random() * 100}px) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
        }
        @keyframes factory-score-pop {
          0% { opacity: 0; transform: translateY(0) scale(0.7); }
          15% { opacity: 1; transform: translateY(-12px) scale(1.1); }
          30% { transform: translateY(-18px) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.8); }
        }
        @keyframes factory-first-try-glow {
          0% { box-shadow: 0 0 0 rgba(250, 204, 21, 0); }
          50% { box-shadow: 0 0 12px rgba(250, 204, 21, 0.4); }
          100% { box-shadow: 0 0 0 rgba(250, 204, 21, 0); }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#ff9800" }}>
          Functions Practice
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
          <div style={{ fontSize: 13, color: "#b0bec5" }}>
            Question {currentQuestion + 1}/{QUESTIONS.length}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#ffeb3b" }}>
            Score: {factoryPracticeScore}
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
                animation: "factory-score-pop 1.5s ease-out forwards",
                pointerEvents: "none",
                textShadow: `0 0 8px ${popup.color}80`,
              }}
            >
              {popup.text}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: 8,
          padding: "14px 18px",
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          marginBottom: 16,
          border: "1px solid rgba(255, 152, 0, 0.3)",
          whiteSpace: "pre-wrap",
          color: "#e0e0e0",
        }}
      >
        {question.code}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{question.question}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {question.options.map((option, i) => {
          let bg = "rgba(255,255,255,0.05)";
          let borderColor = "rgba(255,152,0,0.2)";
          if (selectedAnswer !== null) {
            if (i === question.correctIndex) {
              bg = "rgba(76, 175, 80, 0.2)";
              borderColor = "#4caf50";
            } else if (i === selectedAnswer && !isCorrect) {
              bg = "rgba(244, 67, 54, 0.2)";
              borderColor = "#f44336";
            }
          }

          return (
            <div
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                padding: "10px 16px",
                background: bg,
                border: `2px solid ${borderColor}`,
                borderRadius: 8,
                cursor: selectedAnswer === null ? "pointer" : "default",
                fontSize: 13,
                fontFamily: "'Courier New', monospace",
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
            padding: "12px 16px",
            background: isCorrect ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.15)",
            border: `1px solid ${isCorrect ? "#4caf50" : "#f44336"}`,
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4, color: isCorrect ? "#69f0ae" : "#ff8a80", display: "flex", alignItems: "center", gap: 8 }}>
            <span>{isCorrect ? "Correct! +10 pts" : "Not quite!"}</span>
            {isCorrect && !hadWrongAttempt && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#facc15",
                  background: "rgba(250, 204, 21, 0.15)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  border: "1px solid rgba(250, 204, 21, 0.3)",
                  animation: "factory-first-try-glow 1s ease-in-out",
                }}
              >
                +5 First Try!
              </span>
            )}
          </div>
          {question.explanation}
        </div>
      )}

      {showExplanation && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={handleNext}
            style={{
              padding: "10px 28px",
              background: "#ff9800",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {isLastQuestion ? "View Results" : "Next Question"}
          </div>
        </div>
      )}
    </div>
  );
}
