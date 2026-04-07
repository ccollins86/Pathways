import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import path from "path";
import { generateQuestions } from "./questionGenerator";
import { storage } from "./storage";
import { progressDataSchema } from "@shared/schema";

const VALID_WORLD_IDS = new Set(["town", "town-lesson", "factory", "ocean", "psychic"]);
const MAX_QUESTION_COUNT = 12;
const MIN_QUESTION_COUNT = 1;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitMap = new Map<number, { count: number; resetAt: number }>();

function isRateLimited(userId: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

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

  app.post("/api/generate-questions", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (isRateLimited(req.session.userId)) {
        return res.status(429).json({ error: "Too many requests" });
      }
      const { worldId, count } = req.body;
      if (!worldId || typeof worldId !== "string") {
        return res.status(400).json({ error: "worldId is required" });
      }
      if (!VALID_WORLD_IDS.has(worldId)) {
        return res.status(400).json({ error: "Invalid worldId" });
      }
      const clampedCount = Math.max(
        MIN_QUESTION_COUNT,
        Math.min(MAX_QUESTION_COUNT, typeof count === "number" ? Math.floor(count) : 8)
      );
      const questions = await generateQuestions(worldId, clampedCount);
      res.json({ questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  app.get("/api/progress", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const progress = await storage.getProgress(req.session.userId);
      return res.json({ progress });
    } catch (error) {
      console.error("Error loading progress:", error);
      return res.status(500).json({ error: "Failed to load progress" });
    }
  });

  app.delete("/api/progress", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      await storage.deleteProgress(req.session.userId);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting progress:", error);
      return res.status(500).json({ error: "Failed to delete progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const parsed = progressDataSchema.safeParse(req.body.progress);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid progress data", details: parsed.error.issues });
      }
      await storage.saveProgress(req.session.userId, parsed.data);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error saving progress:", error);
      return res.status(500).json({ error: "Failed to save progress" });
    }
  });

  return httpServer;
}
