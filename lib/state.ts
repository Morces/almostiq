import { DecisionRecommendation, UserProfile, ChatMessage } from "../types/recommendation";

const DEFAULT_USER: UserProfile = {
  id: "moses-123",
  name: "Moses",
  email: "moses@example.com",
  industries: ["laundry", "logistics", "events"],
  location: "Nairobi",
  createdAt: Date.now()
};

const DEFAULT_RECOMMENDATIONS: DecisionRecommendation[] = [
  {
    id: "rec-1",
    userId: "moses-123",
    industry: "laundry",
    location: "Nairobi",
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
    createdAt: Date.now() - 3600000 * 2 // 2 hours ago
  },
  {
    id: "rec-2",
    userId: "moses-123",
    industry: "logistics",
    location: "Nairobi",
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
    createdAt: Date.now() - 3600000 * 5 // 5 hours ago
  },
  {
    id: "rec-3",
    userId: "moses-123",
    industry: "events",
    location: "Nairobi",
    question: "Do we need overhead covers for the afternoon reception?",
    recommendation: "Direct Answer: No, conditions are optimal to proceed.\n\nOptimal outdoor event weather! Sunny and comfortable at 23°C with mild winds (12 km/h) and dry conditions. No special shelter adjustments required.",
    confidence: 96,
    weatherData: {
      temperature: 23,
      humidity: 50,
      rainChance: 15,
      windSpeed: 12,
      summary: "Partly Cloudy"
    },
    createdAt: Date.now() - 3600000 * 24 // 24 hours ago
  }
];

const STORAGE_KEYS = {
  USER: "atmosiq_user",
  RECOMMENDATIONS: "atmosiq_recs"
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getCurrentUser(): UserProfile {
  if (!isClient()) return DEFAULT_USER;
  
  const saved = localStorage.getItem(STORAGE_KEYS.USER);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_USER;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (!isClient()) return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export function getRecommendations(): DecisionRecommendation[] {
  if (!isClient()) return DEFAULT_RECOMMENDATIONS;
  
  const saved = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(DEFAULT_RECOMMENDATIONS));
    return DEFAULT_RECOMMENDATIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_RECOMMENDATIONS;
  }
}

export function saveRecommendation(rec: DecisionRecommendation): void {
  if (!isClient()) return;
  const current = getRecommendations();
  // Avoid duplicate saving by ID
  const existsIndex = current.findIndex(r => r.id === rec.id);
  if (existsIndex >= 0) {
    current[existsIndex] = rec;
  } else {
    current.unshift(rec);
  }
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(current));
}

export function deleteRecommendation(id: string): void {
  if (!isClient()) return;
  const current = getRecommendations();
  const filtered = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(filtered));

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (url) {
    import("convex/browser").then(({ ConvexHttpClient }) => {
      import("@/convex/_generated/api").then(({ api }) => {
        try {
          const client = new ConvexHttpClient(url);
          if (id.startsWith("rec-")) {
            return;
          }
          client.mutation(api.recommendations.remove, { id: id as any });
        } catch (err) {
          console.error("Convex delete recommendation error:", err);
        }
      });
    });
  }
}

export function clearRecommendationHistory(): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify([]));
  
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (url) {
    import("convex/browser").then(({ ConvexHttpClient }) => {
      import("@/convex/_generated/api").then(({ api }) => {
        try {
          const client = new ConvexHttpClient(url);
          client.mutation(api.recommendations.clearHistory, { userId: getCurrentUser().id });
        } catch (err) {
          console.error("Convex clear history sync error:", err);
        }
      });
    });
  }
}

// Asynchronously fetch user profile from Convex
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return getCurrentUser();

  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const client = new ConvexHttpClient(url);
    const profile = await client.query(api.users.getProfile, { userId });
    
    if (profile) {
      const u: UserProfile = {
        id: profile.userId,
        name: profile.name,
        email: profile.email,
        industries: profile.industries,
        location: profile.location,
        createdAt: profile.createdAt
      };
      setCurrentUser(u);
      return u;
    }
  } catch (err) {
    console.error("Convex fetch user profile error:", err);
  }
  return getCurrentUser();
}

// Asynchronously sync local user profile details into Convex
export async function syncUserProfile(user: UserProfile): Promise<void> {
  setCurrentUser(user);
  
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return;

  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const client = new ConvexHttpClient(url);
    await client.mutation(api.users.saveProfile, {
      userId: user.id,
      name: user.name,
      email: user.email,
      industries: user.industries,
      location: user.location
    });
  } catch (err) {
    console.error("Convex sync user profile error:", err);
  }
}

// Asynchronously fetch recommendation history from Convex
export async function fetchRecommendations(userId: string): Promise<DecisionRecommendation[]> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return getRecommendations();

  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const client = new ConvexHttpClient(url);
    const list = await client.query(api.recommendations.list, { userId });
    
    if (list) {
      const results: DecisionRecommendation[] = list.map((item: any) => ({
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
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(results));
      return results;
    }
  } catch (err) {
    console.error("Convex fetch recommendations error:", err);
  }
  return getRecommendations();
}

// Asynchronously fetch chat history messages from Convex
export async function fetchChats(userId: string): Promise<ChatMessage[]> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return [];

  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const client = new ConvexHttpClient(url);
    const list = await client.query(api.chats.list, { userId });
    
    if (list) {
      return list.map((item: any) => ({
        id: item._id,
        sender: item.sender as "user" | "assistant",
        text: item.text,
        card: item.card,
        createdAt: item.createdAt
      }));
    }
  } catch (err) {
    console.error("Convex fetch chats error:", err);
  }
  return [];
}

// Asynchronously save a single chat message thread block (user query or bot reply card) to Convex
export async function saveChatMessage(
  userId: string, 
  sender: "user" | "assistant", 
  text?: string, 
  card?: ChatMessage["card"]
): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;

  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const client = new ConvexHttpClient(url);
    const id = await client.mutation(api.chats.save, {
      userId,
      sender,
      text,
      card
    });
    return id;
  } catch (err) {
    console.error("Convex save chat message error:", err);
  }
  return null;
}

// Asynchronously clear all chat threads for a user from Convex
export async function clearChatHistory(userId: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return;

  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const client = new ConvexHttpClient(url);
    await client.mutation(api.chats.clear, { userId });
  } catch (err) {
    console.error("Convex clear chat history error:", err);
  }
}
