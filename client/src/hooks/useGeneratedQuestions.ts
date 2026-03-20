import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/components/game/PracticeQuizBase";

type QuizTopic = "conditionals" | "loops" | "functions";

interface UseGeneratedQuestionsResult {
  questions: Question[];
  loading: boolean;
  error: string | null;
  regenerate: () => void;
}

export function useGeneratedQuestions(topic: QuizTopic): UseGeneratedQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/generate-questions/${topic}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate questions");
      }
      const data = await response.json();
      if (!Array.isArray(data.questions) || data.questions.length < 8) {
        throw new Error("Received incomplete question set");
      }
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return { questions, loading, error, regenerate: fetchQuestions };
}
