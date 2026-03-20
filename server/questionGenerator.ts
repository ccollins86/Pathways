import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "_DUMMY_API_KEY_",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "http://localhost:1106/modelfarm/openai",
});

export interface GeneratedQuestion {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

const VALID_TOPICS = ["conditionals", "loops", "functions"] as const;
type QuizTopic = typeof VALID_TOPICS[number];

export function isValidTopic(topic: string): topic is QuizTopic {
  return VALID_TOPICS.includes(topic as QuizTopic);
}

const TOPIC_PROMPTS: Record<QuizTopic, string> = {
  conditionals: `Generate 8 multiple-choice quiz questions about JavaScript conditional logic (if, else if, else statements) for beginner programming students (K-12 / introductory CS level).

Each question should:
- Show a short code snippet (3-8 lines) using if/else if/else with simple, relatable variables (weather, animals, scores, time of day, food, colors, etc.)
- Ask what the code outputs or which branch executes
- Have exactly 4 answer options
- Include a clear explanation of why the correct answer is right, mentioning how conditions are checked top-to-bottom
- Include a helpful hint that guides the student without giving the answer away
- Vary in difficulty: start easy (simple if/else) and build to slightly harder (multiple else-if, OR operators, duplicate conditions)
- Use friendly, educational language appropriate for young learners`,

  loops: `Generate 8 multiple-choice quiz questions about JavaScript loops (for...of loops and while loops) for beginner programming students (K-12 / introductory CS level).

Each question should:
- Show a short code snippet (3-8 lines) using for...of or while loops with simple, relatable contexts (animals, fruits, cleaning, counting, nature)
- Ask about loop execution count, final variable values, or which loop type is best for a task
- Have exactly 4 answer options
- Include a clear explanation walking through how the loop executes step by step
- Include a helpful hint that guides the student without giving the answer away
- Mix for...of loops (iterating over arrays) and while loops (condition-based)
- Use friendly, educational language appropriate for young learners`,

  functions: `Generate 8 multiple-choice quiz questions about JavaScript functions for beginner programming students (K-12 / introductory CS level).

Each question should:
- Show a short code snippet (3-8 lines) using functions with parameters, arguments, and return values
- Topics to cover: parameters vs arguments, return values, function composition (calling functions from other functions), early returns, argument order
- Have exactly 4 answer options
- Include a clear explanation of the concept being tested
- Include a helpful hint that guides the student without giving the answer away
- Use relatable contexts like making products, greeting people, calculating costs
- Use friendly, educational language appropriate for young learners`,
};

function sanitizeJSON(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\\" && i + 1 < text.length && text[i + 1] === "'") {
      result += "'";
      i++;
    } else {
      result += text[i];
    }
  }
  return result;
}

function extractCodeBlock(text: string): string | null {
  const openMarker = "```";
  const openIdx = text.indexOf(openMarker);
  if (openIdx === -1) return null;

  let contentStart = openIdx + openMarker.length;
  const afterMarker = text.slice(contentStart);
  if (afterMarker.startsWith("json")) {
    contentStart += 4;
  }
  while (contentStart < text.length && (text[contentStart] === " " || text[contentStart] === "\t" || text[contentStart] === "\n" || text[contentStart] === "\r")) {
    contentStart++;
  }

  const closeIdx = text.indexOf(openMarker, contentStart);
  if (closeIdx === -1) return null;

  return text.slice(contentStart, closeIdx).trim();
}

