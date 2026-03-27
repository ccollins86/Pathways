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

  console.log("[QuizLoader] Checking LLM availability...");
  llmCheckPromise = fetch("/api/llm-status")
    .then((res) => {
      if (!res.ok) throw new Error("LLM status check failed");
      return res.json();
    })
    .then((data) => {
      if (typeof data.available !== "boolean") throw new Error("Invalid LLM status response");
      llmAvailable = data.available;
      console.log(`[QuizLoader] LLM available: ${llmAvailable}`);
      return llmAvailable;
    })
    .catch(() => {
      llmAvailable = false;
      console.log("[QuizLoader] LLM not available — using fallback questions");
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

  console.log(`[QuizLoader] Fetching AI-generated questions for "${topic}"...`);
  const startTime = performance.now();
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
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
    console.error(`[QuizLoader] Failed to fetch questions for "${topic}" after ${elapsed}s: ${msg}`);
    throw new Error(msg);
  }
  const data = await response.json();
  const expectedCount = getQuestionCount(topic);
  if (!Array.isArray(data.questions) || data.questions.length < expectedCount) {
    throw new Error("Received incomplete question set");
  }
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  console.log(`[QuizLoader] Received ${data.questions.length} AI-generated questions for "${topic}" in ${elapsed}s`);
  return data.questions;
}

function startPreload(topic: QuizTopic): void {
  if (cache[topic]?.questions || cache[topic]?.loading) {
    if (cache[topic]?.questions) console.log(`[QuizLoader] Questions for "${topic}" already cached`);
    return;
  }
  console.log(`[QuizLoader] Starting preload for "${topic}"...`);

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
  for (let i = 0; i < questionCount; i++) {
    if (generatedQuestions) {
      questions.push({ ...generatedQuestions[i], id: i + 1 });
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
