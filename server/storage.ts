import { db } from "./db";
import { searches } from "@shared/schema";

export interface IStorage {
  logSearch(imageUrl: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async logSearch(imageUrl: string): Promise<void> {
    await db.insert(searches).values({ imageUrl });
  }
}

export const storage = new DatabaseStorage();
