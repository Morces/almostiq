import { WeatherData, GeocodingResult } from "../types/weather";

// Simple mapping of WMO Weather Interpretation Codes (weather_code) to descriptions
export function getWeatherSummary(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Light Drizzle";
  if (code >= 61 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95) return "Thunderstorms";
  return "Variable Clouds";
}

/**
 * Searches for a city name and returns the coordinates
 */
export async function geocodeCity(cityName: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Geocoding failed");
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    
    const result = data.results[0];
    return {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    };
  } catch (error) {
    console.error("Geocoding service error:", error);
    return null;
  }
}

/**
 * Fetches current weather and forecast for given coordinates, returning normalized WeatherData
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_AI_API_KEY;
  if (!apiKey) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=precipitation_probability&forecast_days=1&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Fallback weather fetch failed");
      
      const data = await response.json();
      const current = data.current;
      
      const hourlyProbabilities = data.hourly?.precipitation_probability || [];
      const maxRainChance = hourlyProbabilities.length > 0 
        ? Math.max(...hourlyProbabilities.slice(0, 12)) 
        : 0;

      return {
        temperature: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        rainChance: maxRainChance,
        windSpeed: Math.round(current.wind_speed_10m),
        summary: getWeatherSummary(current.weather_code)
      };
    } catch (error) {
      console.error("Open-Meteo fallback error:", error);
      return {
        temperature: 22,
        humidity: 65,
        rainChance: 25,
        windSpeed: 12,
        summary: "Partly Cloudy (Simulated)"
      };
    }
  }

  // Live Weather AI API
  try {
    const url = `https://api.weather-ai.co/v1/weather?lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Weather AI API failed with status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const aiSummary = data.ai_summary || current.condition || "Partly Cloudy";

    // Estimate rainChance if not explicitly returned
    const condition = (current.condition || "").toLowerCase();
    let rainChance = 10;
    if (condition.includes("storm") || condition.includes("thunder")) rainChance = 95;
    else if (condition.includes("heavy rain")) rainChance = 90;
    else if (condition.includes("rain") || condition.includes("shower")) rainChance = 75;
    else if (condition.includes("drizzle") || condition.includes("sleet")) rainChance = 50;
    else if (condition.includes("cloud") || condition.includes("overcast")) rainChance = 25;

    return {
      temperature: current.temp_c !== undefined ? Math.round(current.temp_c) : 22,
      humidity: current.humidity !== undefined ? Math.round(current.humidity) : 60,
      rainChance: current.rain_chance !== undefined ? Math.round(current.rain_chance) : rainChance,
      windSpeed: current.wind_kph !== undefined ? Math.round(current.wind_kph) : 10,
      summary: aiSummary
    };
  } catch (error) {
    console.error("Weather AI API error, using fallback data:", error);
    return {
      temperature: 20,
      humidity: 62,
      rainChance: 30,
      windSpeed: 12,
      summary: "Partly Cloudy (Weather AI Fallback)"
    };
  }
}
