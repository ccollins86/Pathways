import { create } from "zustand";

interface Question {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

type QuizKey = "town" | "town-lesson" | "factory" | "ocean" | "psychic";

interface PrefetchState {
  questions: Partial<Record<QuizKey, Question[]>>;
  loading: Partial<Record<QuizKey, boolean>>;
  succeeded: Partial<Record<QuizKey, boolean>>;
  prefetchQuestions: (key: QuizKey, fallbackQuestions: Question[], count?: number) => void;
  getQuestions: (key: QuizKey, fallbackQuestions: Question[]) => Question[];
}

function isValidQuestion(q: unknown): q is Question {
  if (!q || typeof q !== "object") return false;
  const obj = q as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.code === "string" &&
    typeof obj.question === "string" &&
    Array.isArray(obj.options) &&
    obj.options.length === 4 &&
    obj.options.every((o: unknown) => typeof o === "string") &&
    typeof obj.correctIndex === "number" &&
    obj.correctIndex >= 0 &&
    obj.correctIndex <= 3 &&
    typeof obj.explanation === "string"
  );
}

function hasDistinctOptions(q: Question): boolean {
  const set = new Set(q.options);
  return set.size === 4;
}

function questionSignature(q: Question): string {
  return q.question.trim().toLowerCase();
}

function getRandomFallback(
  fallbackQuestions: Question[],
  usedSignatures: Set<string>,
  usedFallbackIndices: Set<number>
): Question | null {
  const available: number[] = [];
  for (let i = 0; i < fallbackQuestions.length; i++) {
    if (!usedFallbackIndices.has(i) && !usedSignatures.has(questionSignature(fallbackQuestions[i]))) {
      available.push(i);
    }
  }
  if (available.length === 0) return null;
  const idx = available[Math.floor(Math.random() * available.length)];
  usedFallbackIndices.add(idx);
  return fallbackQuestions[idx];
}

function sanitizeQuestion(q: Question): Question {
  return {
    id: q.id,
    code: q.code,
    question: q.question,
    options: q.options.map(String),
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    hint: typeof q.hint === "string" ? q.hint : "Think carefully about the code.",
  };
}

function pushFallback(
  fallbackQuestions: Question[],
  usedSignatures: Set<string>,
  usedFallbackIndices: Set<number>,
  result: Question[]
): void {
  const replacement = getRandomFallback(fallbackQuestions, usedSignatures, usedFallbackIndices);
  if (replacement) {
    usedSignatures.add(questionSignature(replacement));
    result.push(replacement);
  }
}

function processGeneratedQuestion(
  q: Question,
  fallbackQuestions: Question[],
  usedSignatures: Set<string>,
  usedFallbackIndices: Set<number>,
  result: Question[]
): void {
  if (!isValidQuestion(q) || !hasDistinctOptions(q)) {
    pushFallback(fallbackQuestions, usedSignatures, usedFallbackIndices, result);
    return;
  }

  const sig = questionSignature(q);
  if (usedSignatures.has(sig)) {
    pushFallback(fallbackQuestions, usedSignatures, usedFallbackIndices, result);
    return;
  }

  usedSignatures.add(sig);
  result.push(sanitizeQuestion(q));
}

function validateAndReplace(
  generated: Question[],
  fallbackQuestions: Question[],
  targetCount: number
): Question[] {
  const usedSignatures = new Set<string>();
  const usedFallbackIndices = new Set<number>();
  const result: Question[] = [];

  for (const q of generated) {
    processGeneratedQuestion(q, fallbackQuestions, usedSignatures, usedFallbackIndices, result);
  }

  while (result.length < targetCount) {
    const replacement = getRandomFallback(fallbackQuestions, usedSignatures, usedFallbackIndices);
    if (!replacement) break;
    usedSignatures.add(questionSignature(replacement));
    result.push(replacement);
  }

  return result.slice(0, targetCount);
}

export const useQuestionPrefetch = create<PrefetchState>((set, get) => ({
  questions: {},
  loading: {},
  succeeded: {},

  prefetchQuestions: (key, fallbackQuestions, count) => {
    const state = get();
    if (state.loading[key] || state.succeeded[key]) return;

    set((s) => ({ loading: { ...s.loading, [key]: true } }));

    const targetCount = count || fallbackQuestions.length;

    fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ worldId: key, count: targetCount }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          const validated = validateAndReplace(data.questions, fallbackQuestions, targetCount);
          if (validated.length > 0) {
            set((s) => ({
              questions: { ...s.questions, [key]: validated },
              loading: { ...s.loading, [key]: false },
              succeeded: { ...s.succeeded, [key]: true },
            }));
            return;
          }
        }
        set((s) => ({
          loading: { ...s.loading, [key]: false },
        }));
      })
      .catch(() => {
        set((s) => ({
          loading: { ...s.loading, [key]: false },
        }));
      });
  },

  getQuestions: (key, fallbackQuestions) => {
    const state = get();
    const prefetched = state.questions[key];
    if (prefetched && prefetched.length > 0) {
      return prefetched;
    }
    return fallbackQuestions;
  },
}));
