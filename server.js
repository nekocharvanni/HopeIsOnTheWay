const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves index.html, etc.

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are HopeBot, a kind, supportive chatbot that helps unhoused individuals find resources, comfort, and practical help. Keep answers compassionate and clear." },
        { role: "user", content: userMessage },
      ],
    });

    const botResponse = completion.data.choices[0].message.content;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HopeBot backend running on port ${PORT}`));
