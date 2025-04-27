import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

// Legacy PaLM-2 Chat endpoint for chat-bison-001
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage?key=${API_KEY}`;

const headers = { 'Content-Type': 'application/json' };

export async function chatWithGemini(prompt) {
  try {
    // For the legacy model, the prompt is a simple scalar string.
    const requestBody = {
      prompt: prompt,
      temperature: 0.7,
      candidateCount: 1
    };

    const res = await axios.post(API_URL, requestBody, { headers });
    // According to documentation, the generated response is returned as:
    // { candidates: [ { message: { content: { text: "Generated response" } } } ] }
    return res.data.candidates?.[0]?.message?.content?.text?.trim() || '';
  } catch (err) {
    console.error(
      'Error interacting with PaLM-2 Chat API:',
      err.response?.data || err.message
    );
    return "Sorry, I couldn't generate a response.";
  }
}


