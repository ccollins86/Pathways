import { users, userProgress, type User, type InsertUser, type UserProgressData } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProgress(userId: number): Promise<UserProgressData | null>;
  saveProgress(userId: number, progress: UserProgressData): Promise<void>;
  deleteProgress(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProgress(userId: number): Promise<UserProgressData | null> {
    const [row] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    if (!row) return null;
    return row.progress;
  }

  async saveProgress(userId: number, progress: UserProgressData): Promise<void> {
    await db.insert(userProgress)
      .values({ userId, progress })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: { progress, updatedAt: new Date() },
      });
  }

  async deleteProgress(userId: number): Promise<void> {
    await db.delete(userProgress).where(eq(userProgress.userId, userId));
  }
}

export const storage = new DatabaseStorage();
