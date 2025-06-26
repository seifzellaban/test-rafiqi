import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_updated_at")
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, { title, systemPrompt }) => {
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      title,
      systemPrompt: systemPrompt || "You are a helpful AI assistant.",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, { id }) => {
    // Delete all messages first
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", id))
      .collect();
    
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    
    // Delete conversation
    await ctx.db.delete(id);
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, { id, title }) => {
    await ctx.db.patch(id, {
      title,
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
