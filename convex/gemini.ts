import { action } from "./_generated/server";
("use node");
import { v } from "convex/values";

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, { messages }) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model", // Gemini API uses 'model' for assistant
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3n-e4b-it:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantResponse = data.candidates[0].content.parts[0].text;

    return assistantResponse;
  },
});

export const name = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, { messages }) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add a system prompt to instruct the model to generate a short, relevant chat title
    const namingPrompt = {
      role: "user",
      parts: [
        {
          text: "Based on the following conversation, suggest a short, relevant, and catchy title for this chat in 5 words or less. Only return the title, nothing else.",
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [...formattedMessages, namingPrompt],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const title = data.candidates[0].content.parts[0].text.trim();
    return title;
  },
});
