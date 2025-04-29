import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get the current authenticated user
export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    return user;
  },
});

// Sign up with email and password
export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password, name } = args;
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (existingUser) {
      throw new ConvexError("User with this email already exists");
    }
    
    // Create a new user
    const userId = await ctx.db.insert("users", {
      name,
      email,
      password, // In a real app, you would hash this password
      createdAt: Date.now(),
    });
    
    return { userId, email, name };
  },
});

// Sign in with email and password
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password } = args;
    console.log("Signing in user:", email);
    
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user) {
      console.log("User not found:", email);
      throw new ConvexError("User not found");
    }
    
    console.log("User found:", user);
    
    // Check password (in a real app, you would compare hashed passwords)
    if (user.password !== password) {
      console.log("Invalid password for user:", email);
      throw new ConvexError("Invalid password");
    }
    
    // Generate a session token (in a real app, you would use JWT or similar)
    const sessionToken = Math.random().toString(36).substring(2);
    console.log("Generated session token:", sessionToken);
    
    // Store the session
    const sessionId = await ctx.db.insert("sessions", {
      userId: user._id,
      token: sessionToken,
      createdAt: Date.now(),
    });
    
    console.log("Session created:", sessionId);
    
    return { 
      sessionToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    };
  },
});

// Validate a session token
export const validateSession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const { token } = args;
    console.log("Validating session token:", token);
    
    // Find the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    
    if (!session) {
      console.log("No session found for token:", token);
      return null;
    }
    
    console.log("Session found:", session);
    
    // Get the user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      console.log("No user found for session:", session);
      return null;
    }
    
    console.log("User found:", user);
    
    // Return the session object with the user
    const result = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    };
    
    console.log("Returning session result:", result);
    return result;
  },
});

// Sign out (invalidate session)
export const signOut = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionToken } = args;
    
    // Find the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .first();
    
    if (session) {
      // Delete the session
      await ctx.db.delete(session._id);
    }
    
    return { success: true };
  },
});
