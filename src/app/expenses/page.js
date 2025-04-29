'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import { users, groups, expenses } from '../utils/mockData';

export default function Expenses() {
  const [userExpenses, setUserExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we would fetch the current user from Supabase
    // For now, we'll use the first user from our mock data
    const user = users[0];

    // Get groups the user is a member of
    const userGroupIds = groups
      .filter(group => group.members.includes(user.id))
      .map(group => group.id);

    // Get expenses for those groups
    const filteredExpenses = expenses
      .filter(expense => userGroupIds.includes(expense.groupId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setUserExpenses(filteredExpenses);
    setIsLoading(false);
  }, []);

  // Helper function to get group name by ID
  const getGroupName = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  };

  // Helper function to get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
            <Link
              href="/expenses/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Add Expense
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
          {userExpenses.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new expense.</p>
              <div className="mt-6">
                <Link
                  href="/expenses/new"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Add Expense
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {userExpenses.map((expense) => (
                  <li key={expense.id}>
                    <Link href={`/expenses/${expense.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <span className="text-lg">$</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {expense.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {getGroupName(expense.groupId)} • Paid by {getUserName(expense.paidBy)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-medium text-gray-900">${expense.amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <span className="truncate">{expense.category}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
