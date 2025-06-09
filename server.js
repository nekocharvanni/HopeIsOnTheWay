const express = require("express");
const app = express();

// ✅ SUPER SIMPLE CORS - Works with everything
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// ✅ Handle preflight OPTIONS requests
app.options("*", (req, res) => {
  res.status(204).send();
});

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Test endpoint - shows backend is working
app.get("/", (req, res) => {
  res.json({ 
    message: "HopeBot backend is working!",
    timestamp: new Date().toISOString(),
    status: "online"
  });
});

// ✅ Simple chat endpoint (no OpenAI for now - just testing)
app.post("/api/chat", (req, res) => {
  console.log("Chat request received:", req.body);
  
  const message = req.body?.message || "";
  
  // Simple predefined responses to test the connection
  const responses = {
    "hello": "Hello! I'm HopeBot. I'm here to help you with housing, jobs, and support. How can I assist you today?",
    "housing": "I can help you find housing resources. Here are some immediate steps:\n• Call 211 for local emergency housing\n• Contact local homeless shelters\n• Look into transitional housing programs\n• Check with your city's housing authority",
    "job": "I can help with job searching and resume building. What specific help do you need?\n• Resume writing and formatting\n• Job search strategies\n• Interview preparation\n• Finding local employment resources",
    "resume": "I'd be happy to help you build a resume! Even if you don't have traditional work experience, we can include:\n• Volunteer work\n• Skills you've learned\n• Any informal jobs or gigs\n• Education or training\nWhat experience do you have that we can highlight?",
    "default": "I'm here to help! I can assist with:\n• Finding housing resources\n• Job search and resume help\n• Emotional support and encouragement\n• Connecting you with local services\n\nWhat would be most helpful for you right now?"
  };
  
  // Simple keyword matching for responses
  let reply = responses.default;
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    reply = responses.hello;
  } else if (lowerMessage.includes("housing") || lowerMessage.includes("home") || lowerMessage.includes("shelter")) {
    reply = responses.housing;
  } else if (lowerMessage.includes("job") || lowerMessage.includes("work") || lowerMessage.includes("employment")) {
    reply = responses.job;
  } else if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
    reply = responses.resume;
  }
  
  console.log("Sending reply:", reply);
  res.json({ reply });
});

// ✅ 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HopeBot backend running on port ${PORT}`);
  console.log(`📍 Server accessible at: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for all origins`);
});
