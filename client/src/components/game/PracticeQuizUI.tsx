import { useGame } from "@/lib/stores/useGame";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";
import { QuizLoadingOverlay } from "./QuizLoadingOverlay";

const THEME: QuizTheme = {
  title: "Practice Station",
  accentColor: "#4fc3f7",
  hintColor: "#4fc3f7",
  bgColor: "rgba(13, 25, 48, 0.97)",
  borderColor: "#4fc3f7",
  boxShadow: "0 0 40px rgba(79, 195, 247, 0.4)",
  nextBtnTextColor: "#0d47a1",
  confettiColors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fff", "#4fc3f7", "#ffeb3b", "#ff9800"],
  confettiPrefix: "confetti-fly",
};

export function PracticeQuizUI() {
  const closePractice = useGame((s) => s.closePractice);
  const addPracticeScore = useGame((s) => s.addPracticeScore);
  const practiceScore = useGame((s) => s.practiceScore);
  const completePractice = useGame((s) => s.completePractice);
  const resetPracticeScore = useGame((s) => s.resetPracticeScore);
  const { questions, loading, error, regenerate } = useGeneratedQuestions("conditionals");

  if (loading || error) {
    return (
      <QuizLoadingOverlay
        loading={loading}
        error={error}
        theme={THEME}
        onRetry={regenerate}
        onClose={closePractice}
      />
    );
  }

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={practiceScore}
      onClose={closePractice}
      onAddScore={addPracticeScore}
      onResetScore={resetPracticeScore}
      onComplete={completePractice}
      closeOnComplete
    />
  );
}
