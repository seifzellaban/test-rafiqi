import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    {
      ...Password,
      onSignUp: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) throw new Error("Not authenticated");
        
        // Create a new user document
        await ctx.db.insert("users", {
          tokenIdentifier: userId.tokenIdentifier,
          email: args.email,
          name: args.email.split('@')[0], // Use part before @ as name
          createdAt: Date.now(),
        });
      },
    }, 
    Anonymous
  ],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});
