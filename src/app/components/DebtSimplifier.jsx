"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import toast from 'react-hot-toast';

export default function DebtSimplifier({ groupId, expenses = [], members = [] }) {
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ expenses: 0, members: 0 });
  const [error, setError] = useState(null);
  
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
    
    try {
      // If no expenses, return empty result
      if (!expenses || expenses.length === 0) {
        setSimplifiedDebts([]);
        setIsLoading(false);
        return;
      }
      
      // Step 1: Calculate net balances for each user
      const balances = {};
      
      // Initialize balances for all members
      members.forEach(member => {
        balances[member._id] = 0;
      });
      
      // Process all expenses
      expenses.forEach(expense => {
        // The person who paid gets credit
        if (!balances[expense.paidBy]) {
          balances[expense.paidBy] = 0;
        }
        balances[expense.paidBy] += expense.amount;
        
        // Each person in the split owes money
        if (expense.splits && Array.isArray(expense.splits)) {
          expense.splits.forEach(split => {
            if (!balances[split.userId]) {
              balances[split.userId] = 0;
            }
            balances[split.userId] -= split.amount;
          });
        }
      });
      
      // Step 2: Separate into debtors and creditors
      const debtors = [];
      const creditors = [];
      
      Object.entries(balances).forEach(([userId, balance]) => {
        // Round to 2 decimal places to avoid floating point issues
        const roundedBalance = Math.round(balance * 100) / 100;
        
        if (roundedBalance < -0.01) {
          debtors.push({ userId, amount: -roundedBalance });
        } else if (roundedBalance > 0.01) {
          creditors.push({ userId, amount: roundedBalance });
        }
        // Ignore users with zero balance (or very close to zero)
      });
      
      // Sort by amount (largest first)
      debtors.sort((a, b) => b.amount - a.amount);
      creditors.sort((a, b) => b.amount - a.amount);
      
      // Step 3: Create simplified payments
      const payments = [];
      
      while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];
        
        // Calculate payment amount (minimum of debt or credit)
        const paymentAmount = Math.min(debtor.amount, creditor.amount);
        
        // Round to 2 decimal places
        const roundedAmount = Math.round(paymentAmount * 100) / 100;
        
        if (roundedAmount > 0.01) {
          payments.push({
            from: debtor.userId,
            to: creditor.userId,
            amount: roundedAmount
          });
        }
        
        // Update balances
        debtor.amount -= paymentAmount;
        creditor.amount -= paymentAmount;
        
        // Remove users with zero balance
        if (debtor.amount < 0.01) {
          debtors.shift();
        }
        
        if (creditor.amount < 0.01) {
          creditors.shift();
        }
      }
      
      // Check if there's any remaining balance (due to rounding errors)
      const remainingDebtors = debtors.filter(d => d.amount > 0.01);
      const remainingCreditors = creditors.filter(c => c.amount > 0.01);
      
      if (remainingDebtors.length > 0 || remainingCreditors.length > 0) {
        const totalRemaining = remainingDebtors.reduce((sum, d) => sum + d.amount, 0) || 
                              remainingCreditors.reduce((sum, c) => sum + c.amount, 0) || 0;
        
        if (totalRemaining > 0.1) {
          // Only show warning if the amount is significant (more than 10 cents)
          toast.warning(`There's a small imbalance of $${totalRemaining.toFixed(2)} in the calculations. This might be due to rounding.`);
        }
      }
      
      setSimplifiedDebts(payments);
      setError(null);
    } catch (error) {
      console.error("Error calculating debts:", error);
      toast.error("Error calculating debts. Please try again.");
      setError("Failed to calculate debts. Please try again.");
      setSimplifiedDebts([]);
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
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Simplified Payments</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-10 h-10 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mr-3"></div>
          <span className="text-gray-600">Calculating payments...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      ) : simplifiedDebts.length === 0 ? (
        <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
          <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 font-medium">Everyone is settled up!</p>
          <p className="text-green-600 text-sm mt-1">No payments needed.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {simplifiedDebts.map((debt, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {getUserName(debt.from).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="mx-3 text-gray-800 font-medium">{getUserName(debt.from)}</div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="mx-3 text-gray-800 font-medium">{getUserName(debt.to)}</div>
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium">
                      {getUserName(debt.to).charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-lg font-semibold text-indigo-600">${debt.amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug info - can be removed in production */}
      <div className="mt-6 text-xs text-gray-400 flex justify-between items-center">
        <span>Group: {groupId}</span>
        <div className="flex space-x-3">
          <span>Expenses: {debugInfo.expenses}</span>
          <span>Members: {debugInfo.members}</span>
        </div>
      </div>
    </div>
  );
}
