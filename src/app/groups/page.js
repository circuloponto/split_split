'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import { users, groups, balances } from '../utils/mockData';

export default function Groups() {
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we would fetch the current user from Supabase
    // For now, we'll use the first user from our mock data
    const user = users[0];

    // Get groups the user is a member of
    const filteredGroups = groups.filter(group => 
      group.members.includes(user.id)
    );

    // Get balances for each group
    const groupsWithBalances = filteredGroups.map(group => {
      const userBalance = balances.find(
        balance => balance.userId === user.id && balance.groupId === group.id
      );
      
      return {
        ...group,
        balance: userBalance ? userBalance.balance : 0
      };
    });

    setUserGroups(groupsWithBalances);
    setIsLoading(false);
  }, []);

  // Helper function to get member names for a group
  const getMemberNames = (memberIds) => {
    return memberIds.map(id => {
      const user = users.find(u => u.id === id);
      return user ? user.name : 'Unknown User';
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
            <h1 className="text-2xl font-semibold text-gray-900">Your Groups</h1>
            <Link
              href="/groups/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Create Group
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
          {userGroups.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No groups</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new group.</p>
              <div className="mt-6">
                <Link
                  href="/groups/new"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Create Group
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{group.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        group.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {group.balance >= 0 
                          ? `You are owed $${group.balance.toFixed(2)}`
                          : `You owe $${Math.abs(group.balance).toFixed(2)}`
                        }
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Total expenses: ${group.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="text-sm text-gray-500">
                      <p className="font-medium text-gray-700 mb-1">Members:</p>
                      <ul className="list-disc list-inside">
                        {getMemberNames(group.members).map((name, index) => (
                          <li key={index} className="truncate">{name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6 bg-gray-50">
                    <div className="flex justify-between">
                      <Link
                        href={`/groups/${group.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View details
                      </Link>
                      <Link
                        href={`/expenses/new?groupId=${group.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Add expense
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
