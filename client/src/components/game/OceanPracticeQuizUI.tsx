import { useGame } from "@/lib/stores/useGame";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";
import { QuizLoadingOverlay } from "./QuizLoadingOverlay";

const THEME: QuizTheme = {
  title: "Ocean Practice Station",
  accentColor: "#69f0ae",
  hintColor: "#69f0ae",
  bgColor: "rgba(0, 20, 50, 0.97)",
  borderColor: "#69f0ae",
  boxShadow: "0 0 40px rgba(105, 240, 174, 0.4)",
  nextBtnTextColor: "#1b5e20",
  confettiColors: ["#4fc3f7", "#69f0ae", "#ffeb3b", "#ff9800", "#e040fb", "#ff6b6b", "#ffd93d", "#6bcb77"],
  confettiPrefix: "ocean-confetti",
};

export function OceanPracticeQuizUI() {
  const closeOceanPractice = useGame((s) => s.closeOceanPractice);
  const addOceanPracticeScore = useGame((s) => s.addOceanPracticeScore);
  const oceanPracticeScore = useGame((s) => s.oceanPracticeScore);
  const completeOceanPractice = useGame((s) => s.completeOceanPractice);
  const resetOceanPracticeScore = useGame((s) => s.resetOceanPracticeScore);
  const { questions, loading, error, regenerate } = useGeneratedQuestions("loops");

  if (loading || error) {
    return (
      <QuizLoadingOverlay
        loading={loading}
        error={error}
        theme={THEME}
        onRetry={regenerate}
        onClose={closeOceanPractice}
      />
    );
  }

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={oceanPracticeScore}
      onClose={closeOceanPractice}
      onAddScore={addOceanPracticeScore}
      onResetScore={resetOceanPracticeScore}
      onComplete={completeOceanPractice}
    />
  );
}
