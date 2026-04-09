import { useGame } from "@/lib/stores/useGame";
import { useQuestionPrefetch } from "@/lib/stores/useQuestionPrefetch";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";
import { TOWN_QUESTIONS } from "./townQuestions";

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
  const totalScore = useGame((s) => s.totalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);
  const townWorldBonusAwarded = useGame((s) => s.townWorldBonusAwarded);

  const prefetched = useQuestionPrefetch((s) => s.questions["town"]);
  const questions = prefetched && prefetched.length > 0 ? prefetched : TOWN_QUESTIONS;
  console.log(`[PracticeQuizUI] Using ${prefetched && prefetched.length > 0 ? "AI" : "hardcoded"} questions (${questions.length})`);

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={practiceScore}
      totalScore={totalScore}
      onClose={closePractice}
      onAddScore={addPracticeScore}
      onResetScore={resetPracticeScore}
      onComplete={completePractice}
      onFirstTryBonus={incrementFirstTry}
      worldName="Town"
      worldBonusAwarded={townWorldBonusAwarded}
    />
  );
}
