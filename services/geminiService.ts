import { GoogleGenAI } from "@google/genai";
import { SystemState, Alert } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeSystem = async (
  state: SystemState,
  alerts: Alert[]
): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key not configured. Unable to generate AI insights.";

  const prompt = `
    You are an expert manager for an integrated Floating Solar, Aquaculture, and Agriculture system.
    
    Current System Telemetry (JSON):
    ${JSON.stringify(state, null, 2)}

    Active Alerts:
    ${JSON.stringify(alerts, null, 2)}

    Task:
    Provide a concise, 3-bullet point executive summary of the system's health.
    If there are critical alerts, prioritize actions to resolve them.
    Suggest one optimization to balance energy usage (Solar) with life support systems (Aqua/Agri).
    Keep the tone professional and technical.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response
      }
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI analysis service.";
  }
};