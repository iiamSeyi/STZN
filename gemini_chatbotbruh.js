import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

// Use the PaLM 2 Chat (Legacy) endpoint
const CHAT_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage';
const CHAT_API_URL = `${CHAT_BASE_URL}?key=${API_KEY}`;

const headers = {
  'Content-Type': 'application/json',
};

// Function for chat generation using the PaLM 2 Chat (Legacy) model
export async function chatWithGemini(prompt) {
  try {
    // The correct payload now wraps the prompt string inside a "prompt" object
    // which has a "messages" field (an array of messages).
    // Each message must include an "author" and a scalar "content" string.
    const requestBody = {
      prompt: {
        messages: [
          {
            author: "user",
            content: prompt
          }
        ]
      }
    };

    const response = await axios.post(CHAT_API_URL, requestBody, { headers });
    const data = response.data;

    // According to the official documentation for the legacy PaLM 2 Chat API,
    // the generated answer is returned inside the candidates array:
    // { candidates: [ { message: { content: { text: "Your generated response" } } } ] }
    const generated =
      data.candidates?.[0]?.message?.content?.text?.trim() || '';
    return generated;
  } catch (error) {
    console.error(
      "Error interacting with the PaLM 2 Chat API:",
      error.response?.data || error.message
    );
    return "Sorry, I couldn't generate a response.";
  }
}
