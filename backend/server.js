import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

app.post("/analyze", async (req, res) => {
  try {
    const { content, title } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO, AI visibility, and content strategist."
          },
          {
            role: "user",
            content: `
Analyze this page and give structured output:

1. SEO issues
2. AI/LLM visibility improvements
3. Content weaknesses
4. Suggested rewrite for:
   - Meta Title
   - Meta Description
   - H1
5. Give score (0-100):
   - SEO Score
   - AI Visibility Score

Title: ${title}

Content:
${content}
`
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
