import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Convex Auth required tables and indexes
const authTables = {
  users: defineTable({
    email: v.optional(v.string()),
    // Add more fields as needed
  }),
  authAccounts: defineTable({
    provider: v.string(),
    providerAccountId: v.string(),
    userId: v.id("users"),
    secret: v.optional(v.string()), // Allow secret field for password provider
    // ...other fields as needed by Convex Auth
  }).index("providerAndAccountId", ["provider", "providerAccountId"]),
  authSessions: defineTable({
    userId: v.id("users"),
    expirationTime: v.optional(v.number()), // Allow expirationTime for sessions
    // ...other fields as needed by Convex Auth
  }),
  authRateLimits: defineTable({
    identifier: v.string(),
    count: v.number(),
    lastRequestTime: v.number(),
  }).index("identifier", ["identifier"]),
};

const applicationTables = {
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  conversations: defineTable({
    title: v.string(),
    systemPrompt: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.optional(v.id("users")), // store userId as a string (subject)
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
