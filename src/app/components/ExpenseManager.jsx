"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { getGroupMembers, addExpense, getGroupExpenses, deleteExpense } from "../lib/local-storage";
import toast from 'react-hot-toast';

export default function ExpenseManager({ 
  groupId, 
  userId, 
  expenses = [], 
  onExpenseAdded, 
  onExpenseDeleted 
}) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("equal"); // equal, custom
  const [customSplits, setCustomSplits] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState(expenses);
  
  // Use the passed userId or get it from auth context
  const currentUserId = userId || (user ? user._id : null);
  
  // Load group members
  useEffect(() => {
    if (groupId) {
      const members = getGroupMembers(groupId);
      setGroupMembers(members);
    }
  }, [groupId]);
  
  // Set the current user as the payer by default when members load
  useEffect(() => {
    if (groupMembers && groupMembers.length > 0 && !paidBy && currentUserId) {
      const currentUser = groupMembers.find(member => member._id === currentUserId);
      if (currentUser) {
        setPaidBy(currentUser._id);
      }
    }
  }, [groupMembers, currentUserId, paidBy]);
  
  // Initialize custom splits when members change or amount changes
  useEffect(() => {
    if (groupMembers && groupMembers.length > 0) {
      const numMembers = groupMembers.length;
      // Initialize with equal percentages (100% divided by number of members)
      const equalPercentage = (100 / numMembers).toFixed(1);
      
      const initialSplits = {};
      groupMembers.forEach(member => {
        initialSplits[member._id] = equalPercentage;
      });
      setCustomSplits(initialSplits);
    }
  }, [groupMembers]);
  
  // Update expenses when props change
  useEffect(() => {
    setGroupExpenses(expenses);
  }, [expenses]);
  
  // Handle expense creation
  const handleCreateExpense = (e) => {
    e.preventDefault();
    
    if (!groupId || !paidBy || !amount || !description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate splits based on the selected split type
      let splits = [];
      const totalAmount = parseFloat(amount);
      
      if (splitType === "equal") {
        // Equal split among all members
        const splitAmount = totalAmount / groupMembers.length;
        // Make sure the split amount is rounded to 2 decimal places
        const roundedSplitAmount = Math.round(splitAmount * 100) / 100;
        
        splits = groupMembers.map(member => ({
          userId: member._id,
          amount: roundedSplitAmount
        }));
        
        // Adjust the last split to account for rounding errors
        const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
        if (Math.abs(totalSplit - totalAmount) > 0.01) {
          const adjustment = totalAmount - totalSplit;
          splits[splits.length - 1].amount = Math.round((splits[splits.length - 1].amount + adjustment) * 100) / 100;
        }
      } else if (splitType === "custom") {
        // Custom split based on percentages
        const totalAmount = parseFloat(amount);
        
        // First truncate all percentages to 1 decimal place
        const truncatedSplits = {};
        Object.entries(customSplits).forEach(([userId, percentage]) => {
          truncatedSplits[userId] = parseFloat(parseFloat(percentage).toFixed(1));
        });
        
        // Validate that the sum of percentages is close to 100%
        const totalAllocated = Object.values(truncatedSplits).reduce(
          (sum, val) => sum + (val || 0), 
          0
        );
        
        const isBalanced = Math.abs(totalAllocated - 100) < 0.1;
        if (!isBalanced) {
          toast.error(`The sum of percentages (${totalAllocated.toFixed(1)}%) should equal 100%`);
          setIsSubmitting(false);
          return;
        }
        
        splits = Object.entries(truncatedSplits).map(([userId, percentage]) => {
          const percentValue = percentage || 0;
          // Calculate the actual amount based on the percentage
          const splitAmount = (percentValue / 100) * totalAmount;
          return {
            userId,
            amount: Math.round(splitAmount * 100) / 100 || 0
          };
        });
        
        // Adjust the last split to account for rounding errors
        const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
        if (Math.abs(totalSplit - totalAmount) > 0.01) {
          const adjustment = totalAmount - totalSplit;
          splits[splits.length - 1].amount = Math.round((splits[splits.length - 1].amount + adjustment) * 100) / 100;
        }
      }
      
      // Create the expense using localStorage
      const newExpense = {
        groupId,
        description,
        amount: totalAmount,
        paidBy,
        date: Date.now(),
        splits
      };
      
      console.log("Creating new expense:", newExpense);
      
      const createdExpense = addExpense(newExpense);
      console.log("Created expense:", createdExpense);
      
      // Update the local state with the new expense
      setGroupExpenses(prev => [...prev, createdExpense]);
      
      // Reset form
      setDescription("");
      setAmount("");
      setSplitType("equal");
      
      toast.success("Expense added successfully!");
      
      // Call the callback to refresh parent component data
      if (typeof onExpenseAdded === 'function') {
        onExpenseAdded();
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle expense deletion
  const handleDeleteExpense = (expenseId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Delete the expense
      deleteExpense(expenseId);
      
      // Update local state
      setGroupExpenses(prev => prev.filter(expense => expense._id !== expenseId));
      
      toast.success("Expense deleted successfully!");
      
      // Call the callback to refresh parent component data
      if (typeof onExpenseDeleted === 'function') {
        onExpenseDeleted();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle custom split change
  const handleSplitChange = (userId, value) => {
    setCustomSplits(prev => ({
      ...prev,
      [userId]: value
    }));
  };
  
  // Helper function to get user name from ID
  const getUserName = (userId) => {
    if (!groupMembers) return userId;
    const member = groupMembers.find(m => m._id === userId);
    return member ? member.name : userId;
  };
  
  if (!groupMembers || groupMembers.length === 0) {
    return <div className="text-gray-600">No group members found. Please add members to the group first.</div>;
  }
  
  // Calculate the total allocated amount for custom splits
  const totalAllocated = Object.values(customSplits).reduce(
    (sum, val) => sum + (parseFloat(val) || 0), 
    0
  );
  
  // Check if the allocated percentage is close to 100%
  const isBalanced = Math.abs(totalAllocated - 100) < 0.1;
  
  return (
    <div className="space-y-8">
      {/* Add Expense Form */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Expense</h2>
        <form onSubmit={handleCreateExpense} className="space-y-5">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Dinner at Restaurant"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
          
          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
              Paid By
            </label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            >
              <option value="">Select a member</option>
              {groupMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="equal"
                  checked={splitType === "equal"}
                  onChange={() => setSplitType("equal")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Equal Split</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="custom"
                  checked={splitType === "custom"}
                  onChange={() => setSplitType("custom")}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Custom Split</span>
              </label>
            </div>
          </div>
          
          {splitType === "custom" && (
            <div className="border p-5 rounded-lg bg-indigo-50 border-indigo-100">
              <h3 className="text-sm font-medium mb-3 text-indigo-800">Custom Split</h3>
              <div className="space-y-3">
                {groupMembers.map(member => (
                  <div key={member._id} className="flex items-center">
                    <label className="w-1/3 text-sm text-gray-700">{member.name}</label>
                    <div className="w-2/3 flex items-center">
                      <input
                        type="number"
                        value={customSplits[member._id] === '0' ? '' : customSplits[member._id] || ''}
                        onChange={(e) => {
                          // Allow direct input of values, don't truncate yet
                          handleSplitChange(member._id, e.target.value === '' ? '0' : e.target.value);
                        }}
                        className="flex-1 border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                      <span className="ml-2 text-gray-600">%</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-sm mt-3 font-medium">
                  <span>Total:</span>
                  <span className={isBalanced ? "text-green-600" : "text-red-600"}>
                    {totalAllocated.toFixed(1)}% / 100%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || (splitType === "custom" && !isBalanced)}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-sm transition-all 
              ${isSubmitting || (splitType === "custom" && !isBalanced) 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow"}`}
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
      
      {/* Expense List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Expenses</h2>
        {groupExpenses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-600">No expenses yet. Add your first expense above!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {groupExpenses.map(expense => (
              <div key={expense._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{expense.description}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-semibold text-indigo-600">${expense.amount.toFixed(2)}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">Paid by {getUserName(expense.paidBy)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(expense.date).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteExpense(expense._id, e)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
