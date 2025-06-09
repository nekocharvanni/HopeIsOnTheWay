const express = require("express");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

// ✅ CRITICAL: Add CORS middleware BEFORE anything else (Render-specific fix)
app.use((req, res, next) => {
  // Set CORS headers for ALL responses (including errors)
  res.setHeader("Access-Control-Allow-Origin", "https://hopefront.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Access-Control-Max-Age", "7200");
  
  next();
});

// ✅ Handle preflight OPTIONS requests BEFORE other routes (Render-specific)
app.options("*", (req, res) => {
  console.log("Preflight OPTIONS request received");
  res.status(204).send(); // 204 No Content (not 200)
});

// ✅ Add JSON parsing middleware
app.use(express.json());

// ✅ Initialize OpenAI (with error handling)
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not found in environment variables");
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("✅ OpenAI initialized successfully");
  }
} catch (error) {
  console.error("❌ Failed to initialize OpenAI:", error.message);
}

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "HopeBot backend is running!",
    timestamp: new Date().toISOString(),
    openai_configured: !!openai
  });
});

// ✅ Main chat endpoint with robust error handling
app.post("/api/chat", async (req, res) => {
  console.log("🔥 Chat request received:", req.body);
  
  try {
    // Validate request
    if (!req.body || !req.body.message) {
      console.log("❌ No message in request body");
      return res.status(400).json({ error: "Message is required" });
    }

    const userMessage = req.body.message.trim();
    if (userMessage === "") {
      console.log("❌ Empty message");
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Check if OpenAI is configured
    if (!openai) {
      console.log("❌ OpenAI not configured");
      return res.status(500).json({ 
        error: "AI service is not configured. Please contact support." 
      });
    }

    console.log(`📝 Processing message: "${userMessage}"`);

    // Call OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are HopeBot, a supportive AI helping unhoused people find housing, build resumes, access emotional support, and develop life skills. Be warm, non-judgmental, and encouraging. Keep responses helpful but concise (under 200 words)."
        },
        { 
          role: "user", 
          content: userMessage 
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0].message.content;
    console.log(`✅ Generated reply: "${reply.substring(0, 50)}..."`);

    // Return successful response
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in /api/chat:", error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(500).json({ 
        error: "I'm temporarily unavailable due to high demand. Please try again in a few minutes." 
      });
    } 
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ 
        error: "Service configuration error. Please contact support." 
      });
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: "I'm receiving many requests right now. Please wait a moment and try again." 
      });
    }
    
    // Generic error
    return res.status(500).json({ 
      error: "I'm having trouble right now. Please try again in a moment." 
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ✅ Global error handler (CRITICAL for Render CORS)
app.use((err, req, res, next) => {
  console.error("💥 Global error handler:", err);
  
  // Ensure CORS headers are set even for errors
  res.setHeader("Access-Control-Allow-Origin", "https://hopefront.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HopeBot backend running on port ${PORT}`);
  console.log(`🔑 OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌐 Accepting requests from: https://hopefront.netlify.app`);
});
