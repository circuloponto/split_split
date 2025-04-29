import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(), // Added for email/password auth
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Sessions table for authentication
  sessions: defineTable({
    userId: v.string(),
    token: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_user", ["userId"]),

  // Groups table
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(), // User ID
    createdAt: v.number(),
    totalExpenses: v.number(), // Total expenses in the group
  }),

  // Group members table
  groupMembers: defineTable({
    groupId: v.string(), // Group ID
    userId: v.string(), // User ID
    joinedAt: v.number(),
  }).index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_group_and_user", ["groupId", "userId"]),

  // Expenses table
  expenses: defineTable({
    groupId: v.string(), // Group ID
    description: v.string(),
    amount: v.number(), // Decimal stored as number
    paidBy: v.string(), // User ID
    date: v.number(), // Timestamp
    category: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_group", ["groupId"])
    .index("by_user", ["paidBy"]),

  // Expense splits table
  expenseSplits: defineTable({
    expenseId: v.string(), // Expense ID
    userId: v.string(), // User ID
    amount: v.number(), // Decimal stored as number
    createdAt: v.number(),
  }).index("by_expense", ["expenseId"])
    .index("by_user", ["userId"]),

  // Settlements table
  settlements: defineTable({
    groupId: v.string(), // Group ID
    payerId: v.string(), // User ID who pays
    recipientId: v.string(), // User ID who receives
    amount: v.number(), // Decimal stored as number
    status: v.string(), // "pending", "completed", "cancelled"
    createdAt: v.number(),
  }).index("by_group", ["groupId"])
    .index("by_payer", ["payerId"])
    .index("by_recipient", ["recipientId"]),

  // Balances table (for caching calculated balances)
  balances: defineTable({
    userId: v.string(), // User ID
    groupId: v.string(), // Group ID
    balance: v.number(), // Positive means user is owed money, negative means user owes money
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_group", ["userId", "groupId"]),
});
