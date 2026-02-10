/*
  Design Philosophy: Storybook Fantasy Adventure
  Game state management for math quest progression
*/

import { createContext, useContext, useState, ReactNode } from "react";

export type DifficultyLevel = "easy" | "medium" | "hard";
export type OperationType = "addition" | "subtraction" | "mixed";

export interface Quest {
  id: number;
  question: string;
  answer: number;
  operands: number[];
  operation: "+" | "-";
  difficulty: DifficultyLevel;
  storyContext: string;
}

export interface PlayerStats {
  totalQuests: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  level: number;
  experience: number;
  badges: string[];
}

interface GameContextType {
  playerStats: PlayerStats;
  currentQuest: Quest | null;
  difficulty: DifficultyLevel;
  operationType: OperationType;
  isGameStarted: boolean;
  generateNewQuest: (useDifficulty?: DifficultyLevel, useOperation?: OperationType) => void;
  submitAnswer: (answer: number) => boolean;
  setDifficulty: (level: DifficultyLevel) => void;
  setOperationType: (type: OperationType) => void;
  startGame: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const storyContexts = {
  addition: [
    "The wizard found {a} magical crystals in the forest and {b} more in the cave. How many crystals does the wizard have?",
    "A brave knight collected {a} golden coins from the first treasure chest and {b} coins from the second. How many coins in total?",
    "The dragon counted {a} gems in the morning and found {b} more gems in the afternoon. How many gems does the dragon have?",
    "A fairy gathered {a} flowers from the meadow and {b} flowers from the garden. How many flowers did the fairy collect?",
    "The adventurer discovered {a} ancient scrolls in the library and {b} scrolls in the tower. How many scrolls were found?",
  ],
  subtraction: [
    "The wizard had {a} magical potions but used {b} of them to help villagers. How many potions are left?",
    "A knight started with {a} arrows in the quiver but shot {b} arrows at targets. How many arrows remain?",
    "The dragon had {a} precious jewels but gave {b} jewels to the princess. How many jewels does the dragon still have?",
    "A baker made {a} enchanted cookies but {b} were eaten by hungry travelers. How many cookies are left?",
    "The treasure chest contained {a} gold pieces but the hero spent {b} pieces at the market. How many gold pieces remain?",
  ],
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalQuests: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    level: 1,
    experience: 0,
    badges: [],
  });

  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [operationType, setOperationType] = useState<OperationType>("addition");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const getNumberRange = (level: DifficultyLevel): [number, number] => {
    switch (level) {
      case "easy":
        return [1, 10];
      case "medium":
        return [5, 20];
      case "hard":
        return [10, 50];
    }
  };

  const generateNewQuest = (useDifficulty?: DifficultyLevel, useOperation?: OperationType) => {
    const currentDifficulty = useDifficulty || difficulty;
    const currentOperation = useOperation || operationType;
    const [min, max] = getNumberRange(currentDifficulty);
    
    let operation: "+" | "-";
    if (currentOperation === "mixed") {
      operation = Math.random() > 0.5 ? "+" : "-";
    } else {
      operation = currentOperation === "addition" ? "+" : "-";
    }

    let a: number, b: number, answer: number;

    if (operation === "+") {
      a = Math.floor(Math.random() * (max - min + 1)) + min;
      b = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = a + b;
    } else {
      // For subtraction, ensure result is non-negative
      a = Math.floor(Math.random() * (max - min + 1)) + min;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
    }

    const contexts = operation === "+" ? storyContexts.addition : storyContexts.subtraction;
    const storyTemplate = contexts[Math.floor(Math.random() * contexts.length)];
    const storyContext = storyTemplate.replace("{a}", a.toString()).replace("{b}", b.toString());

    const quest: Quest = {
      id: Date.now(),
      question: `${a} ${operation} ${b}`,
      answer,
      operands: [a, b],
      operation,
      difficulty,
      storyContext,
    };

    setCurrentQuest(quest);
  };

  const submitAnswer = (answer: number): boolean => {
    if (!currentQuest) return false;

    const isCorrect = answer === currentQuest.answer;
    
    setPlayerStats((prev) => {
      const newStats = {
        ...prev,
        totalQuests: prev.totalQuests + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        streak: isCorrect ? prev.streak + 1 : 0,
        bestStreak: isCorrect ? Math.max(prev.bestStreak, prev.streak + 1) : prev.bestStreak,
        experience: isCorrect ? prev.experience + 10 : prev.experience,
      };

      // Level up every 100 experience points
      if (newStats.experience >= prev.level * 100) {
        newStats.level = prev.level + 1;
      }

      // Award badges
      const newBadges = [...prev.badges];
      if (newStats.correctAnswers === 10 && !newBadges.includes("first-10")) {
        newBadges.push("first-10");
      }
      if (newStats.bestStreak >= 5 && !newBadges.includes("streak-5")) {
        newBadges.push("streak-5");
      }
      if (newStats.level >= 5 && !newBadges.includes("level-5")) {
        newBadges.push("level-5");
      }
      newStats.badges = newBadges;

      return newStats;
    });

    return isCorrect;
  };

  const startGame = () => {
    setIsGameStarted(true);
    // Quest will be generated by useEffect in Game component
  };

  const resetGame = () => {
    setPlayerStats({
      totalQuests: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      level: 1,
      experience: 0,
      badges: [],
    });
    setCurrentQuest(null);
    setIsGameStarted(false);
  };

  return (
    <GameContext.Provider
      value={{
        playerStats,
        currentQuest,
        difficulty,
        operationType,
        isGameStarted,
        generateNewQuest,
        submitAnswer,
        setDifficulty,
        setOperationType,
        startGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
