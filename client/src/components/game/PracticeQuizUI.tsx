import { useMemo } from "react";
import { useGame } from "@/lib/stores/useGame";
import { QuizUI, type Question, type QuizTheme, type QuizActions } from "./QuizUI";

const FALLBACK_QUESTIONS: Question[] = [
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
  },
];

const THEME: QuizTheme = {
  title: "Practice Station",
  accentColor: "#4fc3f7",
  accentColorRgba: "rgba(79, 195, 247, 0.2)",
  backgroundColor: "rgba(13, 25, 48, 0.97)",
  buttonTextColor: "#0d47a1",
  confettiColors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fff", "#4fc3f7", "#ffeb3b", "#ff9800"],
  animationPrefix: "confetti-fly",
};

export function PracticeQuizUI() {
  const closePractice = useGame((s) => s.closePractice);
  const addPracticeScore = useGame((s) => s.addPracticeScore);
  const practiceScore = useGame((s) => s.practiceScore);
  const completePractice = useGame((s) => s.completePractice);
  const townQuestions = useGame((s) => s.townQuestions);

  const questions = useMemo(() => {
    if (townQuestions && townQuestions.length > 0) return townQuestions;
    return [...FALLBACK_QUESTIONS].sort(() => Math.random() - 0.5);
  }, [townQuestions]);

  const actions: QuizActions = useMemo(() => ({
    close: closePractice,
    addScore: addPracticeScore,
    complete: completePractice,
    resetScore: () => useGame.getState().resetPracticeScore(),
    closeOnFinish: true,
  }), [closePractice, addPracticeScore, completePractice]);

  return (
    <QuizUI
      questions={questions}
      score={practiceScore}
      theme={THEME}
      actions={actions}
    />
  );
}
