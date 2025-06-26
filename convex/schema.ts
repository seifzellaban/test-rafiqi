import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  conversations: defineTable({
    title: v.string(),
    systemPrompt: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.optional(v.id("users")),
  }).index("by_updated_at", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId", "createdAt"]),

  customPrompts: defineTable({
    name: v.string(),
    prompt: v.string(),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
