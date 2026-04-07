import { useGame } from "@/lib/stores/useGame";
import { useQuestionPrefetch } from "@/lib/stores/useQuestionPrefetch";
import { PSYCHIC_QUESTIONS } from "./psychicQuestions";
import { PracticeQuizBase, type QuizTheme } from "./PracticeQuizBase";

const THEME: QuizTheme = {
  title: "Binary Search Practice",
  accentColor: "#e0b0ff",
  hintColor: "#e0b0ff",
  bgColor: "rgba(26, 10, 46, 0.97)",
  borderColor: "#9b59b6",
  boxShadow: "0 0 40px rgba(155, 89, 182, 0.4)",
  nextBtnTextColor: "#1a0a2e",
  confettiColors: [
    "#9b59b6",
    "#69f0ae",
    "#e0b0ff",
    "#ffd700",
    "#4fc3f7",
    "#ff6b6b",
    "#ffeb3b",
    "#6a0dad",
  ],
  confettiPrefix: "psychic-confetti",
};

export function PsychicPracticeQuizUI() {
  const closePsychicPractice = useGame((s) => s.closePsychicPractice);
  const addPsychicPracticeScore = useGame((s) => s.addPsychicPracticeScore);
  const psychicPracticeScore = useGame((s) => s.psychicPracticeScore);
  const completePsychicPractice = useGame((s) => s.completePsychicPractice);
  const resetPsychicPracticeScore = useGame((s) => s.resetPsychicPracticeScore);
  const totalScore = useGame((s) => s.totalScore);
  const incrementFirstTry = useGame((s) => s.incrementFirstTry);
  const psychicWorldBonusAwarded = useGame((s) => s.psychicWorldBonusAwarded);
  const questions = useQuestionPrefetch((s) =>
    s.getQuestions("psychic", PSYCHIC_QUESTIONS),
  );

  return (
    <PracticeQuizBase
      questions={questions}
      theme={THEME}
      score={psychicPracticeScore}
      totalScore={totalScore}
      onClose={closePsychicPractice}
      onAddScore={addPsychicPracticeScore}
      onResetScore={resetPsychicPracticeScore}
      onComplete={completePsychicPractice}
      onFirstTryBonus={incrementFirstTry}
      worldName="Psychic"
      worldBonusAwarded={psychicWorldBonusAwarded}
    />
  );
}
