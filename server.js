const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are HopeBot, a supportive AI helping unhoused people find housing, build resumes, access emotional support, and develop life skills. Be warm, non-judgmental, and encouraging.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong while generating a reply." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HopeBot backend running on port ${PORT}`));
