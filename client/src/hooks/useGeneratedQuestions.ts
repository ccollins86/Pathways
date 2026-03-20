import { useState, useEffect, useCallback, useRef } from "react";
import type { Question } from "@/components/game/PracticeQuizBase";

type QuizTopic = "conditionals" | "loops" | "functions";

interface CacheEntry {
  questions: Question[];
  loading: boolean;
  error: string | null;
  promise: Promise<Question[]> | null;
}

const cache: Record<string, CacheEntry> = {};

async function fetchQuestionsFromAPI(topic: QuizTopic): Promise<Question[]> {
  const response = await fetch(`/api/generate-questions/${topic}`);
  if (!response.ok) {
    let msg = "Failed to generate questions";
    try {
      const data = await response.json();
      if (data.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  const data = await response.json();
  if (!Array.isArray(data.questions) || data.questions.length < 8) {
    throw new Error("Received incomplete question set");
  }
  return data.questions;
}

function startPreload(topic: QuizTopic): void {
  if (cache[topic]?.questions.length > 0 || cache[topic]?.loading) return;

  const entry: CacheEntry = {
    questions: [],
    loading: true,
    error: null,
    promise: null,
  };

  entry.promise = fetchQuestionsFromAPI(topic)
    .then((questions) => {
      entry.questions = questions;
      entry.loading = false;
      entry.error = null;
      return questions;
    })
    .catch((err) => {
      entry.loading = false;
      entry.error = err.message || "Failed to load questions";
      throw err;
    });

  cache[topic] = entry;
}

const WORLD_TOPICS: Record<string, QuizTopic> = {
  town: "conditionals",
  ocean: "loops",
  factory: "functions",
};

export function preloadQuestionsForWorld(world: string): void {
  const topic = WORLD_TOPICS[world];
  if (topic) {
    startPreload(topic);
  }
}

interface UseGeneratedQuestionsResult {
  questions: Question[];
  loading: boolean;
  error: string | null;
  regenerate: () => void;
}

export function useGeneratedQuestions(topic: QuizTopic): UseGeneratedQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>(cache[topic]?.questions || []);
  const [loading, setLoading] = useState(!cache[topic]?.questions.length);
  const [error, setError] = useState<string | null>(cache[topic]?.error || null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadFromCache = useCallback(async () => {
    const entry = cache[topic];
    if (entry?.questions.length) {
      setQuestions(entry.questions);
      setLoading(false);
      setError(null);
      return;
    }

    if (entry?.promise) {
      setLoading(true);
      setError(null);
      try {
        const result = await entry.promise;
        if (mountedRef.current) {
          setQuestions(result);
          setLoading(false);
        }
      } catch (err: any) {
        if (mountedRef.current) {
          setError(err.message || "Failed to load questions");
          setLoading(false);
        }
      }
      return;
    }

    setLoading(true);
    setError(null);
    startPreload(topic);
    try {
      const result = await cache[topic]!.promise!;
      if (mountedRef.current) {
        setQuestions(result);
        setLoading(false);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || "Failed to load questions");
        setLoading(false);
      }
    }
  }, [topic]);

  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  const regenerate = useCallback(async () => {
    delete cache[topic];
    setLoading(true);
    setError(null);
    startPreload(topic);
    try {
      const result = await cache[topic]!.promise!;
      if (mountedRef.current) {
        setQuestions(result);
        setLoading(false);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || "Failed to load questions");
        setLoading(false);
      }
    }
  }, [topic]);

  return { questions, loading, error, regenerate };
}
