import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("customPrompts")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, { name, prompt }) => {
    return await ctx.db.insert("customPrompts", {
      name,
      prompt,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("customPrompts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
