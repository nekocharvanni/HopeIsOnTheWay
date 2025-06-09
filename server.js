const express = require("express");
const cors = require("cors");
const app = express();

// ✅ METHOD 1: Use the cors middleware (most reliable)
const corsOptions = {
  origin: "*", // Allow all origins for testing
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: false
};

app.use(cors(corsOptions));

// ✅ METHOD 2: Manual CORS headers as backup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Max-Age", "3600");
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    console.log("OPTIONS preflight request handled");
    return res.status(204).send();
  }
  
  next();
});

// ✅ Parse JSON
app.use(express.json());

// ✅ Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  next();
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  console.log("Health check requested");
  
  // Ensure CORS headers are set
  res.header("Access-Control-Allow-Origin", "*");
  
  res.json({ 
    message: "HopeBot backend is working!",
    timestamp: new Date().toISOString(),
    status: "online",
    cors: "enabled"
  });
});

// ✅ Chat endpoint
app.post("/api/chat", (req, res) => {
  console.log("Chat request received:", req.body);
  
  // Ensure CORS headers are set
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  
  const message = req.body?.message || "";
  
  // Simple responses for testing
  const responses = {
    "hello": "Hello! I'm HopeBot. I'm here to help you with housing, jobs, and support.",
    "housing": "I can help you find housing resources. Contact 211 for immediate assistance.",
    "job": "I can help with job searching and resume building. What specific help do you need?",
    "test": "Test successful! CORS is working properly.",
    "default": "I'm here to help! I can assist with housing, job search, and emotional support."
  };
  
  let reply = responses.default;
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    reply = responses.hello;
  } else if (lowerMessage.includes("housing")) {
    reply = responses.housing;
  } else if (lowerMessage.includes("job")) {
    reply = responses.job;
  } else if (lowerMessage.includes("test")) {
    reply = responses.test;
  }
  
  console.log("Sending reply:", reply);
  res.json({ reply });
});

// ✅ Catch all OPTIONS requests
app.options("*", (req, res) => {
  console.log("Catch-all OPTIONS request");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).send();
});

// ✅ 404 handler
app.use((req, res) => {
  console.log("404 - Route not found:", req.path);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(404).json({ error: "Endpoint not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HopeBot backend running on port ${PORT}`);
  console.log(`📍 Server accessible at: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled with multiple methods`);
  console.log(`🌐 Accepting requests from all origins`);
});
