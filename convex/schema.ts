import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    industries: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  recommendations: defineTable({
    userId: v.string(),
    industry: v.string(),
    location: v.string(),
    question: v.string(),
    recommendation: v.string(),
    confidence: v.number(),
    weatherData: v.object({
      temperature: v.number(),
      humidity: v.number(),
      rainChance: v.number(),
      windSpeed: v.number(),
      summary: v.string(),
    }),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
