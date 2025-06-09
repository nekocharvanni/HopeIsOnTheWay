const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// ✅ Fixed CORS configuration
const corsOptions = {
  origin: ["https://hopefront.netlify.app", "http://localhost:3000", "http://127.0.0.1:5500"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
};

// ✅ Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// ✅ Add middleware to parse JSON
app.use(express.json());

// ✅ Add a simple test endpoint
app.get("/", (req, res) => {
  res.json({ message: "HopeBot backend is running!" });
});

// ✅ Main chat endpoint with better error handling
app.post("/api/chat", async (req, res) => {
  // Add CORS headers explicitly
  res.header("Access-Control-Allow-Origin", "https://hopefront.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const userMessage = req.body.message;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Received message:", userMessage);
    
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed from gpt-4 to gpt-3.5-turbo (more reliable and cheaper)
      messages: [
        {
          role: "system",
          content:
            "You are HopeBot, a supportive AI helping unhoused people find housing, build resumes, access emotional support, and develop life skills. Be warm, non-judgmental, and encouraging. Keep responses helpful but concise.",
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0].message.content;
    console.log("Generated reply:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    
    // Better error handling
    if (error.code === 'insufficient_quota') {
      res.status(500).json({ 
        error: "I'm having trouble connecting to my AI service. Please try again later." 
      });
    } else if (error.code === 'invalid_api_key') {
      res.status(500).json({ 
        error: "Configuration error. Please contact support." 
      });
    } else {
      res.status(500).json({ 
        error: "I'm having trouble generating a response. Please try again." 
      });
    }
  }
});

// ✅ Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HopeBot backend running on port ${PORT}`);
  console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
