// Mock data for users
export const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
];

// Mock data for groups
export const groups = [
  { 
    id: 1, 
    name: 'Vacation Trip', 
    description: 'Trip to Barcelona', 
    createdBy: 1, 
    members: [1, 2, 3, 4], 
    createdAt: '2025-03-15T10:00:00Z',
    totalExpenses: 1250.75
  },
  { 
    id: 2, 
    name: 'Apartment', 
    description: 'Shared apartment expenses', 
    createdBy: 2, 
    members: [2, 3, 5], 
    createdAt: '2025-02-01T14:30:00Z',
    totalExpenses: 875.50
  },
  { 
    id: 3, 
    name: 'Dinner Party', 
    description: 'Monthly dinner gathering', 
    createdBy: 4, 
    members: [1, 3, 4, 5], 
    createdAt: '2025-04-05T19:15:00Z',
    totalExpenses: 320.25
  }
];

// Mock data for expenses
export const expenses = [
  {
    id: 1,
    groupId: 1,
    description: 'Hotel Booking',
    amount: 750.00,
    paidBy: 1,
    splitBetween: [1, 2, 3, 4],
    splitType: 'equal',
    date: '2025-03-16T12:00:00Z',
    category: 'accommodation'
  },
  {
    id: 2,
    groupId: 1,
    description: 'Dinner at Restaurant',
    amount: 200.75,
    paidBy: 2,
    splitBetween: [1, 2, 3, 4],
    splitType: 'equal',
    date: '2025-03-17T20:30:00Z',
    category: 'food'
  },
  {
    id: 3,
    groupId: 1,
    description: 'Museum Tickets',
    amount: 100.00,
    paidBy: 3,
    splitBetween: [1, 2, 3],
    splitType: 'equal',
    date: '2025-03-18T14:00:00Z',
    category: 'entertainment'
  },
  {
    id: 4,
    groupId: 1,
    description: 'Taxi Rides',
    amount: 80.00,
    paidBy: 4,
    splitBetween: [1, 2, 3, 4],
    splitType: 'equal',
    date: '2025-03-19T09:45:00Z',
    category: 'transportation'
  },
  {
    id: 5,
    groupId: 1,
    description: 'Souvenirs',
    amount: 120.00,
    paidBy: 1,
    splitBetween: [1, 2, 3, 4],
    splitType: 'equal',
    date: '2025-03-20T16:20:00Z',
    category: 'shopping'
  },
  {
    id: 6,
    groupId: 2,
    description: 'Rent',
    amount: 600.00,
    paidBy: 2,
    splitBetween: [2, 3, 5],
    splitType: 'equal',
    date: '2025-02-01T10:00:00Z',
    category: 'housing'
  },
  {
    id: 7,
    groupId: 2,
    description: 'Electricity Bill',
    amount: 90.00,
    paidBy: 3,
    splitBetween: [2, 3, 5],
    splitType: 'equal',
    date: '2025-02-05T11:30:00Z',
    category: 'utilities'
  },
  {
    id: 8,
    groupId: 2,
    description: 'Internet Bill',
    amount: 75.50,
    paidBy: 5,
    splitBetween: [2, 3, 5],
    splitType: 'equal',
    date: '2025-02-06T14:15:00Z',
    category: 'utilities'
  },
  {
    id: 9,
    groupId: 2,
    description: 'Groceries',
    amount: 110.00,
    paidBy: 2,
    splitBetween: [2, 3, 5],
    splitType: 'equal',
    date: '2025-02-10T17:45:00Z',
    category: 'food'
  },
  {
    id: 10,
    groupId: 3,
    description: 'Food and Drinks',
    amount: 250.25,
    paidBy: 4,
    splitBetween: [1, 3, 4, 5],
    splitType: 'equal',
    date: '2025-04-05T19:30:00Z',
    category: 'food'
  },
  {
    id: 11,
    groupId: 3,
    description: 'Decorations',
    amount: 45.00,
    paidBy: 1,
    splitBetween: [1, 3, 4, 5],
    splitType: 'equal',
    date: '2025-04-05T15:00:00Z',
    category: 'home'
  },
  {
    id: 12,
    groupId: 3,
    description: 'Dessert',
    amount: 25.00,
    paidBy: 5,
    splitBetween: [1, 3, 4, 5],
    splitType: 'equal',
    date: '2025-04-05T18:00:00Z',
    category: 'food'
  }
];

// Mock data for balances (what each user owes or is owed)
export const balances = [
  // Group 1 balances
  { id: 1, groupId: 1, userId: 1, balance: 125.75 }, // Positive means user is owed money
  { id: 2, groupId: 1, userId: 2, balance: -50.25 }, // Negative means user owes money
  { id: 3, groupId: 1, userId: 3, balance: -25.50 },
  { id: 4, groupId: 1, userId: 4, balance: -50.00 },
  
  // Group 2 balances
  { id: 5, groupId: 2, userId: 2, balance: 110.00 },
  { id: 6, groupId: 2, userId: 3, balance: -30.00 },
  { id: 7, groupId: 2, userId: 5, balance: -80.00 },
  
  // Group 3 balances
  { id: 8, groupId: 3, userId: 1, balance: -35.06 },
  { id: 9, groupId: 3, userId: 3, balance: -80.06 },
  { id: 10, groupId: 3, userId: 4, balance: 170.19 },
  { id: 11, groupId: 3, userId: 5, balance: -55.07 }
];

// Mock data for simplified debts (after running the debt simplification algorithm)
export const simplifiedDebts = [
  // Group 1 simplified debts
  { id: 1, groupId: 1, fromUserId: 2, toUserId: 1, amount: 50.25 },
  { id: 2, groupId: 1, fromUserId: 3, toUserId: 1, amount: 25.50 },
  { id: 3, groupId: 1, fromUserId: 4, toUserId: 1, amount: 50.00 },
  
  // Group 2 simplified debts
  { id: 4, groupId: 2, fromUserId: 3, toUserId: 2, amount: 30.00 },
  { id: 5, groupId: 2, fromUserId: 5, toUserId: 2, amount: 80.00 },
  
  // Group 3 simplified debts
  { id: 6, groupId: 3, fromUserId: 1, toUserId: 4, amount: 35.06 },
  { id: 7, groupId: 3, fromUserId: 3, toUserId: 4, amount: 80.06 },
  { id: 8, groupId: 3, fromUserId: 5, toUserId: 4, amount: 55.07 }
];

// Mock data for transactions (payments made between users)
export const transactions = [
  { 
    id: 1, 
    groupId: 1, 
    fromUserId: 2, 
    toUserId: 1, 
    amount: 30.00, 
    date: '2025-03-21T10:15:00Z',
    status: 'completed',
    notes: 'Partial payment for vacation expenses'
  },
  { 
    id: 2, 
    groupId: 2, 
    fromUserId: 5, 
    toUserId: 2, 
    amount: 80.00, 
    date: '2025-02-15T16:30:00Z',
    status: 'completed',
    notes: 'Payment for rent and utilities'
  },
  { 
    id: 3, 
    groupId: 3, 
    fromUserId: 3, 
    toUserId: 4, 
    amount: 50.00, 
    date: '2025-04-07T14:45:00Z',
    status: 'completed',
    notes: 'Dinner party expenses'
  }
];

// Categories for expenses
export const categories = [
  { id: 'food', name: 'Food & Drinks', icon: '🍔' },
  { id: 'transportation', name: 'Transportation', icon: '🚗' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'housing', name: 'Housing', icon: '🏠' },
  { id: 'home', name: 'Home', icon: '🏡' },
  { id: 'other', name: 'Other', icon: '📦' }
];
