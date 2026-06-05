import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Retrieve saved chat history for a user in chronological order
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const list = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .order("asc")
      .collect();
    return list;
  },
});

// Save a chat message (user message or bot response card)
export const save = mutation({
  args: {
    userId: v.string(),
    sender: v.string(),
    text: v.optional(v.string()),
    card: v.optional(v.object({
      summary: v.string(),
      recommendation: v.string(),
      confidence: v.number(),
      reasoning: v.string(),
      factors: v.object({
        precip: v.string(),
        wind: v.string(),
        temp: v.string(),
        cover: v.string(),
      }),
    })),
  },
  handler: async (ctx: any, args: any) => {
    const id = await ctx.db.insert("chats", {
      userId: args.userId,
      sender: args.sender,
      text: args.text,
      card: args.card,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Clear chat history for a user
export const clear = mutation({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }
  },
});
