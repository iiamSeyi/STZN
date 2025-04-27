import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatWithGemini } from './gemini_chatbotbruh.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/gemini', async (req, res) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }
  const conversationHistory = history || []; // Optional conversation history
  const answer = await chatWithGemini(prompt, conversationHistory);
  res.json({ answer });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homework_chatbot.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});