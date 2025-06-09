const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

const corsOptions = {
  origin: "https://hopefront.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));                  // ✅ Enable CORS
app.options("*", cors(corsOptions));         // ✅ Handle preflight

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are HopeBot, a supportive AI helping unhoused people...",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.setHeader("Access-Control-Allow-Origin", "ht
