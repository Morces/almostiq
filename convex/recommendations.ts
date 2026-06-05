import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Retrieve saved weather recommendations for a user in reverse-chronological order
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const recs = await ctx.db
      .query("recommendations")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return recs;
  },
});

// Log a newly generated atmospheric recommendation card
export const save = mutation({
  args: {
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
  },
  handler: async (ctx: any, args: any) => {
    const id = await ctx.db.insert("recommendations", {
      userId: args.userId,
      industry: args.industry,
      location: args.location,
      question: args.question,
      recommendation: args.recommendation,
      confidence: args.confidence,
      weatherData: args.weatherData,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Delete all decision logs for a user (history reset)
export const clearHistory = mutation({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("recommendations")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }
  },
});
