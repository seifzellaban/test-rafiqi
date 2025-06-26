import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) return [];
    // userIdentity is an object, but userId in the DB is an Id<"users"> (string)
    // So compare userIdentity.subject (the user id string) to conversation.userId
    return await ctx.db
      .query("conversations")
      .withIndex("by_updated_at")
      .order("desc")
      .collect()
      .then((conversations) =>
        conversations.filter((c) => c.userId === userIdentity.subject)
      );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    systemPrompt: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { title, systemPrompt, userId }) => {
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      title,
      systemPrompt: systemPrompt || "You are a helpful AI assistant.",
      createdAt: now,
      updatedAt: now,
      userId: userId,
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
    const userId = await ctx.auth.getUserIdentity();
    const conversation = await ctx.db.get(id);
    if (!conversation) return null;
    if (conversation.userId && userId !== conversation.userId) {
      throw new Error("Access denied: You do not own this conversation.");
    }
    return conversation;
  },
});
