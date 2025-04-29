import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new expense
export const create = mutation({
  args: {
    groupId: v.string(),
    description: v.string(),
    amount: v.number(),
    paidBy: v.string(),
    date: v.optional(v.number()),
    category: v.optional(v.string()),
    splits: v.array(
      v.object({
        userId: v.string(),
        amount: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { groupId, description, amount, paidBy, splits, category } = args;
    const date = args.date || Date.now();
    
    // Create the expense
    const expenseId = await ctx.db.insert("expenses", {
      groupId,
      description,
      amount,
      paidBy,
      date,
      category,
      createdAt: Date.now(),
    });
    
    // Update the total expenses in the group
    const group = await ctx.db.get(groupId);
    if (group) {
      await ctx.db.patch(groupId, {
        totalExpenses: (group.totalExpenses || 0) + amount,
      });
    }
    
    // Create the expense splits
    for (const split of splits) {
      await ctx.db.insert("expenseSplits", {
        expenseId,
        userId: split.userId,
        amount: split.amount,
        createdAt: Date.now(),
      });
    }
    
    // Update balances
    await updateBalances(ctx, groupId);
    
    return expenseId;
  },
});

// Delete an expense
export const deleteExpense = mutation({
  args: {
    expenseId: v.string(),
  },
  handler: async (ctx, args) => {
    const { expenseId } = args;
    
    // Get the expense to be deleted
    const expense = await ctx.db.get(expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    const groupId = expense.groupId;
    
    // Delete all expense splits
    const splits = await ctx.db
      .query("expenseSplits")
      .withIndex("by_expense", (q) => q.eq("expenseId", expenseId))
      .collect();
    
    for (const split of splits) {
      await ctx.db.delete(split._id);
    }
    
    // Update the total expenses in the group
    const group = await ctx.db.get(groupId);
    if (group) {
      await ctx.db.patch(groupId, {
        totalExpenses: Math.max(0, (group.totalExpenses || 0) - expense.amount),
      });
    }
    
    // Delete the expense
    await ctx.db.delete(expenseId);
    
    // Update balances
    await updateBalances(ctx, groupId);
    
    return expenseId;
  },
});

// Get all expenses for a group
export const getByGroup = query({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
  },
});

// Get all expenses for a user
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get all expenses paid by the user
    const paidExpenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("paidBy", args.userId))
      .collect();
    
    // Get all expense splits for the user
    const splits = await ctx.db
      .query("expenseSplits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Get the expense details for each split
    const splitExpenseIds = splits.map((split) => split.expenseId);
    const splitExpenses = [];
    
    for (const expenseId of splitExpenseIds) {
      const expense = await ctx.db.get(expenseId);
      if (expense && !paidExpenses.some(e => e._id === expenseId)) {
        splitExpenses.push(expense);
      }
    }
    
    return [...paidExpenses, ...splitExpenses];
  },
});

// Get expense details with splits
export const getWithSplits = query({
  args: { expenseId: v.string() },
  handler: async (ctx, args) => {
    const expense = await ctx.db.get(args.expenseId);
    if (!expense) {
      return null;
    }
    
    const splits = await ctx.db
      .query("expenseSplits")
      .withIndex("by_expense", (q) => q.eq("expenseId", args.expenseId))
      .collect();
    
    return {
      ...expense,
      splits,
    };
  },
});

// Helper function to update balances for a group
async function updateBalances(ctx, groupId) {
  // Get all members of the group
  const memberships = await ctx.db
    .query("groupMembers")
    .withIndex("by_group", (q) => q.eq("groupId", groupId))
    .collect();
  
  const memberIds = memberships.map((membership) => membership.userId);
  
  // Get all expenses for the group
  const expenses = await ctx.db
    .query("expenses")
    .withIndex("by_group", (q) => q.eq("groupId", groupId))
    .collect();
  
  // Calculate balances
  const balances = {};
  memberIds.forEach((memberId) => {
    balances[memberId] = 0;
  });
  
  // Process all expenses
  for (const expense of expenses) {
    // Add the full amount to the payer's balance
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
    
    // Get the splits for this expense
    const splits = await ctx.db
      .query("expenseSplits")
      .withIndex("by_expense", (q) => q.eq("expenseId", expense._id))
      .collect();
    
    // Subtract the split amounts from each member's balance
    for (const split of splits) {
      balances[split.userId] = (balances[split.userId] || 0) - split.amount;
    }
  }
  
  // Update the balances in the database
  for (const userId in balances) {
    // Check if a balance record already exists
    const existingBalance = await ctx.db
      .query("balances")
      .withIndex("by_user_and_group", (q) => 
        q.eq("userId", userId).eq("groupId", groupId)
      )
      .first();
    
    if (existingBalance) {
      // Update existing balance
      await ctx.db.patch(existingBalance._id, {
        balance: balances[userId],
        updatedAt: Date.now(),
      });
    } else {
      // Create new balance record
      await ctx.db.insert("balances", {
        userId,
        groupId,
        balance: balances[userId],
        updatedAt: Date.now(),
      });
    }
  }
}
