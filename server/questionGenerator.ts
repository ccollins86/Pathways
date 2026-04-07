import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "missing",
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return _openai;
}

interface GeneratedQuestion {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

const WORLD_PROMPTS: Record<string, string> = {
  town: String.raw`Generate JavaScript quiz questions about if/else and else-if conditionals.
Topics: comparing values with ===, <, >, <=, >=, using if/else if/else chains, understanding which branch executes, the || and && operators in conditions.

Example question format:
{
  "id": 1,
  "code": "let weather = \"rainy\";\n\nif (weather === \"sunny\") {\n  goToBeach();\n} else if (weather === \"rainy\") {\n  bringUmbrella();\n} else {\n  stayHome();\n}",
  "question": "Which function gets called?",
  "options": ["goToBeach()", "bringUmbrella()", "stayHome()", "All three"],
  "correctIndex": 1,
  "explanation": "Since weather is \"rainy\", the else-if condition is true, so bringUmbrella() runs.",
  "hint": "Look at the value of weather and check which condition matches it exactly."
}`,

  "town-lesson": String.raw`Generate JavaScript quiz questions about if/else conditionals themed around disaster preparedness (hurricanes, wildfires, earthquakes, floods).
Topics: if/else if/else chains for choosing disaster responses, comparing disaster severity levels, choosing the right preparation action based on conditions.

Example question format:
{
  "id": 1,
  "code": "let disaster = \"wildfire\";\n\nif (disaster === \"hurricane\") {\n  sandBagDoors();\n} else if (disaster === \"wildfire\") {\n  sprayRetardant();\n} else if (disaster === \"earthquake\") {\n  strapFurniture();\n}",
  "question": "Which function gets called?",
  "options": ["sandBagDoors()", "sprayRetardant()", "strapFurniture()", "All three"],
  "correctIndex": 1,
  "explanation": "Since disaster is \"wildfire\", only the matching else-if branch runs.",
  "hint": "Look at the value of disaster and find the condition that matches it."
}`,

  factory: String.raw`Generate JavaScript quiz questions about functions, parameters, arguments, and return values.
Topics: identifying parameters vs arguments, understanding return values, function calls, tracing function execution, counting function calls, correct argument ordering.

Example question format:
{
  "id": 1,
  "code": "function makeHat(size, topColor, brimColor, lettering) {\n  // assemble the hat\n  return finishedHat;\n}\n\nlet myHat = makeHat(\"large\", \"white\", \"green\", \"Italy\");",
  "question": "What are the PARAMETERS of the makeHat function?",
  "options": ["\"large\", \"white\", \"green\", \"Italy\"", "size, topColor, brimColor, lettering", "finishedHat", "myHat"],
  "correctIndex": 1,
  "explanation": "Parameters are the variable names in the function definition. The actual values are arguments.",
  "hint": "Look at what's inside the parentheses where the function is defined."
}`,

  ocean: String.raw`Generate JavaScript quiz questions about for loops, while loops, and iteration.
Topics: for...of loops over arrays, while loop conditions, counting iterations, loop termination, choosing between for and while loops, tracing loop variable values.

Example question format:
{
  "id": 1,
  "code": "let fruits = [\"apple\", \"banana\", \"cherry\"];\n\nfor (let fruit of fruits) {\n  console.log(fruit);\n}",
  "question": "How many times does console.log run?",
  "options": ["1 time", "2 times", "3 times", "It runs forever"],
  "correctIndex": 2,
  "explanation": "The for...of loop runs once for each item in the array. Since there are 3 fruits, console.log runs exactly 3 times.",
  "hint": "Count how many items are in the array. The loop runs once for each item."
}`,

  psychic: String.raw`Generate JavaScript quiz questions about binary search and comparison-based searching algorithms.
Topics: binary search first guess calculation, updating min/max after each guess, worst-case number of guesses (log2), requirement for sorted data, comparing binary search to linear search, tracing binary search steps.

Example question format:
{
  "id": 1,
  "code": "// Searching for the number 73 in range 1-100\n// Using binary search:\nlet min = 1, max = 100;\nlet guess = Math.floor((min + max) / 2); // guess = ?",
  "question": "What is the first guess when using binary search on the range 1-100?",
  "options": ["1", "25", "50", "100"],
  "correctIndex": 2,
  "explanation": "Binary search always starts with the middle of the range. Math.floor((1 + 100) / 2) = 50.",
  "hint": "Binary search starts in the middle to eliminate half the possibilities."
}`,

};

function stripMarkdownFences(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

function repairAndParseJSON(raw: string): unknown {
  const repaired = raw
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'")
    .replaceAll("\u201C", '"')
    .replaceAll("\u201D", '"')
    .replaceAll("\t", String.raw`\t`)
    .replace(/(?<!\\)\\(?!["\\bfnrtu])/g, "\\\\");

  const arrayStart = repaired.indexOf("[");
  const arrayEnd = repaired.lastIndexOf("]");
  const sliced = (arrayStart !== -1 && arrayEnd > arrayStart)
    ? repaired.slice(arrayStart, arrayEnd + 1)
    : repaired;

  try {
    return JSON.parse(sliced);
  } catch (secondErr) {
    console.warn("JSON repair pass failed, attempting individual object extraction:", secondErr);
  }

  const objects: unknown[] = [];
  const objRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
  let match;
  while ((match = objRegex.exec(repaired)) !== null) {
    try {
      objects.push(JSON.parse(match[0]));
    } catch {
      // skip unparseable individual objects
    }
  }
  if (objects.length > 0) {
    return objects;
  }
  throw new Error("Could not parse LLM response as valid JSON after repair attempts");
}

function unwrapQuestionArray(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.questions)) {
      return obj.questions;
    }
    const firstArray = Object.values(obj).find(Array.isArray);
    if (firstArray) {
      return firstArray;
    }
    throw new Error("Response object contains no question array");
  }

  throw new TypeError("Response is not an array");
}

function validateRawQuestions(raw: unknown[]): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < raw.length; i++) {
    const q = raw[i] as Record<string, unknown>;
    if (
      typeof q.code === "string" &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === "number" &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3 &&
      typeof q.explanation === "string"
    ) {
      questions.push({
        id: i + 1,
        code: q.code,
        question: q.question,
        options: (q.options as unknown[]).map(String),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        hint: typeof q.hint === "string" ? q.hint : "Think carefully about the code.",
      });
    }
  }
  return questions;
}

