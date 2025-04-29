'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { getGroups, getGroupById, getGroupMembers, getGroupExpenses, initializeStorage } from '../lib/local-storage';
import GroupManager from '../components/GroupManager';
import ExpenseManager from '../components/ExpenseManager';
import DebtSimplifier from '../components/DebtSimplifier';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'members'
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  // Initialize localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeStorage();
    }
  }, []);

  // Load user groups
  useEffect(() => {
    if (user) {
      const allGroups = getGroups();
      setUserGroups(allGroups);
    }
  }, [user, refreshTrigger]);

  // Load selected group data
  useEffect(() => {
    if (selectedGroupId && selectedGroupId !== 'new') {
      const group = getGroupById(selectedGroupId);
      setSelectedGroup(group);
      
      const members = getGroupMembers(selectedGroupId);
      setGroupMembers(members);
      
      const expenses = getGroupExpenses(selectedGroupId);
      setGroupExpenses(expenses);
    } else {
      setSelectedGroup(null);
      setGroupMembers([]);
      setGroupExpenses([]);
    }
  }, [selectedGroupId, refreshTrigger]);

  // Check URL for group parameter on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const groupParam = urlParams.get('group');
      if (groupParam) {
        setSelectedGroupId(groupParam);
      }
    }
  }, []);

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  // Show loading state while the user is being loaded
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Loading SplitSplit...</h2>
          <p className="text-gray-600">Just a moment while we set things up for you.</p>
        </div>
      </div>
    );
  }

  // Make sure we have a user before rendering the main content
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Getting things ready...</h2>
          <p className="text-gray-600 mb-6">We're setting up your account.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Decorative background elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">SplitSplit</h1>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button 
                onClick={handleGoToHome}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - Groups */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Groups</h2>
              
              {userGroups.length === 0 ? (
                <div>
                  <p className="mb-6 text-gray-600">You don't have any groups yet.</p>
                  <button
                    onClick={() => setSelectedGroupId('new')}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Create Your First Group
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedGroupId('new')}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm mb-6"
                  >
                    Create New Group
                  </button>
                  
                  <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2">
                    {userGroups.map((group) => (
                      <div 
                        key={group._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedGroupId === group._id 
                            ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                            : 'hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedGroupId(group._id);
                          setActiveTab('expenses');
                        }}
                      >
                        <h3 className="font-medium text-gray-800">{group.name}</h3>
                        {group.description && (
                          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {selectedGroupId === 'new' ? (
              <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Create New Group</h2>
                <GroupManager userId={user._id} onGroupCreated={refreshData} />
              </div>
            ) : selectedGroupId ? (
              <div className="space-y-6">
                {/* Group Header with Tabs */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {selectedGroup ? selectedGroup.name : 'Loading group...'}
                    </h2>
                    {selectedGroup?.description && (
                      <p className="text-gray-600 mt-1">{selectedGroup.description}</p>
                    )}
                    <div className="flex mt-6">
                      <button
                        className={`px-6 py-2 font-medium rounded-t-lg transition-colors ${
                          activeTab === 'expenses' 
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('expenses')}
                      >
                        Expenses
                      </button>
                      <button
                        className={`px-6 py-2 font-medium rounded-t-lg transition-colors ${
                          activeTab === 'members' 
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('members')}
                      >
                        Members
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'expenses' ? (
                      <ExpenseManager 
                        groupId={selectedGroupId} 
                        userId={user._id} 
                        expenses={groupExpenses}
                        onExpenseAdded={refreshData}
                        onExpenseDeleted={refreshData}
                      />
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-800">Group Members</h3>
                        
                        {/* Add Member Form */}
                        <div className="p-4 bg-indigo-50 rounded-lg mb-6">
                          <GroupManager 
                            userId={user._id} 
                            selectedGroupId={selectedGroupId}
                            onMemberAdded={refreshData}
                          />
                        </div>
                        
                        {/* Member List */}
                        {groupMembers.length === 0 ? (
                          <p className="text-gray-600">No members yet. Add some above!</p>
                        ) : (
                          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                            {groupMembers.map((member) => (
                              <div key={member._id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-indigo-600 font-medium">
                                    {member.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{member.name}</p>
                                  <p className="text-sm text-gray-600">{member.email}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Debt Simplifier */}
                {activeTab === 'expenses' && (
                  <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                    <DebtSimplifier 
                      groupId={selectedGroupId} 
                      expenses={groupExpenses} 
                      members={groupMembers} 
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                <svg className="w-16 h-16 text-indigo-200 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Select a Group</h3>
                <p className="text-gray-600 max-w-md">
                  Choose a group from the sidebar or create a new one to get started with expense tracking.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
