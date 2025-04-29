"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { createGroup, getGroups, addMember, getGroupMembers } from "../lib/local-storage";
import toast from 'react-hot-toast';

export default function GroupManager({ 
  userId, 
  selectedGroupId: initialGroupId,
  onGroupCreated,
  onMemberAdded
}) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId || null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  
  // Update selectedGroupId when initialGroupId changes
  useEffect(() => {
    if (initialGroupId) {
      setSelectedGroupId(initialGroupId);
    }
  }, [initialGroupId]);
  
  // Use the passed userId or get it from auth context
  const currentUserId = userId || (user ? user._id : null);
  
  // Load user groups
  useEffect(() => {
    if (currentUserId) {
      const allGroups = getGroups();
      // Filter groups where the user is a member
      setUserGroups(allGroups);
    }
  }, [currentUserId]);
  
  // Load group members when selectedGroupId changes
  useEffect(() => {
    if (selectedGroupId) {
      const members = getGroupMembers(selectedGroupId);
      setGroupMembers(members);
    }
  }, [selectedGroupId]);
  
  // Handle group creation
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!currentUserId) {
      console.error("No user ID available");
      toast.error("User ID not available. Please try again later.");
      return;
    }
    
    setIsCreatingGroup(true);
    
    try {
      console.log("Creating group with user ID:", currentUserId);
      
      const newGroup = createGroup({
        name: groupName,
        description: groupDescription,
        createdBy: currentUserId,
      });
      
      // Add the creator as a member
      addMember({
        groupId: newGroup._id,
        name: user.name,
        email: user.email
      });
      
      setGroupName("");
      setGroupDescription("");
      
      // Call the callback to refresh parent component data
      if (typeof onGroupCreated === 'function') {
        onGroupCreated();
      }
      
      toast.success("Group created successfully!");
      
      // Redirect to the new group
      window.location.href = `/dashboard?group=${newGroup._id}`;
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    } finally {
      setIsCreatingGroup(false);
    }
  };
  
  // Handle adding a new member to the group
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!selectedGroupId || !newMemberEmail || !newMemberName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsAddingMember(true);
    
    try {
      // Add member to the group
      addMember({
        groupId: selectedGroupId,
        name: newMemberName,
        email: newMemberEmail
      });
      
      // Update the members list
      const members = getGroupMembers(selectedGroupId);
      setGroupMembers(members);
      
      setNewMemberEmail("");
      setNewMemberName("");
      
      // Call the callback to refresh parent component data
      if (typeof onMemberAdded === 'function') {
        onMemberAdded();
      }
      
      toast.success("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member. Please try again.");
    } finally {
      setIsAddingMember(false);
    }
  };
  
  // Handle group selection
  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setNewMemberEmail("");
    setNewMemberName("");
  };
  
  // If we're in the Members tab, only show the add member form
  if (initialGroupId) {
    return (
      <div>
        <form onSubmit={handleAddMember} className="space-y-4">
          <h3 className="text-md font-medium mb-2">Add New Member</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Email address"
              required
            />
            <button
              type="submit"
              disabled={isAddingMember}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isAddingMember ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  // Otherwise, show the full group management UI
  return (
    <div className="space-y-8">
      {/* Create Group Form */}
      <div className="p-4 border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Trip to Paris"
              required
            />
          </div>
          
          <div>
            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Expenses for our summer trip"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            disabled={isCreatingGroup}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isCreatingGroup ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
      
      {/* Group List */}
      <div className="p-4 border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
        
        {userGroups.length === 0 ? (
          <p>You don't have any groups yet. Create one above!</p>
        ) : (
          <div className="space-y-2">
            {userGroups.map((group) => (
              <div 
                key={group._id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedGroupId === group._id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelectGroup(group._id)}
              >
                <h3 className="font-medium">{group.name}</h3>
                {group.description && (
                  <p className="text-sm text-gray-600">{group.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
