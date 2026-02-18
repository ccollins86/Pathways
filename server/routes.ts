import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

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

  return httpServer;
}