function extractBracketContent(text: string, open: string, close: string): string | null {
  const start = text.indexOf(open);
  if (start === -1) return null;
  const end = text.lastIndexOf(close);
  if (end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function extractJSON(text: string): any {
  const codeBlock = extractCodeBlock(text);
  if (codeBlock) {
    return JSON.parse(sanitizeJSON(codeBlock));
  }

  try {
    return JSON.parse(sanitizeJSON(text));
  } catch {}

  const arrayContent = extractBracketContent(text, "[", "]");
  if (arrayContent) {
    return JSON.parse(sanitizeJSON(arrayContent));
  }

  const objectContent = extractBracketContent(text, "{", "}");
  if (objectContent) {
    return JSON.parse(sanitizeJSON(objectContent));
  }

  throw new Error("No JSON found in response");
}

function validateQuestion(q: any, idx: number): GeneratedQuestion | null {
  const code = typeof q.code === "string" ? q.code.trim() : "";
  const question = typeof q.question === "string" ? q.question.trim() : "";
  const explanation = typeof q.explanation === "string" ? q.explanation.trim() : "";
  const hint = typeof q.hint === "string" ? q.hint.trim() : "";

  if (!code || !question || !explanation) return null;

  const options = Array.isArray(q.options) ? q.options.map(String) : [];
  if (options.length < 4) return null;

  let correctIndex = typeof q.correctIndex === "number" ? q.correctIndex
    : typeof q.correct_index === "number" ? q.correct_index : -1;
  if (correctIndex < 0 || correctIndex > 3) return null;

  return {
    id: idx + 1,
    code,
    question,
    options: options.slice(0, 4),
    correctIndex,
    explanation,
    hint: hint || "Think carefully about what each line of code does.",
  };
}

const MAX_RETRIES = 2;

async function attemptGeneration(topic: QuizTopic): Promise<GeneratedQuestion[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a quiz question generator for an educational programming game aimed at beginner students.

Respond with ONLY a JSON object containing a "questions" key with an array of exactly 8 question objects. No markdown, no code fences, no explanation text.

Each question object must have these exact fields:
- "id": number (1 through 8)
- "code": string (the code snippet with newlines)
- "question": string (the question to ask about the code)
- "options": array of exactly 4 strings (the multiple choice answers)
- "correctIndex": number (0-3, the index of the correct option)
- "explanation": string (why the correct answer is right)
- "hint": string (a helpful hint without giving the answer away)

Do not use escaped single quotes in strings. Use double quotes for strings within code snippets. The questions should feel fresh and varied — use different variable names, scenarios, and values each time. Make code snippets clean and readable.`,
      },
      {
        role: "user",
        content: TOPIC_PROMPTS[topic],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from LLM");
  }

  const parsed = extractJSON(content);

  let rawQuestions: any[];
  if (Array.isArray(parsed)) {
    rawQuestions = parsed;
  } else if (parsed.questions && Array.isArray(parsed.questions)) {
    rawQuestions = parsed.questions;
  } else {
    const keys = Object.keys(parsed);
    const arrayKey = keys.find(k => Array.isArray(parsed[k]));
    if (arrayKey) {
      rawQuestions = parsed[arrayKey];
    } else {
      throw new Error("Invalid response structure from LLM");
    }
  }

  const validated = rawQuestions
    .map((q, idx) => validateQuestion(q, idx))
    .filter((q): q is GeneratedQuestion => q !== null);

  if (validated.length < 8) {
    throw new Error(`Only ${validated.length}/8 questions passed validation`);
  }

  return validated.slice(0, 8);
}

export function isLLMAvailable(): boolean {
  return !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);
}

export async function generateQuestions(topic: QuizTopic): Promise<GeneratedQuestion[]> {
  if (!isLLMAvailable()) {
    console.log(`[QuestionGen] LLM API not configured — skipping generation for "${topic}"`);
    throw new Error("LLM API not configured");
  }

  console.log(`[QuestionGen] Starting question generation for "${topic}" via OpenAI API...`);
  const startTime = Date.now();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[QuestionGen] Attempt ${attempt + 1}/${MAX_RETRIES + 1} for "${topic}"...`);
      const questions = await attemptGeneration(topic);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[QuestionGen] Successfully generated ${questions.length} questions for "${topic}" in ${elapsed}s`);
      return questions;
    } catch (e: any) {
      lastError = e;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`[QuestionGen] Attempt ${attempt + 1} failed for "${topic}" after ${elapsed}s:`, e.message);
      if (attempt < MAX_RETRIES) {
        console.log(`[QuestionGen] Retrying "${topic}" in 1s...`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.error(`[QuestionGen] All attempts failed for "${topic}" after ${elapsed}s`);
  throw lastError || new Error("Failed to generate questions after retries");
}
