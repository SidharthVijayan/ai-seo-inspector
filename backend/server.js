import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const { content, title } = req.body;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: `
You are an expert SEO + AI visibility analyst.

Give:
1. SEO Issues
2. AI Visibility Improvements
3. Content Weaknesses
4. Suggested Meta Title, Description, H1
5. SEO Score (0-100)
6. AI Visibility Score (0-100)

Title: ${title}

Content:
${content}
`,
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      result: data.response || "No response from Ollama"
    });

  } catch (err) {
    res.json({
      result: "Server Error: " + err.message
    });
  }
});

app.listen(3000, "127.0.0.1", () => {
  console.log("✅ Backend running at http://127.0.0.1:3000");
});
