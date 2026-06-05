import { WeatherData } from "./weather";

export interface DecisionRecommendation {
  id: string;
  userId: string;
  industry: string;
  location: string;
  question: string;
  recommendation: string;
  confidence: number; // e.g. 92 (representing 92%)
  weatherData: WeatherData;
  createdAt: number; // timestamp
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  industries: string[]; // list of selected industry IDs
  location?: string; // default location city
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  card?: {
    summary: string;
    recommendation: string;
    confidence: number;
    reasoning: string;
    factors: {
      precip: string;
      wind: string;
      temp: string;
      cover: string;
    };
  };
  createdAt?: number;
}
