import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const DEFAULT_RECOMMENDATIONS = [
  {
    id: "rec-1",
    userId: "moses-123",
    industry: "laundry",
    location: "Nairobi, Kenya",
    question: "Should I schedule pickups tomorrow?",
    recommendation: "Direct Answer: Yes, conditions are optimal to proceed.\n\nExcellent outdoor drying conditions. Rain risk is minimal (10%) and humidity is low (45%). Natural evaporation rates will be high. You can safely maximize solar outdoor drying today.",
    confidence: 95,
    weatherData: {
      temperature: 24,
      humidity: 45,
      rainChance: 10,
      windSpeed: 15,
      summary: "Clear Sky"
    },
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: "rec-2",
    userId: "moses-123",
    industry: "logistics",
    location: "Nairobi, Kenya",
    question: "Is Route A safe for double-trailers today?",
    recommendation: "Direct Answer: No, it is not recommended without immediate precautions.\n\nSevere wind speeds (42 km/h) detected. High-profile vehicles, double-trailers, and empty box trucks should restrict movement or reduce speed by 20%. Reroute freight away from open bridges.",
    confidence: 92,
    weatherData: {
      temperature: 19,
      humidity: 80,
      rainChance: 30,
      windSpeed: 42,
      summary: "Windy & Overcast"
    },
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: "rec-3",
    userId: "moses-123",
    industry: "events",
    location: "Nairobi, Kenya",
    question: "Do we need overhead covers for the afternoon reception?",
    recommendation: "Direct Answer: Yes, conditions are optimal to proceed.\n\nOptimal outdoor event weather! Sunny and comfortable at 23°C with mild winds (12 km/h) and dry conditions. No special shelter adjustments required.",
    confidence: 96,
    weatherData: {
      temperature: 23,
      humidity: 50,
      rainChance: 15,
      windSpeed: 12,
      summary: "Partly Cloudy"
    },
    createdAt: Date.now() - 3600000 * 24
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "moses-123";

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      try {
        const convex = new ConvexHttpClient(convexUrl);
        const list = await convex.query(api.recommendations.list, { userId });
        
        if (list && list.length > 0) {
          const results = list.map((item: any) => ({
            id: item._id,
            userId: item.userId,
            industry: item.industry,
            location: item.location,
            question: item.question,
            recommendation: item.recommendation,
            confidence: item.confidence,
            weatherData: item.weatherData,
            createdAt: item.createdAt
          }));
          return NextResponse.json(results);
        }
      } catch (err) {
        console.error("Convex list query error in /api/history:", err);
      }
    }

    return NextResponse.json(DEFAULT_RECOMMENDATIONS);
  } catch (error: any) {
    console.error("API error in /api/history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history logs", details: error.message },
      { status: 500 }
    );
  }
}
