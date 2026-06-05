import { WeatherData } from "../types/weather";
import { analyzeDecision } from "./analyzer";

interface GeminiAnalysisResult {
  recommendation: string;
  confidence: number;
  reasoning: string;
  factors: {
    precip: string;
    wind: string;
    temp: string;
    cover: string;
  };
}

export async function queryGemini(
  industry: string,
  weatherData: WeatherData,
  question: string
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Local fallback: Call rule-based analyzer and build structured result
    const baseResult = analyzeDecision(industry, weatherData, question);
    
    // Estimate cloud cover based on weather summary
    let cover = "10%";
    const summary = weatherData.summary.toLowerCase();
    if (summary.includes("cloud") || summary.includes("overcast") || summary.includes("rain")) {
      cover = "85%";
    }

    return {
      recommendation: baseResult.recommendation.split("\n\n")[0] || "Precautions Recommended",
      confidence: baseResult.confidence,
      reasoning: baseResult.recommendation.split("\n\n")[1] || baseResult.recommendation,
      factors: {
        precip: `${weatherData.rainChance}%`,
        wind: `${weatherData.windSpeed} km/h`,
        temp: `${weatherData.temperature}°C`,
        cover
      }
    };
  }

  try {
    const prompt = `You are AtmosIQ, an AI-powered environmental decision intelligence engine. Translate weather forecasts into concrete business actions.
We have a user asking a question in a specific industry.
Industry: ${industry}
Current Weather Parameters:
- Temperature: ${weatherData.temperature}°C
- Relative Humidity: ${weatherData.humidity}%
- Probability of Rain: ${weatherData.rainChance}%
- Wind Speed: ${weatherData.windSpeed} km/h
- Overall Condition Summary: ${weatherData.summary}

User Question: ${question}

You MUST return a JSON object (and ONLY JSON, no markdown code block backticks \`\`\`, no extra symbols) matching this schema:
{
  "recommendation": "A concise, 1-sentence action-oriented decision response (e.g. 'Indoor / Sheltered Only', 'Proceed with standard operations', 'Delay irrigation')",
  "confidence": 85, // number from 0 to 100 representing the certainty of your decision based on severe conditions
  "reasoning": "A paragraph explaining the meteorological triggers (using the weather parameters) and their business operations impact (e.g., wind risk to event staging, humidity effect on laundry cycle drying, or flash flood delay on deliveries)",
  "factors": {
    "precip": "value with percentage or details, e.g., '85%' or '0.15 in/hr'",
    "wind": "value of wind speed and gusts, e.g., '14-22mph' or '12km/h'",
    "temp": "value, e.g. '58°F' or '24°C'",
    "cover": "estimated cloud cover, e.g. '92%' or '10%'"
  }
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini LLM API failed with status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("No response text from Gemini");

    const parsed: GeminiAnalysisResult = JSON.parse(rawText.trim());
    return parsed;
  } catch (error) {
    console.error("Gemini API query error, using local rules fallback:", error);
    // Fallback to rules if API or parsing fails
    const baseResult = analyzeDecision(industry, weatherData, question);
    return {
      recommendation: baseResult.recommendation.split("\n\n")[0] || "Precautions Recommended",
      confidence: baseResult.confidence,
      reasoning: baseResult.recommendation.split("\n\n")[1] || baseResult.recommendation,
      factors: {
        precip: `${weatherData.rainChance}%`,
        wind: `${weatherData.windSpeed} km/h`,
        temp: `${weatherData.temperature}°C`,
        cover: "50%"
      }
    };
  }
}
