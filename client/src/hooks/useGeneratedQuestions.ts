import { useState, useEffect, useCallback, useRef } from "react";
import type { Question } from "@/components/game/PracticeQuizBase";
import { getFallbackQuestions, getQuestionCount, type QuizTopic } from "@/data/fallbackQuestions";

interface CacheEntry {
  questions: Question[] | null;
  loading: boolean;
  promise: Promise<Question[]> | null;
}

const cache: Record<string, CacheEntry> = {};

let llmAvailable: boolean | null = null;
let llmCheckPromise: Promise<boolean> | null = null;

async function checkLLMAvailability(): Promise<boolean> {
  if (llmAvailable !== null) return llmAvailable;
  if (llmCheckPromise) return llmCheckPromise;

  llmCheckPromise = fetch("/api/llm-status")
    .then((res) => {
      if (!res.ok) throw new Error("LLM status check failed");
      return res.json();
    })
    .then((data) => {
      if (typeof data.available !== "boolean") throw new Error("Invalid LLM status response");
      llmAvailable = data.available;
      return llmAvailable;
    })
    .catch(() => {
      llmAvailable = false;
      return false;
    })
    .finally(() => {
      llmCheckPromise = null;
    });

  return llmCheckPromise;
}

async function fetchQuestionsFromAPI(topic: QuizTopic): Promise<Question[]> {
  const available = await checkLLMAvailability();
  if (!available) {
    throw new Error("LLM not available");
  }

  const response = await fetch(`/api/generate-questions/${topic}`);
  if (!response.ok) {
    let msg = "Failed to generate questions";
    try {
      const data = await response.json();
      if (data.unavailable) {
        llmAvailable = false;
        throw new Error("LLM not available");
      }
      if (data.error) msg = data.error;
    } catch (e: any) {
      if (e.message === "LLM not available") throw e;
    }
    throw new Error(msg);
  }
  const data = await response.json();
  const expectedCount = getQuestionCount(topic);
  if (!Array.isArray(data.questions) || data.questions.length < expectedCount) {
    throw new Error("Received incomplete question set");
  }
  data.questions.forEach((q: any) => {
    const optionSet = new Set(q.options.map((o: string) => o.trim()));
    if (optionSet.size < q.options.length) {
      q._hasDuplicateOptions = true;
    }
  });
  return data.questions;
}

function startPreload(topic: QuizTopic): void {
  if (cache[topic]?.questions || cache[topic]?.loading) {
    return;
  }

  const entry: CacheEntry = {
    questions: null,
    loading: true,
    promise: null,
  };

  const innerPromise = fetchQuestionsFromAPI(topic)
    .then((questions) => {
      entry.questions = questions;
      entry.loading = false;
      return questions;
    })
    .catch((err) => {
      entry.loading = false;
      throw err;
    });

  innerPromise.catch(() => {});
  entry.promise = innerPromise;

  cache[topic] = entry;
}

const WORLD_TOPICS: Record<string, QuizTopic[]> = {
  town: ["conditionals", "disaster_lesson"],
  ocean: ["loops"],
  factory: ["functions"],
};

export function preloadQuestionsForWorld(world: string): void {
  const topics = WORLD_TOPICS[world];
  if (topics) {
    topics.forEach((topic) => startPreload(topic));
  }
}

interface UseGeneratedQuestionsResult {
  questions: Question[];
  regenerate: () => void;
  markServed: (index: number) => void;
}

export function useGeneratedQuestions(topic: QuizTopic): UseGeneratedQuestionsResult {
  const fallbackRef = useRef<Question[]>(getFallbackQuestions(topic));
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(
    cache[topic]?.questions || null
  );
  const [servedUpTo, setServedUpTo] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (generatedQuestions) return;

    const entry = cache[topic];
    if (entry?.questions) {
      setGeneratedQuestions(entry.questions);
      return;
    }

    if (!entry?.promise) {
      startPreload(topic);
    }

    cache[topic]?.promise
      ?.then((qs) => {
        if (mountedRef.current) setGeneratedQuestions(qs);
      })
      .catch(() => {});
  }, [topic, generatedQuestions]);

  const markServed = useCallback((index: number) => {
    setServedUpTo((prev) => Math.max(prev, index + 1));
  }, []);

  const questionCount = getQuestionCount(topic);
  const questions: Question[] = [];
  let fallbackIndex = 0;
  for (let i = 0; i < questionCount; i++) {
    if (generatedQuestions) {
      const q = generatedQuestions[i] as any;
      const opts = q.options as string[];
      const uniqueOpts = new Set(opts.map((o: string) => o.trim()));
      if (uniqueOpts.size < opts.length || q._hasDuplicateOptions) {
        questions.push({ ...fallbackRef.current[fallbackIndex % fallbackRef.current.length], id: i + 1 });
        fallbackIndex++;
      } else {
        questions.push({ ...generatedQuestions[i], id: i + 1 });
      }
    } else {
      questions.push(fallbackRef.current[i]);
    }
  }

  const regenerate = useCallback(() => {
    delete cache[topic];
    fallbackRef.current = getFallbackQuestions(topic);
    setGeneratedQuestions(null);
    setServedUpTo(0);
    startPreload(topic);
    cache[topic]?.promise
      ?.then((qs) => {
        if (mountedRef.current) setGeneratedQuestions(qs);
      })
      .catch(() => {});
  }, [topic]);

  return { questions, regenerate, markServed };
}
