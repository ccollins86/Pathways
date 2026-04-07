import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  progress: jsonb("progress").notNull().$type<UserProgressData>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const progressDataSchema = z.object({
  totalScore: z.number(),
  firstTryCount: z.number(),
  currentWorld: z.enum(["town", "ocean", "factory", "psychic"]),

  townQuestCompleted: z.boolean(),
  townDisaster: z.string().nullable(),
  townKnownDisaster: z.string().nullable(),
  townPracticeCompleted: z.boolean(),
  townPortalActive: z.boolean(),
  townQuestBonusAwarded: z.boolean(),
  townWorldBonusAwarded: z.boolean(),

  oceanQuestCompleted: z.boolean(),
  oceanCleanupQuestCompleted: z.boolean(),
  oceanLessonPhase: z.number(),
  oceanPracticeCompleted: z.boolean(),
  oceanPortalActive: z.boolean(),
  oceanQuestBonusAwarded: z.boolean(),
  oceanWorldBonusAwarded: z.boolean(),

  factoryQuestStarted: z.boolean(),
  factoryOrderComplete: z.boolean(),
  factoryLessonPhase: z.number(),
  factoryPracticeCompleted: z.boolean(),
  factoryPortalActive: z.boolean(),
  factoryQuestBonusAwarded: z.boolean(),
  factoryWorldBonusAwarded: z.boolean(),
  factoryStagePointsAwarded: z.array(z.string()),

  psychicRound: z.number(),
  psychicPracticeCompleted: z.boolean(),
  psychicWorldBonusAwarded: z.boolean(),
});

export type UserProgressData = z.infer<typeof progressDataSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
