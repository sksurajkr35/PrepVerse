import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Initialize Gemini API client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return null;
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Mentor Gemini API route
  app.post("/api/ai-mentor", async (req, res) => {
    try {
      const { prompt, systemInstruction, history } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        return res.json({
          response: `[PrepVerse AI Demo Response]\n\nGreat question regarding "${prompt.slice(0, 50)}..."!\n\nHere is a quick structured breakdown:\n1. **Core Concept**: Focus on breaking down the problem into sub-problems (time/space efficiency).\n2. **Optimal Approach**: For DSA, analyze time complexity (O(N) vs O(N log N)) and edge cases.\n3. **Next Steps**: Try implementing this in Code Arena and run test cases.\n\n*(Connect your GEMINI_API_KEY in secrets to get live Gemini 2.5 Flash responses!)*`
        });
      }

      const model = "gemini-2.5-flash";
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const h of history) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }]
          });
        }
      }
      contents.push({ role: "user", parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemInstruction || "You are PrepVerse AI Mentor, an expert computer science and placement preparation mentor for engineering students. You help with DSA, Aptitude, Core CS (DBMS, OS, CN, OOP), System Design, and HR interview prep. Provide concise, clear, structured responses with code snippets when needed."
        }
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Gemini AI API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // Mock Compiler Execution Endpoint (Ready for Judge0 / Piston)
  app.post("/api/compiler/run", (req, res) => {
    const { language, code, customInput } = req.body;
    
    // Simulate compilation delay
    setTimeout(() => {
      // Basic mock evaluation logic
      const isSyntaxError = code.includes("syntax_error_test");
      if (isSyntaxError) {
        return res.json({
          status: "Compilation Error",
          output: "Line 12: error: expected ';' before '}' token",
          executionTime: "18 ms",
          memory: "4.2 MB",
          passedCases: 0,
          totalCases: 3
        });
      }

      res.json({
        status: "Accepted",
        output: customInput ? `Output for input: [${customInput}]\nResult: Success` : "Test Case 1: PASSED (0ms)\nTest Case 2: PASSED (2ms)\nTest Case 3: PASSED (1ms)\n\nAll test cases matched expected output!",
        executionTime: `${Math.floor(Math.random() * 25) + 12} ms`,
        memory: `${(Math.random() * 4 + 10).toFixed(1)} MB`,
        passedCases: 3,
        totalCases: 3
      });
    }, 600);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PrepVerse full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