export async function generateQuestions(
  worldId: string,
  count: number = 8
): Promise<GeneratedQuestion[]> {
  const prompt = WORLD_PROMPTS[worldId];
  if (!prompt) {
    throw new Error(`Unknown world: ${worldId}`);
  }

  const systemPrompt = `You are a quiz question generator for a coding education game. Generate exactly ${count} multiple-choice JavaScript quiz questions.

CRITICAL RULES:
1. Each question MUST have exactly 4 answer options
2. ALL 4 options MUST be completely different from each other - no duplicate options allowed
3. The correctIndex must be 0, 1, 2, or 3 and must point to the correct answer
4. Each question must have a code snippet, question text, explanation, and hint
5. Questions should be beginner-friendly but require careful reading of code
6. Make the code snippets realistic and educational
7. Vary the correct answer positions across questions (don't always use the same index)

Return a JSON object with a "questions" key containing an array of question objects. Each object must have: id (number), code (string), question (string), options (array of 4 distinct strings), correctIndex (0-3), explanation (string), hint (string). Do not include any markdown formatting.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_completion_tokens: 8192,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "";
  const cleaned = stripMarkdownFences(content);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (firstErr) {
    console.warn("Initial JSON parse failed, attempting repair:", firstErr);
    parsed = repairAndParseJSON(cleaned);
  }

  const rawArray = unwrapQuestionArray(parsed);
  return validateRawQuestions(rawArray);
}
