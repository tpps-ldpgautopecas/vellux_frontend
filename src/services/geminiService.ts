/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getServiceAdvice(serviceDetails: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um consultor técnico sênior da Vellux Motors, uma oficina de luxo. 
      Analise os seguintes detalhes do serviço e forneça uma breve recomendação técnica e uma estimativa de atenção necessária (baixa, média, alta).
      Retorne em JSON.
      
      Detalhes: ${serviceDetails}`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting AI advice:", error);
    return null;
  }
}
