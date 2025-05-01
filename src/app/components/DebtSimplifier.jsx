"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import toast from 'react-hot-toast';

export default function DebtSimplifier({ groupId, expenses = [], members = [] }) {
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);
  const [originalDebts, setOriginalDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ expenses: 0, members: 0 });
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate debts when expenses or members change
  useEffect(() => {
    setDebugInfo({
      expenses: expenses.length,
      members: members.length
    });
    
    if (groupId && members.length > 0) {
      calculateSimplifiedDebts();
    } else {
      setSimplifiedDebts([]);
    }
  }, [groupId, expenses, members]);
  
  // Calculate simplified debts
  const calculateSimplifiedDebts = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If no expenses, return empty result
      if (!expenses || expenses.length === 0) {
        setSimplifiedDebts([]);
        setIsLoading(false);
        return;
      }
      
      console.log("Starting debt simplification with expenses:", expenses);
      console.log("Group members:", members);
      
      // Step 1: Extract original debts from expense splits for the tooltip display
      const originalDebtList = [];
      
      // Extract original debts directly from the expense splits
      expenses.forEach(expense => {
        // Skip invalid expenses
        if (!expense.paidBy || !expense.amount || expense.amount <= 0 || !expense.splits) {
          console.warn("Skipping invalid expense:", expense);
          return;
        }
        
        const payerId = expense.paidBy;
        
        // Each split represents a debt from the split owner to the payer
        // (unless the split owner is the payer themselves)
        expense.splits.forEach(split => {
          // Validate the split
          if (!split.userId || split.userId === payerId) {
            return;
          }
          
          const splitAmount = parseFloat(split.amount);
          if (isNaN(splitAmount) || splitAmount <= 0) {
            return;
          }
          
          originalDebtList.push({
            from: split.userId, // The person who owes money
            to: payerId,        // The person who paid
            amount: splitAmount,
            description: expense.description
          });
        });
      });
      
      console.log("Original debts extracted for tooltip:", originalDebtList);
      setOriginalDebts(originalDebtList);
      
      // Step 2: Calculate net balance for each person
      const balances = {};
      
      // Initialize balances for all members
      members.forEach(member => {
        balances[member._id] = 0;
      });
      
      // For each original debt, update the balances
      originalDebtList.forEach(debt => {
        // Ensure the debt amount is a valid number
        const amount = parseFloat(debt.amount);
        if (isNaN(amount)) {
          console.warn("Debt has invalid amount:", debt);
          return;
        }
        
        if (!balances.hasOwnProperty(debt.from)) {
          console.warn(`Debtor ${debt.from} not in balances, adding them`);
          balances[debt.from] = 0;
        }
        
        if (!balances.hasOwnProperty(debt.to)) {
          console.warn(`Creditor ${debt.to} not in balances, adding them`);
          balances[debt.to] = 0;
        }
        
        balances[debt.from] -= amount; // Debtor's balance decreases
        balances[debt.to] += amount;   // Creditor's balance increases
      });
      
      console.log("Net balances calculated:", balances);
      
      // Verify that the sum of all balances is close to zero
      const sumOfBalances = Object.values(balances).reduce((sum, balance) => sum + balance, 0);
      if (Math.abs(sumOfBalances) > 0.1) {
        console.warn(`Sum of balances is not zero: ${sumOfBalances.toFixed(2)}`);
      }
      
      // Step 3: Separate people into debtors (negative balance) and creditors (positive balance)
      const debtors = [];
      const creditors = [];
      
      Object.entries(balances).forEach(([personId, balance]) => {
        // Round to 2 decimal places to avoid floating point issues
        const roundedBalance = Math.round(balance * 100) / 100;
        
        if (roundedBalance < -0.01) {
          // This person owes money (negative balance)
          debtors.push({
            id: personId,
            amount: Math.abs(roundedBalance) // Store as positive amount
          });
        } else if (roundedBalance > 0.01) {
          // This person is owed money (positive balance)
          creditors.push({
            id: personId,
            amount: roundedBalance
          });
        }
        // Ignore people with zero balance (or very close to zero)
      });
      
      // Calculate total debt and total credit to ensure they match
      const totalDebt = debtors.reduce((sum, debtor) => sum + debtor.amount, 0);
      const totalCredit = creditors.reduce((sum, creditor) => sum + creditor.amount, 0);
      
      console.log(`Total debt: $${totalDebt.toFixed(2)}, Total credit: $${totalCredit.toFixed(2)}`);
      
      if (Math.abs(totalDebt - totalCredit) > 0.1) {
        console.warn(`Debt and credit totals don't match: Debt=$${totalDebt.toFixed(2)}, Credit=$${totalCredit.toFixed(2)}`);
      }
      
      // Sort by amount (largest first) for more efficient matching
      debtors.sort((a, b) => b.amount - a.amount);
      creditors.sort((a, b) => b.amount - a.amount);
      
      console.log("Debtors identified:", debtors);
      console.log("Creditors identified:", creditors);
      
      // Step 4: Create simplified payments
      const simplifiedPayments = [];
      
      // Make a copy of the debtors and creditors arrays to avoid modifying the originals
      const debtorsQueue = [...debtors];
      const creditorsQueue = [...creditors];
      
      // Keep processing until either all debtors or all creditors are settled
      while (debtorsQueue.length > 0 && creditorsQueue.length > 0) {
        const debtor = debtorsQueue[0];
        const creditor = creditorsQueue[0];
        
        // Calculate payment amount (minimum of debt or credit)
        const paymentAmount = Math.min(debtor.amount, creditor.amount);
        
        // Round to 2 decimal places
        const roundedAmount = Math.round(paymentAmount * 100) / 100;
        
        if (roundedAmount > 0.01) {
          console.log(`Creating payment: ${debtor.id} pays $${roundedAmount.toFixed(2)} to ${creditor.id}`);
          
          simplifiedPayments.push({
            from: debtor.id,
            to: creditor.id,
            amount: roundedAmount
          });
        }
        
        // Update remaining balances
        debtor.amount -= paymentAmount;
        creditor.amount -= paymentAmount;
        
        console.log(`Updated balances - Debtor ${debtor.id}: $${debtor.amount.toFixed(2)}, Creditor ${creditor.id}: $${creditor.amount.toFixed(2)}`);
        
        // Remove people with zero balance (or very close to zero)
        if (debtor.amount < 0.01) {
          console.log(`Removing settled debtor: ${debtor.id}`);
          debtorsQueue.shift();
        }
        
        if (creditor.amount < 0.01) {
          console.log(`Removing settled creditor: ${creditor.id}`);
          creditorsQueue.shift();
        }
      }
      
      console.log("Simplified payments generated:", simplifiedPayments);
      
      // Calculate the total of simplified debts for validation
      const totalSimplifiedDebt = simplifiedPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalOriginalDebt = originalDebtList.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
      
      console.log(`Validation - Original total: $${totalOriginalDebt.toFixed(2)}, Simplified total: $${totalSimplifiedDebt.toFixed(2)}`);
      
      // Update state with the results
      setSimplifiedDebts(simplifiedPayments);
      setDebugInfo({
        expenses: expenses.length,
        members: members.length,
        originalDebts: originalDebtList.length,
        simplifiedDebts: simplifiedPayments.length,
        originalTotal: totalOriginalDebt.toFixed(2),
        simplifiedTotal: totalSimplifiedDebt.toFixed(2)
      });
    } catch (error) {
      console.error("Error calculating simplified debts:", error);
      setError("Failed to calculate simplified debts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to get user name from ID
  const getUserName = (userId) => {
    if (!members) return userId;
    const member = members.find(m => m._id === userId);
    return member ? member.name : userId;
  };
  
  // If no expenses or members, show appropriate message
  if (!groupId) {
    return <div className="text-gray-600">Select a group to see debts.</div>;
  }
  
  if (members.length === 0) {
    return <div className="text-gray-600">No members in this group yet.</div>;
  }
  
  if (expenses.length === 0) {
    return <div className="text-gray-600">No expenses in this group yet. Add some expenses to see who owes whom.</div>;
  }
  
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800 flex items-center">
          Simplified Debts
          <div className="relative ml-2">
            <button 
              className="text-gray-500 hover:text-indigo-600 focus:outline-none"
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showTooltip && (
              <div 
                className="absolute z-10 w-72 bg-white p-4 rounded-md shadow-lg border border-gray-200 text-sm text-gray-600 left-0 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="font-medium text-gray-800 mb-2">Original Debts</h4>
                <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {originalDebts.length === 0 ? (
                    <p>No debts to display.</p>
                  ) : (
                    <ul className="space-y-2">
                      {originalDebts.map((debt, index) => {
                        const fromMember = members.find(m => m._id === debt.from);
                        const toMember = members.find(m => m._id === debt.to);
                        
                        if (!fromMember || !toMember) return null;
                        
                        return (
                          <li key={index} className="border-b border-gray-100 pb-1">
                            <span className="font-medium">{fromMember.name}</span> owes <span className="font-medium">{toMember.name}</span> ${debt.amount.toFixed(2)}
                            <span className="text-xs text-gray-500 block">for {debt.description}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="font-medium">Total Original Debt: ${debugInfo.originalTotal}</p>
                  <p className="font-medium">Total Simplified Debt: ${debugInfo.simplifiedTotal}</p>
                  {Math.abs(parseFloat(debugInfo.originalTotal) - parseFloat(debugInfo.simplifiedTotal)) > 0.1 && (
                    <p className="text-xs mt-2 text-gray-600">
                      <strong>Note:</strong> The original total is higher than the simplified total because the original counts all individual debts, while the simplified version eliminates circular debts (e.g., if A owes B, B owes C, and C owes A).
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </h3>
        <div className="text-sm text-gray-500">
          {isLoading ? (
            <span>Calculating...</span>
          ) : (
            <span>
              {simplifiedDebts.length} payment{simplifiedDebts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-indigo-600">Calculating optimal payments...</div>
        </div>
      ) : simplifiedDebts.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-md text-gray-600">
          No debts to settle.
        </div>
      ) : (
        <div className="space-y-3">
          {simplifiedDebts.map((debt, index) => {
            const fromMember = members.find(m => m._id === debt.from);
            const toMember = members.find(m => m._id === debt.to);
            
            if (!fromMember || !toMember) return null;
            
            return (
              <div key={index} className="p-3 bg-white border rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-medium">
                      {fromMember.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">{fromMember.name}</span> pays <span className="font-medium">{toMember.name}</span>
                    </p>
                  </div>
                </div>
                <div className="font-medium">${debt.amount.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
