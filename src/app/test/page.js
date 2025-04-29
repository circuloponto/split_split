"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function TestPage() {
  const { user, isSignedIn } = useUser();
  const [groupName, setGroupName] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  
  // Mutations
  const createUser = useMutation(api.users.createOrUpdate);
  const createGroup = useMutation(api.groups.create);
  const createExpense = useMutation(api.expenses.create);
  
  // Queries
  const userGroups = useQuery(api.groups.getByUser, 
    isSignedIn ? { userId: user.id } : null
  );
  
  // Handle user creation/update when signed in
  const handleSyncUser = async () => {
    if (!isSignedIn) return;
    
    await createUser({
      id: user.id,
      name: user.fullName || user.username,
      email: user.primaryEmailAddress.emailAddress,
      avatarUrl: user.imageUrl,
    });
    
    alert("User synchronized with Convex!");
  };
  
  // Handle group creation
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return;
    
    const result = await createGroup({
      name: groupName,
      description: "Created from test page",
      createdBy: user.id,
      initialMembers: [user.id],
    });
    
    setGroupName("");
    alert(`Group created with ID: ${result}`);
  };
  
  // Handle expense creation
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!isSignedIn || !userGroups || userGroups.length === 0) return;
    
    const groupId = userGroups[0]._id;
    
    const result = await createExpense({
      groupId,
      description: expenseDescription,
      amount: parseFloat(expenseAmount),
      paidBy: user.id,
      splits: [{ userId: user.id, amount: parseFloat(expenseAmount) }],
    });
    
    setExpenseDescription("");
    setExpenseAmount("");
    alert(`Expense created with ID: ${result}`);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SplitSplit Test Page</h1>
      
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Authentication</h2>
        {isSignedIn ? (
          <div>
            <p className="mb-2">Signed in as: {user.fullName || user.username}</p>
            <div className="flex gap-2">
              <button 
                onClick={handleSyncUser}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Sync User with Convex
              </button>
              <SignOutButton>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        ) : (
          <SignInButton>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
      
      {isSignedIn && (
        <>
          <div className="mb-8 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Create Group</h2>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                className="border p-2 rounded"
                required
              />
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create Group
              </button>
            </form>
          </div>
          
          <div className="mb-8 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Your Groups</h2>
            {!userGroups ? (
              <p>Loading groups...</p>
            ) : userGroups.length === 0 ? (
              <p>No groups found. Create one above!</p>
            ) : (
              <ul className="list-disc pl-5">
                {userGroups.map((group) => (
                  <li key={group._id}>
                    {group.name} - Created at {new Date(group.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {userGroups && userGroups.length > 0 && (
            <div className="mb-8 p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">Add Expense to {userGroups[0].name}</h2>
              <form onSubmit={handleCreateExpense} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="Description"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Amount"
                  step="0.01"
                  min="0.01"
                  className="border p-2 rounded"
                  required
                />
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Expense
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
