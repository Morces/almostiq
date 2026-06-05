import { NextRequest, NextResponse } from "next/server";
import { geocodeCity, fetchWeather } from "../../../lib/weather";
import { queryGemini } from "../../../lib/gemini";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industry, location, question, userId } = body;
    const activeUserId = userId || "moses-123";

    if (!industry || !location) {
      return NextResponse.json(
        { error: "Industry and location are required parameters" },
        { status: 400 }
      );
    }

    // 1. Resolve city coordinates
    const geo = await geocodeCity(location);
    let weatherData;
    let resolvedLocationName = location;

    if (!geo) {
      console.warn(`Could not geocode location: ${location}. Using fallback weather data.`);
      weatherData = {
        temperature: 20,
        humidity: 60,
        rainChance: 35,
        windSpeed: 15,
        summary: "Partly Cloudy (Simulated)"
      };
    } else {
      resolvedLocationName = `${geo.name}, ${geo.country || ""}`;
      weatherData = await fetchWeather(geo.latitude, geo.longitude);
    }

    // 2. Generate structured decision recommendation via Gemini (or rule fallback)
    const geminiResult = await queryGemini(
      industry,
      weatherData,
      question || `Optimize operations for ${industry}`
    );

    // 3. Store recommendation in Convex
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      try {
        const convex = new ConvexHttpClient(convexUrl);
        await convex.mutation(api.recommendations.save, {
          userId: activeUserId,
          industry,
          location: resolvedLocationName,
          question: question || `Manual request for ${industry}`,
          recommendation: geminiResult.recommendation + "\n\n" + geminiResult.reasoning,
          confidence: geminiResult.confidence,
          weatherData: {
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            rainChance: weatherData.rainChance,
            windSpeed: weatherData.windSpeed,
            summary: weatherData.summary,
          },
        });
      } catch (err) {
        console.error("Convex insertion error in /api/analyze:", err);
      }
    }

    return NextResponse.json({
      recommendation: geminiResult.recommendation + "\n\n" + geminiResult.reasoning,
      confidence: geminiResult.confidence,
      weather: weatherData,
      location: resolvedLocationName,
      factors: geminiResult.factors,
      createdAt: Date.now()
    });
  } catch (error: any) {
    console.error("API error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation", details: error.message },
      { status: 500 }
    );
  }
}
