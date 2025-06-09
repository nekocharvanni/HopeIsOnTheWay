const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// ✅ Allow requests from your Netlify frontend
const corsOptions = {
  origin: "https://hopefront.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.json());

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

    // ✅ Ensure CORS header is returned in response
    res.setHeader("Access-Control-Allow-Origin", "https://hopefront.netlify.app");

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Something went wrong while generating a reply." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HopeBot backend running on port ${PORT}`));
