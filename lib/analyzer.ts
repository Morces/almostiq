import { WeatherData } from "../types/weather";

interface AnalysisResult {
  recommendation: string;
  confidence: number;
}

/**
 * Heuristic keyword matcher to formulate a direct response prefix to user's question
 */
function getQuestionPrefix(question: string, isHazardsActive: boolean): string {
  const q = question.toLowerCase();
  const isDecisionQuestion = q.includes("should") || q.includes("can") || q.includes("is it") || q.includes("will");
  
  if (isDecisionQuestion) {
    if (isHazardsActive) {
      return "Direct Answer: No, it is not recommended without immediate precautions.\n\n";
    } else {
      return "Direct Answer: Yes, conditions are optimal to proceed.\n\n";
    }
  }
  return "";
}

/**
 * Analyzes weather conditions and generates actionable decision cards based on industry profiles
 */
export function analyzeDecision(
  industry: string,
  weatherData: WeatherData,
  question: string = ""
): AnalysisResult {
  const { temperature, humidity, rainChance, windSpeed } = weatherData;
  let recommendation = "";
  let confidence = 90;
  let hasHazards = false;

  switch (industry.toLowerCase()) {
    case "laundry":
      if (rainChance > 40) {
        hasHazards = true;
        recommendation = `Risk of precipitation is high (${rainChance}%). Move all drying indoors. Avoid hanging laundry outside. Advise pickup drivers to bundle laundry bags in plastic waterproof wraps.`;
        confidence = Math.min(85 + Math.round(rainChance / 10), 98);
      } else if (humidity > 70) {
        hasHazards = true;
        recommendation = `High relative humidity (${humidity}%) will restrict air-drying evaporation rates. Drying outdoors will take 3-4x longer than average. Recommend utilizing mechanical tumble dryers or dehumidified indoor rooms.`;
        confidence = 88;
      } else {
        recommendation = `Excellent outdoor drying conditions. Rain risk is minimal (${rainChance}%) and humidity is low (${humidity}%). Natural evaporation rates will be high. You can safely maximize solar outdoor drying today.`;
        confidence = 95;
      }
      break;

    case "logistics":
      if (windSpeed > 35) {
        hasHazards = true;
        recommendation = `Severe wind speeds (${windSpeed} km/h) detected. High-profile vehicles, double-trailers, and empty box trucks should restrict movement or reduce speed by 20%. Reroute freight away from open bridges and high-altitude passes.`;
        confidence = Math.min(88 + Math.round(windSpeed / 10), 99);
      } else if (rainChance > 60) {
        hasHazards = true;
        recommendation = `Heavy rain storm predicted (Rain Chance: ${rainChance}%). Expect low visibility and slick roadway surfaces. Secure all open-bed cargo immediately. Instruct dispatch to include a 30-minute buffer time for local deliveries.`;
        confidence = 85;
      } else {
        recommendation = `Roadways and wind parameters are clear. Wind is stable at ${windSpeed} km/h and rain chance is low (${rainChance}%). All transport and loading operations can run at 100% standard efficiency.`;
        confidence = 92;
      }
      break;

    case "events":
      if (rainChance > 40) {
        hasHazards = true;
        recommendation = `High rain probability (${rainChance}%). Deploy overhead protective canopies for guests and secure ground tarps. All electrical cables, audio soundboards, and lighting rigs must be moved under cover or enclosed in waterproof shielding. Consider activating your indoor venue backup plan.`;
        confidence = Math.min(85 + Math.round(rainChance / 10), 97);
      } else if (temperature > 32) {
        hasHazards = true;
        recommendation = `Extreme heat indices expected (Temperature: ${temperature}°C). You must establish shaded cooling tents, distribute complimentary bottled water, and configure outdoor electric fans. Schedule heavy setup work during early morning slots to avoid heat exhaustion.`;
        confidence = 90;
      } else if (temperature < 12) {
        hasHazards = true;
        recommendation = `Cold conditions expected (Temperature: ${temperature}°C). Outdoor event structures will require radiant propane heaters, fire pits, and windbreaks. Advise attendees via pre-event emails to dress in layers.`;
        confidence = 88;
      } else if (windSpeed > 25) {
        hasHazards = true;
        recommendation = `High ambient gusts (${windSpeed} km/h). Secure all pop-up tents, flags, and banner stands with extra weights. Anchor temporary trusses or screens tightly to avoid collapses.`;
        confidence = 85;
      } else {
        recommendation = `Optimal outdoor event weather! Sunny and comfortable at ${temperature}°C with mild winds (${windSpeed} km/h) and dry conditions. No special shelter adjustments or weather delays required.`;
        confidence = 96;
      }
      break;

    default:
      recommendation = `No decision rules configured for the industry '${industry}'. General weather overview: Temperature is ${temperature}°C, humidity is ${humidity}%, rain risk is ${rainChance}%, wind is ${windSpeed} km/h. Check current parameters against your operating guidelines.`;
      confidence = 50;
      break;
  }

  // Inject direct answer if question was provided
  if (question.trim()) {
    const prefix = getQuestionPrefix(question, hasHazards);
    recommendation = prefix + recommendation;
  }

  return { recommendation, confidence };
}
