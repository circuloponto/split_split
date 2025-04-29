import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new settlement
export const create = mutation({
  args: {
    groupId: v.string(),
    payerId: v.string(),
    recipientId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { groupId, payerId, recipientId, amount } = args;
    
    // Create the settlement
    const settlementId = await ctx.db.insert("settlements", {
      groupId,
      payerId,
      recipientId,
      amount,
      status: "pending",
      createdAt: Date.now(),
    });
    
    return settlementId;
  },
});

// Mark a settlement as completed
export const markAsCompleted = mutation({
  args: { settlementId: v.string() },
  handler: async (ctx, args) => {
    const settlement = await ctx.db.get(args.settlementId);
    if (!settlement) {
      throw new Error("Settlement not found");
    }
    
    await ctx.db.patch(args.settlementId, {
      status: "completed",
    });
    
    // Update balances
    const payerBalance = await ctx.db
      .query("balances")
      .withIndex("by_user_and_group", (q) => 
        q.eq("userId", settlement.payerId).eq("groupId", settlement.groupId)
      )
      .first();
    
    const recipientBalance = await ctx.db
      .query("balances")
      .withIndex("by_user_and_group", (q) => 
        q.eq("userId", settlement.recipientId).eq("groupId", settlement.groupId)
      )
      .first();
    
    if (payerBalance) {
      await ctx.db.patch(payerBalance._id, {
        balance: payerBalance.balance + settlement.amount,
        updatedAt: Date.now(),
      });
    }
    
    if (recipientBalance) {
      await ctx.db.patch(recipientBalance._id, {
        balance: recipientBalance.balance - settlement.amount,
        updatedAt: Date.now(),
      });
    }
    
    return args.settlementId;
  },
});

// Get all settlements for a group
export const getByGroup = query({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    // Get all settlements and filter by groupId
    const allSettlements = await ctx.db
      .query("settlements")
      .collect();
    
    // Filter settlements for the specific group
    return allSettlements.filter(settlement => settlement.groupId === args.groupId);
  },
});

// Get all settlements for a user (either as payer or recipient)
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const asPayer = await ctx.db
      .query("settlements")
      .withIndex("by_payer", (q) => q.eq("payerId", args.userId))
      .collect();
    
    const asRecipient = await ctx.db
      .query("settlements")
      .withIndex("by_recipient", (q) => q.eq("recipientId", args.userId))
      .collect();
    
    return [...asPayer, ...asRecipient];
  },
});

// Get simplified debts for a group
export const getSimplifiedDebts = query({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    // Get all balances for the group using the by_user_and_group index
    const allBalances = await ctx.db
      .query("balances")
      .collect();
    
    // Filter balances for the specific group
    const balances = allBalances.filter(balance => balance.groupId === args.groupId);
    
    // Separate positive (creditors) and negative (debtors) balances
    const creditors = balances
      .filter(balance => balance.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    
    const debtors = balances
      .filter(balance => balance.balance < 0)
      .sort((a, b) => a.balance - b.balance);
    
    // Calculate simplified payments
    const payments = [];
    
    let i = 0;
    let j = 0;
    
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      
      // Calculate the payment amount (minimum of debt and credit)
      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
      
      if (amount > 0) {
        payments.push({
          from: debtor.userId,
          to: creditor.userId,
          amount,
        });
      }
      
      // Update balances
      debtor.balance += amount;
      creditor.balance -= amount;
      
      // Move to the next debtor or creditor if their balance is settled
      if (Math.abs(debtor.balance) < 0.01) {
        i++;
      }
      
      if (creditor.balance < 0.01) {
        j++;
      }
    }
    
    return payments;
  },
});
