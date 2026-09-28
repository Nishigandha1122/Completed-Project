import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export async function detectCropDisease(base64Image: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this crop leaf image. Identification should include:
  1. Disease Name (or "Healthy" if no disease)
  2. Confidence level (0-100)
  3. Status (Diseased/Healthy)
  4. Detailed Treatment recommendations in Markdown.
  
  Format the output as JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          status: { type: Type.STRING },
          treatment: { type: Type.STRING }
        },
        required: ["diseaseName", "confidence", "status", "treatment"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getFarmerAssistantResponse(userMessage: string, history: { role: 'user' | 'model', text: string }[] = []) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a helpful and expert agricultural assistant. 
  You provide clear, practical advice to farmers about crop management, pests, irrigation, and soil health. 
  Keep responses concise and supportive. Use Markdown for formatting.`;

  const chat = ai.chats.create({
    model,
    config: { systemInstruction }
  });

  // Reconstruct history if provided
  // Note: SDK handle history internally if using chat session
  
  const response = await chat.sendMessage({
    message: userMessage
  });

  return response.text;
}
