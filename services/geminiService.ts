
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async breakDownTask(goal: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um assistente cognitivo empático para pessoas com TDAH. 
                 Divida o seguinte objetivo em exatamente 3 a 5 micro-passos ridiculamente simples, 
                 concretos e não intimidantes. Use uma linguagem acolhedora.
                 Objetivo: "${goal}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.STRING, description: 'O micro-passo concreto' }
            },
            required: ['step']
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return [];
    }
  },

  async organizeThoughts(thoughts: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário com TDAH escreveu este fluxo de consciência caótico. 
                 Organize-o em um resumo curto (máximo 3 frases) e uma lista de 3 pontos-chave ou sentimentos identificados. 
                 Seja gentil e não julgue.
                 Texto: "${thoughts}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['summary', 'keyPoints']
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse thoughts", e);
      return null;
    }
  }
};
