import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import path from "path";
import { generateQuestions, isValidTopic, isLLMAvailable } from "./questionGenerator";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  app.get("/api/download-template", (_req, res) => {
    const zipPath = path.resolve("client/public/game-template.zip");
    res.download(zipPath, "game-template.zip");
  });

  app.get("/api/download-full-project", (_req, res) => {
    const zipPath = path.resolve("client/public/full-project.zip");
    res.download(zipPath, "disaster-prep-quest.zip");
  });

  app.get("/api/llm-status", (_req, res) => {
    res.json({ available: isLLMAvailable() });
  });

  app.get("/api/generate-questions/:topic", async (req, res) => {
    const { topic } = req.params;
    if (!isValidTopic(topic)) {
      return res.status(400).json({ error: `Invalid topic. Valid topics: conditionals, loops, functions, disaster_lesson` });
    }
    if (!isLLMAvailable()) {
      return res.status(503).json({ error: "LLM API not configured", unavailable: true });
    }
    try {
      const questions = await generateQuestions(topic);
      res.json({ questions });
    } catch (error: any) {
      res.status(502).json({ error: "Failed to generate questions. Please try again." });
    }
  });

  return httpServer;
}
