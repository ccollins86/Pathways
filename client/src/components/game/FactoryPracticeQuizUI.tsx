import { useGame } from "@/lib/stores/useGame";
import { useQuestionPrefetch } from "@/lib/stores/useQuestionPrefetch";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";
import { FACTORY_QUESTIONS } from "./factoryQuestions";

const THEME: QuizTheme = {
  title: "Functions Practice",
  accentColor: "#ff9800",
  hintColor: "#ffb74d",
  bgColor: "rgba(30, 20, 5, 0.97)",
  borderColor: "#ff9800",
  boxShadow: "0 0 40px rgba(255, 152, 0, 0.4)",
  nextBtnTextColor: "white",
  confettiColors: ["#ff9800", "#4caf50", "#f44336", "#2196f3", "#e040fb", "#ffeb3b", "#69f0ae", "#ff6b6b"],
  confettiPrefix: "factory-confetti",
};

export function FactoryPracticeQuizUI() {
  const closeFactoryPractice = useGame((s) => s.closeFactoryPractice);
  const addFactoryPracticeScore = useGame((s) => s.addFactoryPracticeScore);
  const factoryPracticeScore = useGame((s) => s.factoryPracticeScore);
  const completeFactoryPractice = useGame((s) => s.completeFactoryPractice);
  const resetFactoryPracticeScore = useGame((s) => s.resetFactoryPracticeScore);
  const totalScore = useGame((s) => s.totalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);
  const factoryWorldBonusAwarded = useGame((s) => s.factoryWorldBonusAwarded);

  const questions = useQuestionPrefetch((s) => s.getQuestions("factory", FACTORY_QUESTIONS));

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={factoryPracticeScore}
      totalScore={totalScore}
      onClose={closeFactoryPractice}
      onAddScore={addFactoryPracticeScore}
      onResetScore={resetFactoryPracticeScore}
      onComplete={completeFactoryPractice}
      onFirstTryBonus={incrementFirstTry}
      worldName="Factory"
      worldBonusAwarded={factoryWorldBonusAwarded}
    />
  );
}
