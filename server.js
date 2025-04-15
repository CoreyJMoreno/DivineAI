const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const prompts = require("./src/prompts");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

const systemMessage = {
    role: "system",
    content: prompts.system_message
  };

  app.post("/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const updatedMessages = [systemMessage, ...messages];  // Add system message only on the backend
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: updatedMessages,
        temperature: 0.3,
        max_tokens: 500,
      });
  
      res.json({ response: completion.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: "AI service unavailable. Try again later." });
    }
  });
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));