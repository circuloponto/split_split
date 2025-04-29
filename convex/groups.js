import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new group
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    initialMembers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, description, createdBy, initialMembers } = args;
    
    // Create the group
    const groupId = await ctx.db.insert("groups", {
      name,
      description,
      createdBy,
      createdAt: Date.now(),
      totalExpenses: 0,
    });
    
    // Add the creator as a member
    await ctx.db.insert("groupMembers", {
      groupId: groupId,
      userId: createdBy,
      joinedAt: Date.now(),
    });
    
    // Add initial members
    for (const memberId of initialMembers) {
      if (memberId !== createdBy) {
        await ctx.db.insert("groupMembers", {
          groupId: groupId,
          userId: memberId,
          joinedAt: Date.now(),
        });
      }
    }
    
    return groupId;
  },
});

// Get a group by ID
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all groups for a user
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get all group memberships for the user
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Get the group details for each membership
    const groupIds = memberships.map((membership) => membership.groupId);
    const groups = [];
    
    for (const groupId of groupIds) {
      const group = await ctx.db.get(groupId);
      if (group) {
        groups.push(group);
      }
    }
    
    return groups;
  },
});

// Add a member to a group
export const addMember = mutation({
  args: {
    groupId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { groupId, userId } = args;
    
    // Check if the user is already a member
    const existingMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) => 
        q.eq("groupId", groupId).eq("userId", userId)
      )
      .first();
    
    if (existingMembership) {
      return existingMembership._id;
    }
    
    // Add the user as a member
    return await ctx.db.insert("groupMembers", {
      groupId,
      userId,
      joinedAt: Date.now(),
    });
  },
});

// Get all members of a group
export const getMembers = query({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    // Get all memberships for the group
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
    
    // Get the user details for each membership
    const userIds = memberships.map((membership) => membership.userId);
    const members = [];
    
    for (const userId of userIds) {
      const user = await ctx.db.get(userId);
      if (user) {
        members.push(user);
      }
    }
    
    return members;
  },
});
