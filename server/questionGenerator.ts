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
  return text.replace(/\\'/g, "'");
}

function extractJSON(text: string): any {
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    return JSON.parse(sanitizeJSON(jsonBlockMatch[1].trim()));
  }

  try {
    return JSON.parse(sanitizeJSON(text));
  } catch {}

  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return JSON.parse(sanitizeJSON(arrayMatch[0]));
  }

  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return JSON.parse(sanitizeJSON(objectMatch[0]));
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

export async function generateQuestions(topic: QuizTopic): Promise<GeneratedQuestion[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await attemptGeneration(topic);
    } catch (e: any) {
      lastError = e;
      console.error(`Question generation attempt ${attempt + 1} failed:`, e.message);
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  throw lastError || new Error("Failed to generate questions after retries");
}
