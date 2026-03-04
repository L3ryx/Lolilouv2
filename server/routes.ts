import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import axios from "axios";
import path from "path";
import fs from "fs";
import express from "express";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: diskStorage });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve the uploads directory statically so Zenserp can access the images
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.post(api.analyze.path, upload.array("images", 10), async (req, res) => {
    try {
      if (!req.files || (req.files as any[]).length === 0) {
        return res.status(400).json({ message: "No images provided" });
      }

      const files = req.files as Express.Multer.File[];
      const results = [];

      for (const file of files) {
        // Construct the public URL of the uploaded image
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.get("host");
        const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;
        
        // Log the search to the database
        await storage.logSearch(imageUrl);

        try {
          const apiKey = process.env.ZENSERP_API_KEY;
          if (!apiKey) {
             results.push({
               originalImage: imageUrl,
               aliexpressLinks: [],
               error: "La variable ZENSERP_API_KEY n'est pas configurée."
             });
             continue;
          }

          // Call Zenserp API for reverse image search
          const zenserpResponse = await axios.get("https://app.zenserp.com/api/v2/search", {
            params: {
              apikey: apiKey,
              search_engine: "google_reverse_image",
              image_url: imageUrl,
            }
          });

          // Extract AliExpress links from the results
          const inlineImages = zenserpResponse.data.inline_images || [];
          const organic = zenserpResponse.data.organic || [];
          const allResults = [...inlineImages, ...organic];
          
          const aliexpressLinks = allResults
            .filter((item: any) => item.url && item.url.includes("aliexpress.com"))
            .map((item: any) => item.url);

          results.push({
            originalImage: imageUrl,
            aliexpressLinks: [...new Set(aliexpressLinks)] // Deduplicate links
          });

        } catch (error: any) {
          console.error("Zenserp API Error:", error.response?.data || error.message);
          results.push({
            originalImage: imageUrl,
            aliexpressLinks: [],
            error: "Erreur lors de l'analyse avec Zenserp."
          });
        }
      }

      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
