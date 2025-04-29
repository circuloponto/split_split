/**
 * Simplifies debts between group members to minimize the number of transactions
 * Uses a greedy algorithm to optimize the payment flow
 * 
 * @param {Array} balances - Array of balance objects with userId and balance amount
 * @returns {Array} - Array of simplified debt objects with fromUserId, toUserId, and amount
 */
export function simplifyDebts(balances) {
  if (!balances || balances.length === 0) {
    return [];
  }

  // Create copies to avoid mutating the original data
  const workingBalances = [...balances];
  
  // Separate creditors (positive balances) and debtors (negative balances)
  const creditors = workingBalances
    .filter(balance => balance.balance > 0)
    .sort((a, b) => b.balance - a.balance); // Sort in descending order
  
  const debtors = workingBalances
    .filter(balance => balance.balance < 0)
    .sort((a, b) => a.balance - b.balance); // Sort in ascending order (most negative first)
  
  const simplifiedDebts = [];
  
  // Process all debts
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    
    // Calculate the transaction amount (minimum of what is owed and what is due)
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
    
    if (amount > 0) {
      // Create a simplified debt transaction
      simplifiedDebts.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount: Number(amount.toFixed(2))
      });
      
      // Update balances
      debtor.balance += amount;
      creditor.balance -= amount;
    }
    
    // Remove users with zero balance
    if (Math.abs(debtor.balance) < 0.01) {
      debtors.shift();
    }
    
    if (Math.abs(creditor.balance) < 0.01) {
      creditors.shift();
    }
  }
  
  return simplifiedDebts;
}

/**
 * Calculates the total amount owed by a user across all groups
 * 
 * @param {number} userId - The ID of the user
 * @param {Array} balances - Array of balance objects
 * @returns {number} - Total amount owed (negative) or to be received (positive)
 */
export function calculateTotalBalance(userId, balances) {
  return balances
    .filter(balance => balance.userId === userId)
    .reduce((total, balance) => total + balance.balance, 0);
}

/**
 * Calculates balances for each user in a group based on expenses
 * 
 * @param {number} groupId - The ID of the group
 * @param {Array} expenses - Array of expense objects
 * @param {Array} users - Array of user objects
 * @returns {Array} - Array of balance objects
 */
export function calculateGroupBalances(groupId, expenses, users) {
  // Initialize balances for all users in the group
  const groupExpenses = expenses.filter(expense => expense.groupId === groupId);
  const userBalances = {};
  
  // Initialize all users with zero balance
  users.forEach(user => {
    userBalances[user.id] = 0;
  });
  
  // Process each expense
  groupExpenses.forEach(expense => {
    const { paidBy, amount, splitBetween, splitType } = expense;
    
    // Add the full amount to the payer's balance
    userBalances[paidBy] += amount;
    
    // Calculate each person's share
    if (splitType === 'equal') {
      const sharePerPerson = amount / splitBetween.length;
      
      // Subtract the share from each person's balance
      splitBetween.forEach(userId => {
        userBalances[userId] -= sharePerPerson;
      });
    }
    // Additional split types can be implemented here (percentage, exact amounts, etc.)
  });
  
  // Convert to array format
  return Object.keys(userBalances).map(userId => ({
    groupId,
    userId: parseInt(userId),
    balance: Number(userBalances[userId].toFixed(2))
  }));
}
