import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Cache for simulated "massive" library
// In a real world, this would be a real DB. 
// Here we use Gemini to simulate searching 15M/7M records by asking it to provide 
// results from its internal knowledge that could exist in such a library.

app.post("/api/search", async (req, res) => {
  const { query, type } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for ${type} related to "${query}". 
      Simulate a database of 15 million books and 7 million movies. 
      Provide 6-8 highly relevant ${type} results. 
      Return JSON with an array of objects: { title: string, year: string, description: string, genre: string, rating: number }.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  year: { type: Type.STRING },
                  description: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  rating: { type: Type.NUMBER }
                },
                required: ["title", "year", "description", "genre", "rating"]
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.post("/api/list", async (req, res) => {
  const { type } = req.body;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a curated high-tech sci-fi "Featured" list of ${type} from our simulated 15M books / 7M movies library. 
      Provide 10 interesting ${type}. 
      Return JSON with an array of objects: { title: string, year: string, description: string, genre: string, rating: number }.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  year: { type: Type.STRING },
                  description: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  rating: { type: Type.NUMBER }
                },
                required: ["title", "year", "description", "genre", "rating"]
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("List error:", error);
    res.status(500).json({ error: "Failed to fetch list" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
