import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Thêm thư viện fetch
import { readFileSync } from "fs";
import type { Request, Response } from "express";

dotenv.config();

// Load JSON files
const vi = JSON.parse(readFileSync("./src/locales/vi.json", "utf8"));
const en = JSON.parse(readFileSync("./src/locales/en.json", "utf8"));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const { lang } = req.query;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt là bắt buộc" });
  }

  // Chọn ngôn ngữ (mặc định là tiếng Việt)
  const locale = lang === "en" ? "en" : "vi";
  const systemPrompt =
    locale === "en" ? en.system_prompt_flashduo : vi.system_prompt_flashduo;

  const finalPrompt = `${systemPrompt}\n\n${prompt}`;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ message: "Thiếu API Key của Gemini" });
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ message: errorText });
    }

    const result = await response.json();
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://192.168.34.101:${PORT}`);
});
