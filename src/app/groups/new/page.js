'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../components/AuthLayout';
import { users } from '../../utils/mockData';

export default function NewGroup() {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // In a real app, we would fetch the current user from Supabase
  // For now, we'll use the first user from our mock data
  const currentUser = users[0];
  
  // Filter out the current user from the list of potential members
  const potentialMembers = users.filter(user => user.id !== currentUser.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For now, we'll just simulate creating a group with mock data
      // Later, we'll integrate with Supabase
      console.log('Creating group:', {
        name: groupName,
        members: [...selectedMembers, currentUser.id]
      });
      
      // Mock successful group creation
      setTimeout(() => {
        // Redirect to groups page
        router.push('/groups');
      }, 1000);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <AuthLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              href="/groups"
              className="mr-4 text-indigo-600 hover:text-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Group</h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Group Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="group-name"
                    name="group-name"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="e.g., Trip to Paris, Apartment 4B"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Add Group Members
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  You will be automatically added to this group.
                </p>
                <div className="mt-2 space-y-3">
                  {potentialMembers.map((member) => (
                    <div key={member.id} className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id={`member-${member.id}`}
                          name={`member-${member.id}`}
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => toggleMember(member.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor={`member-${member.id}`} className="font-medium text-gray-900">
                          {member.name}
                        </label>
                        <p className="text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !groupName.trim()}
                  className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Group...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
