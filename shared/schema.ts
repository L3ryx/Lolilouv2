import { z } from "zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Simple table to log searches (optional, but good for tracking)
export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analysisResultSchema = z.object({
  originalImage: z.string(),
  aliexpressLinks: z.array(z.string()),
  error: z.string().optional()
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;