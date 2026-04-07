import { useGame } from "@/lib/stores/useGame";
import { useQuestionPrefetch } from "@/lib/stores/useQuestionPrefetch";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";
import { OCEAN_QUESTIONS } from "./oceanQuestions";

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
  const totalScore = useGame((s) => s.totalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);
  const oceanWorldBonusAwarded = useGame((s) => s.oceanWorldBonusAwarded);

  const prefetched = useQuestionPrefetch((s) => s.questions["ocean"]);
  const questions = prefetched && prefetched.length > 0 ? prefetched : OCEAN_QUESTIONS;

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={oceanPracticeScore}
      totalScore={totalScore}
      onClose={closeOceanPractice}
      onAddScore={addOceanPracticeScore}
      onResetScore={resetOceanPracticeScore}
      onComplete={completeOceanPractice}
      onFirstTryBonus={incrementFirstTry}
      worldName="Ocean"
      worldBonusAwarded={oceanWorldBonusAwarded}
    />
  );
}
