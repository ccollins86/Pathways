import type { Express } from "express";
import { type Server } from "http";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/download-template", (_req, res) => {
    const zipPath = path.resolve("client/public/game-template.zip");
    res.download(zipPath, "game-template.zip");
  });

  app.get("/api/download-full-project", (_req, res) => {
    const zipPath = path.resolve("client/public/full-project.zip");
    res.download(zipPath, "disaster-prep-quest.zip");
  });

  app.post("/api/generate-questions", async (req, res) => {
    try {
      const { topic, count = 8 } = req.body;

      if (!topic || !["if-else", "loops", "functions"].includes(topic)) {
        return res.status(400).json({ error: "topic must be 'if-else', 'loops', or 'functions'" });
      }

      let topicPrompt: string;
      if (topic === "if-else") {
        topicPrompt = `Generate ${count} multiple-choice programming questions about JavaScript if/else and else-if statements. 
Each question should show a short code snippet (3-8 lines) that uses if, else if, and/or else statements with simple variables (strings, numbers, booleans). 
The student must trace through the code to determine which branch executes or what value a variable holds after the if/else block runs.
Use relatable real-world scenarios like weather, grades, ages, animals, food, time of day, or sports.`;
      } else if (topic === "loops") {
        topicPrompt = `Generate ${count} multiple-choice programming questions about JavaScript for loops and while loops.
Each question should show a short code snippet (3-8 lines) that uses for...of loops over arrays or while loops with a counter/condition.
The student must trace through the code to determine how many times a loop runs, what a counter equals after the loop, or what output is produced.
Use relatable real-world scenarios like counting animals, cleaning tasks, processing lists, or iterating through collections.`;
      } else {
        topicPrompt = `Generate ${count} multiple-choice programming questions about JavaScript functions.
Each question should show a short code snippet (3-8 lines) that defines and/or calls functions with parameters, return values, and function composition.
The student must trace through the code to determine what a function returns, identify parameters vs arguments, understand function calls and return values.
Use relatable real-world scenarios like manufacturing, cooking recipes, ordering products, or assembling items — where functions act like machines that take inputs and produce outputs.`;
      }

      const systemPrompt = `You are a programming teacher creating practice questions for beginners learning JavaScript.
Your questions should be educational, clear, and at an introductory level.

You MUST respond with valid JSON matching this exact format:
{
  "questions": [
    {
      "id": 1,
      "code": "the code snippet as a string",
      "question": "the question about the code",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "a clear explanation of why the answer is correct",
      "hint": "a brief hint to nudge the student in the right direction without giving away the answer"
    }
  ]
}

Rules:
- Each question must have exactly 4 options
- correctIndex is 0-based (0 for first option, 1 for second, etc.)
- Code snippets should be simple (3-8 lines), using let/const for variables
- Explanations should walk through the logic step by step in a friendly way
- Hints should give a gentle nudge without revealing the answer directly
- Vary the correct answer positions across questions (don't always make it option B)
- Make wrong answers plausible but clearly incorrect when you trace through the code
- Do NOT use functions that need to be defined elsewhere unless the question is about which function gets called`;

      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: topicPrompt },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const parsed = JSON.parse(content);

      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        return res.status(500).json({ error: "Invalid question format from AI" });
      }

      const validQuestions = parsed.questions.filter((q: any) =>
        q.code && q.question && Array.isArray(q.options) && q.options.length === 4 &&
        typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 && q.explanation
      );

      if (validQuestions.length === 0) {
        return res.status(500).json({ error: "No valid questions generated" });
      }

      const normalizedQuestions = validQuestions.map((q: any, i: number) => ({
        id: i + 1,
        code: String(q.code),
        question: String(q.question),
        options: q.options.map(String),
        correctIndex: q.correctIndex,
        explanation: String(q.explanation),
        hint: String(q.hint || "Try tracing through the code step by step."),
      }));

      res.json({ questions: normalizedQuestions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  return httpServer;
}
