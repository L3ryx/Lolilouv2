import { z } from "zod";
import { analysisResultSchema } from "./schema";

export const api = {
  analyze: {
    path: "/api/analyze" as const,
    method: "POST" as const,
    // File uploads use multipart/form-data, so no JSON input schema needed here
    responses: {
      200: z.array(analysisResultSchema),
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
