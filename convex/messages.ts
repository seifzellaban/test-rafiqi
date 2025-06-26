import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, { conversationId, role, content }) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId,
      role,
      content,
      createdAt: Date.now(),
    });

    // Update conversation's updatedAt timestamp
    await ctx.db.patch(conversationId, {
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
