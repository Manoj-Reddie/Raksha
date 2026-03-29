import { toast } from "sonner";
import axios from "axios";

const GEMINI_API = process.env.NEXT_PUBLIC_GEMINI_API_KEY;


const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

const MODEL = "gemini-3.1-flash-lite-preview"; 

const fetchGeminiResponse = async (prompt, apikey) => {
  if (!apikey) {
    toast.error("API key is not configured");
    throw new Error("Missing API key");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/models/${MODEL}:generateContent?key=${apikey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Invalid API response");

    return text;
  } catch (e) {
    const errorMsg = e.response?.data?.error?.message || e.message;
    
    // Custom handling for the "High Demand" error
    if (e.response?.status === 503) {
      toast.error("Servers are busy. Retrying with Lite model...");
    } else {
      toast.error(errorMsg);
    }
    
    throw e;
  }
};

// 🔹 Chatbot Logic
const chatbot = async (question, conversationHistory = []) => {
  const historyText = conversationHistory
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are a legal advice chatbot for women in India. 
History: ${historyText}
User: ${question}
Response: Acknowledge, Advice, and one follow-up.`;

  return fetchGeminiResponse(prompt, GEMINI_API);
};

export default chatbot;