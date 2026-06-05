import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Load user profile details by their identifier
export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();
    return user;
  },
});

// Create or update a user's details and industry preferences
export const saveProfile = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    industries: v.array(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        industries: args.industries,
        location: args.location,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        email: args.email,
        industries: args.industries,
        location: args.location,
        createdAt: Date.now(),
      });
      return id;
    }
  },
});
