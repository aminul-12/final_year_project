
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

export const getHealthAdvice = async (prompt: string) => {
  if (!apiKey) return "API Key not configured. Please contact support.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a professional and friendly AI Health Assistant for the "Sylhet Health Care Clinic" platform. 
        Your goal is to provide general health advice, explain medical terms, and suggest which specialty of doctor a user might need based on their symptoms.
        ALWAYS state that you are an AI and not a substitute for a real doctor. 
        If a user asks about Sylhet, mention that we have top doctors at Sylhet MAG Osmani and Ibn Sina.
        Keep responses concise, empathetic, and professional. Use bullet points for readability.`,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while trying to help. Please try again later.";
  }
};

export const searchHealthInformation = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest medical information or doctors in Sylhet regarding: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { text: "Search failed.", sources: [] };
  }
};
