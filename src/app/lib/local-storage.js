

// Helper to generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Initialize storage with default data if needed
export const initializeStorage = () => {
  if (!localStorage.getItem('groups')) {
    localStorage.setItem('groups', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('members')) {
    localStorage.setItem('members', JSON.stringify([]));
  }
};

// Group operations
export const getGroups = () => {
  try {
    return JSON.parse(localStorage.getItem('groups') || '[]');
  } catch (error) {
    console.error('Error getting groups from localStorage:', error);
    return [];
  }
};

export const createGroup = (group) => {
  try {
    const groups = getGroups();
    const newGroup = {
      ...group,
      _id: generateId(),
      createdAt: Date.now()
    };
    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));
    return newGroup;
  } catch (error) {
    console.error('Error creating group in localStorage:', error);
    return null;
  }
};

export const getGroupById = (groupId) => {
  try {
    const groups = getGroups();
    return groups.find(group => group._id === groupId) || null;
  } catch (error) {
    console.error('Error getting group by ID from localStorage:', error);
    return null;
  }
};

export const updateGroup = (groupId, updatedData) => {
  try {
    const groups = getGroups();
    const index = groups.findIndex(group => group._id === groupId);
    
    if (index !== -1) {
      groups[index] = { ...groups[index], ...updatedData };
      localStorage.setItem('groups', JSON.stringify(groups));
      return groups[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating group in localStorage:', error);
    return null;
  }
};

export const deleteGroup = (groupId) => {
  try {
    const groups = getGroups();
    const filteredGroups = groups.filter(group => group._id !== groupId);
    localStorage.setItem('groups', JSON.stringify(filteredGroups));
    
    // Also delete all related members and expenses
    const members = getMembers();
    const filteredMembers = members.filter(member => member.groupId !== groupId);
    localStorage.setItem('members', JSON.stringify(filteredMembers));
    
    const expenses = getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.groupId !== groupId);
    localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
    
    return true;
  } catch (error) {
    console.error('Error deleting group from localStorage:', error);
    return false;
  }
};

// Member operations
export const getMembers = () => {
  try {
    return JSON.parse(localStorage.getItem('members') || '[]');
  } catch (error) {
    console.error('Error getting members from localStorage:', error);
    return [];
  }
};

export const getGroupMembers = (groupId) => {
  try {
    const members = getMembers();
    return members.filter(member => member.groupId === groupId);
  } catch (error) {
    console.error('Error getting group members from localStorage:', error);
    return [];
  }
};

export const addMember = (member) => {
  try {
    const members = getMembers();
    const newMember = {
      ...member,
      _id: generateId(),
      joinedAt: Date.now()
    };
    members.push(newMember);
    localStorage.setItem('members', JSON.stringify(members));
    return newMember;
  } catch (error) {
    console.error('Error adding member in localStorage:', error);
    return null;
  }
};

export const updateMember = (memberId, updatedData) => {
  try {
    const members = getMembers();
    const index = members.findIndex(member => member._id === memberId);
    
    if (index !== -1) {
      members[index] = { ...members[index], ...updatedData };
      localStorage.setItem('members', JSON.stringify(members));
      return members[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating member in localStorage:', error);
    return null;
  }
};

export const deleteMember = (memberId) => {
  try {
    const members = getMembers();
    const filteredMembers = members.filter(member => member._id !== memberId);
    localStorage.setItem('members', JSON.stringify(filteredMembers));
    return true;
  } catch (error) {
    console.error('Error deleting member from localStorage:', error);
    return false;
  }
};

// Expense operations
export const getExpenses = () => {
  try {
    return JSON.parse(localStorage.getItem('expenses') || '[]');
  } catch (error) {
    console.error('Error getting expenses from localStorage:', error);
    return [];
  }
};

export const getGroupExpenses = (groupId) => {
  try {
    const expenses = getExpenses();
    const groupExpenses = expenses.filter(expense => expense.groupId === groupId);
    console.log(`Found ${groupExpenses.length} expenses for group ${groupId}:`, groupExpenses);
    return groupExpenses;
  } catch (error) {
    console.error('Error getting group expenses from localStorage:', error);
    return [];
  }
};

export const addExpense = (expense) => {
  try {
    // Ensure the expense has the correct structure
    const validatedExpense = {
      groupId: expense.groupId,
      description: expense.description || 'Expense',
      amount: parseFloat(expense.amount) || 0,
      paidBy: expense.paidBy,
      date: expense.date || Date.now(),
      _id: generateId(),
      createdAt: Date.now(),
      splits: []
    };
    
    // Validate and normalize splits
    if (expense.splits && Array.isArray(expense.splits)) {
      validatedExpense.splits = expense.splits.map(split => ({
        userId: split.userId,
        amount: parseFloat(split.amount) || 0
      }));
    }
    
    console.log("Adding validated expense:", validatedExpense);
    
    const expenses = getExpenses();
    expenses.push(validatedExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    console.log("All expenses after adding:", expenses);
    
    return validatedExpense;
  } catch (error) {
    console.error('Error adding expense in localStorage:', error);
    return null;
  }
};

export const updateExpense = (expenseId, updatedData) => {
  try {
    const expenses = getExpenses();
    const index = expenses.findIndex(expense => expense._id === expenseId);
    
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updatedData };
      localStorage.setItem('expenses', JSON.stringify(expenses));
      return expenses[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating expense in localStorage:', error);
    return null;
  }
};

export const deleteExpense = (expenseId) => {
  try {
    console.log("Deleting expense with ID:", expenseId);
    const expenses = getExpenses();
    console.log("Current expenses:", expenses);
    
    const filteredExpenses = expenses.filter(expense => expense._id !== expenseId);
    console.log("Filtered expenses:", filteredExpenses);
    
    localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
    return true;
  } catch (error) {
    console.error('Error deleting expense from localStorage:', error);
    return false;
  }
};

// User operations - simplified since we don't need authentication
export const getCurrentUser = () => {
  try {
    let user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // If no user exists, create a default one
    if (!user) {
      user = {
        _id: generateId(),
        name: 'User',
        email: 'user@example.com',
        createdAt: Date.now()
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user from localStorage:', error);
    return null;
  }
};

export const updateCurrentUser = (updatedData) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  } catch (error) {
    console.error('Error updating current user in localStorage:', error);
    return null;
  }
};
