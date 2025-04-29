import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update a user
export const createOrUpdate = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, email, avatarUrl } = args;
    
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        name,
        avatarUrl,
      });
    } else {
      // Create new user without specifying an ID
      return await ctx.db.insert("users", {
        name,
        email,
        avatarUrl,
        createdAt: Date.now(),
      });
    }
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get all users
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
