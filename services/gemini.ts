import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Recommendation } from "../types";

// Helper to get API key
const getApiKey = (): string => {
  // Using the provided API key for the buildathon/demo submission
  return "AIzaSyC53f8cJvDrN9e4sFilOJss79JhEQY2Xps";
};

const SYSTEM_INSTRUCTION = `
You are a ruthless, world-class Venture Capital Analyst and Startup Mentor.
Your goal is to validate startup ideas with brutal honesty using real-time market data.

Role:
- Act as a senior partner at a top-tier VC firm.
- Validate claims using Google Search.
- Your job is to save founders from wasting years of their lives on bad ideas.

Input:
- A startup pitch or idea.

Output Format:
You MUST respond with a valid, raw JSON object. Do not include markdown formatting (like \`\`\`json). 
The JSON must have the following structure:

{
  "marketRealismScore": number (0-100),
  "scoreJustification": "string",
  "coreAssumptions": ["string", "string"],
  "redFlags": ["string", "string"],
  "competitors": ["string", "string"],
  "pivotSuggestions": ["string", "string"],
  "recommendation": "GO" | "ITERATE" | "NO-GO",
  "reasoning": "string",
  "executionPlan": {
    "techStackRecommendation": "string (brief)",
    "mvpFeatures": ["string", "string"],
    "salesChannel": "string (best channel to start)",
    "firstMonthGoals": ["string", "string"]
  }
}

Definitions:
- marketRealismScore: Be realistic. 80+ for strong ideas with traction. Most ideas are 40-60.
- recommendation:
   - GO: Strong market fit, clear traction (revenue/users), or verified deep tech/IP.
   - ITERATE: Good problem, bad solution. Needs work.
   - NO-GO: Fundamentally flawed, no market.

Tone:
- Professional, concise, critical, "tough love".
`;

export const analyzeStartupIdea = async (pitch: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // We cannot use responseSchema when using googleSearch tool.
    // We must prompt for JSON and parse it manually.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: pitch,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Search Grounding
        temperature: 0.2, // Low temperature for consistent JSON
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    // Clean up potential markdown formatting if the model adds it despite instructions
    const jsonString = text.replace(/```json\n|\n```/g, "").trim();
    let result: AnalysisResult;
    
    try {
      result = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", jsonString);
      throw new Error("AI response was not valid JSON. Please try again.");
    }

    // Extract Sources from Grounding Metadata
    const sources: { title: string; url: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            url: chunk.web.uri
          });
        }
      });
    }

    // Add sources to result (deduplicated)
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);
    result.sources = uniqueSources.slice(0, 5); // Top 5 sources

    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};