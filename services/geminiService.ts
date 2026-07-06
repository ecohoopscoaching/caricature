
import { GoogleGenAI } from "@google/genai";
import { CaricatureStyle } from "../types";
import { STYLE_CONFIGS } from "../constants";

export class GeminiService {
  async generateCaricature(base64Image: string, style: CaricatureStyle): Promise<string> {
    const config = STYLE_CONFIGS[style];
    
    // Create a new instance right before the call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // We upgrade to gemini-3-pro-image-preview for high-quality image generation/editing
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove the data:image/png;base64, prefix
              mimeType: 'image/png',
            },
          },
          {
            text: config.prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from Gemini.");
  }
}

export const geminiService = new GeminiService();
