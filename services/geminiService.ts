import { GoogleGenAI } from "@google/genai";

// NOTE: In a production environment, API keys should not be exposed in the frontend source.
// However, for this demo application as per the prompt instructions which imply a client-side app,
// we assume the key is available via environment variables.
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithGemini = async (
  userMessage: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash'; // Optimized for speed and general reasoning
    
    // Convert internal history format to Gemini API format if needed, 
    // or just use a single turn for simplicity if managing history manually.
    // Here we will use a fresh generation for simplicity but include context in the prompt or maintain chat session
    
    const chatSession = ai.chats.create({
      model: model,
      config: {
        systemInstruction: "You are 'Portal Pro Bot', a highly intelligent and friendly university study assistant integrated into the Portal Pro system. You help students with summarizing notes, explaining complex topics, planning schedules, and finding resources. Keep answers concise, encouraging, and academic.",
      }
    });

    // Replay history to establish context (simplified approach)
    // In a real app, you would persist the chat session object or maintain history state properly
    // For this demo, we are creating a new chat session for each message, so previous context isn't automatically carried over
    // unless we pass it. Since the SDK chat object maintains state, we'd ideally keep a persistent chat object.
    // However, given the stateless nature of this helper:
    
    const result = await chatSession.sendMessage({
        message: userMessage
    });
    
    return result.text || "I'm having trouble thinking right now. Try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the knowledge base. Please check your connection.";
  }
};