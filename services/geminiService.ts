import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// Note: In a production app, handle the missing key more gracefully in the UI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStockAnalysis = async (symbol: string, companyName: string, price: number) => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini. Returning mock data.");
    return {
      summary: "API Key missing. This is a simulated AI analysis demonstrating how the system would analyze market trends, financial statements, and recent news to provide a comprehensive outlook.",
      bull_case: "Strong market position.",
      bear_case: "Potential regulatory headwinds.",
      outlook: "Neutral"
    };
  }

  try {
    const prompt = `
      Analyze the stock ${companyName} (${symbol}) which is currently trading at ${price}.
      Provide a concise financial analysis.
      
      Return a JSON object with:
      - summary: A 2-sentence summary of the company's current status.
      - bull_case: One key reason to buy.
      - bear_case: One key risk factor.
      - outlook: One word (Bullish, Bearish, or Neutral).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            bull_case: { type: Type.STRING },
            bear_case: { type: Type.STRING },
            outlook: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "AI analysis currently unavailable. Please try again later.",
      bull_case: "N/A",
      bear_case: "N/A",
      outlook: "Neutral"
    };
  }
};

export const getExpertScoreAnalysis = async (symbol: string, model: 'Buffett' | 'Graham' | 'Lynch') => {
    // This function would ideally analyze specific financial ratios against the expert's philosophy
    // Simulating a quick insight for now
    if (!process.env.API_KEY) return `Simulated reasoning for ${model} model regarding ${symbol}.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Explain in one sentence why a ${model} investing strategy might rate ${symbol} highly or poorly based on general market knowledge.`
        });
        return response.text || "Analysis unavailable.";
    } catch (e) {
        return "Analysis unavailable.";
    }
}