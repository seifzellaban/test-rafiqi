import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/api/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { messages, systemPrompt } = await request.json();
    
    // This is a placeholder - you'll need to implement Gemini API integration
    // For now, return a simple response
    const response = {
      content: "This is a placeholder response. Please configure the Gemini API integration.",
    };
    
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
