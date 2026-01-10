// src/services/geminiService.ts
import { sendChatMessage } from "./api"; // Secure backend call

interface ChatMessage {
  sender: "user" | "model";
  text: string;
}

// -------------------------------------------
// MAIN CHATBOT FUNCTION (SECURE)
// -------------------------------------------
export const getChatbotResponse = async (
  history: ChatMessage[]
): Promise<string> => {
  try {
    const lastUserMessage = history[history.length - 1].text;
    const reply = await sendChatMessage(lastUserMessage);
    return reply;
  } catch (error) {
    console.error("Chat Error:", error);
    return "System busy. Please try again later.";
  }
};
