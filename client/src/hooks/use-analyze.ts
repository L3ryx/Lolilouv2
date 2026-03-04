import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { type AnalysisResult } from "@shared/schema";

export function useAnalyzeImages() {
  return useMutation<AnalysisResult[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        body: formData,
        // Omit Content-Type header so the browser sets it to multipart/form-data with the correct boundary
      });

      if (!res.ok) {
        // Try to parse structured error first
        try {
          const errorData = await res.json();
          const parsedError = api.analyze.responses[400].safeParse(errorData) 
                           || api.analyze.responses[500].safeParse(errorData);
                           
          if (parsedError.success && 'message' in parsedError.data) {
             throw new Error(parsedError.data.message);
          }
        } catch (e) {
          // Fallback to text if JSON parsing fails
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") throw e;
          const text = await res.text();
          throw new Error(text || "An unexpected error occurred during analysis.");
        }
      }

      const data = await res.json();
      
      // Parse using Zod schema defined in routes
      const result = api.analyze.responses[200].safeParse(data);
      if (!result.success) {
        console.error("[Zod] Analysis response validation failed:", result.error.format());
        throw new Error("Invalid response format from server");
      }
      
      return result.data;
    },
  });
}
