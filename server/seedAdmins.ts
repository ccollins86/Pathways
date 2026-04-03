import bcrypt from "bcrypt";
import { storage } from "./storage";
import { ADMIN_USERNAMES } from "../shared/adminUsers";

const ADMIN_DEFAULT_PASSWORD = "admin123";

export async function seedAdminAccounts() {
  for (const username of ADMIN_USERNAMES) {
    try {
      const existing = await storage.getUserByUsername(username);
      if (existing) continue;

      const hashedPassword = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 10);
      await storage.createUser({ username, password: hashedPassword });
      console.log(`[Seed] Created admin account: ${username}`);
    } catch (err: any) {
      if (err?.code === "23505") continue;
      console.error(`[Seed] Failed to create admin account "${username}":`, err);
    }
  }
}
