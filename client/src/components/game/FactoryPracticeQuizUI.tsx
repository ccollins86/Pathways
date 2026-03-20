import { useGame } from "@/lib/stores/useGame";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";
import { QuizLoadingOverlay } from "./QuizLoadingOverlay";

const THEME: QuizTheme = {
  title: "Functions Practice",
  accentColor: "#ff9800",
  hintColor: "#ff9800",
  bgColor: "rgba(30, 20, 5, 0.97)",
  borderColor: "#ff9800",
  boxShadow: "0 0 40px rgba(255, 152, 0, 0.4)",
  nextBtnTextColor: "#ffffff",
  confettiColors: ["#ff9800", "#4caf50", "#f44336", "#2196f3", "#e040fb", "#ffeb3b", "#69f0ae", "#ff6b6b"],
  confettiPrefix: "factory-confetti",
};

export function FactoryPracticeQuizUI() {
  const closeFactoryPractice = useGame((s) => s.closeFactoryPractice);
  const addFactoryPracticeScore = useGame((s) => s.addFactoryPracticeScore);
  const completeFactoryPractice = useGame((s) => s.completeFactoryPractice);
  const factoryPracticeScore = useGame((s) => s.factoryPracticeScore);
  const resetFactoryPracticeScore = useGame((s) => s.resetFactoryPracticeScore);
  const { questions, loading, error, regenerate } = useGeneratedQuestions("functions");

  if (loading || error) {
    return (
      <QuizLoadingOverlay
        loading={loading}
        error={error}
        theme={THEME}
        onRetry={regenerate}
        onClose={closeFactoryPractice}
      />
    );
  }

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={factoryPracticeScore}
      onClose={closeFactoryPractice}
      onAddScore={addFactoryPracticeScore}
      onResetScore={resetFactoryPracticeScore}
      onComplete={completeFactoryPractice}
    />
  );
}
