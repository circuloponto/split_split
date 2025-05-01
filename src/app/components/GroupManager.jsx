"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { createGroup, getGroups, addMember, getGroupMembers, deleteGroup } from "../lib/local-storage";
import toast from 'react-hot-toast';

export default function GroupManager({ 
  userId, 
  selectedGroupId: initialGroupId,
  onGroupCreated,
  onMemberAdded,
  setSelectedGroupId
}) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [internalSelectedGroupId, setInternalSelectedGroupId] = useState(initialGroupId || null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  
  // Update selectedGroupId when initialGroupId changes
  useEffect(() => {
    if (initialGroupId) {
      setInternalSelectedGroupId(initialGroupId);
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
    if (internalSelectedGroupId) {
      const members = getGroupMembers(internalSelectedGroupId);
      setGroupMembers(members);
    }
  }, [internalSelectedGroupId]);
  
  // Handle group creation
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!currentUserId) {
      console.error("No user ID available");
      toast.error("User ID not available. Please try again later.");
      return;
    }
    
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
      
      // Update the selected group ID directly instead of redirecting
      if (typeof setSelectedGroupId === 'function') {
        setSelectedGroupId(newGroup._id);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    }
  };
  
  // Handle adding a new member to the group
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!initialGroupId || !newMemberEmail || !newMemberName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsAddingMember(true);
    
    try {
      // Add member to the group
      addMember({
        groupId: initialGroupId,
        name: newMemberName,
        email: newMemberEmail
      });
      
      // Update the members list
      const members = getGroupMembers(initialGroupId);
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
  
  // Handle group deletion
  const handleDeleteGroup = (e, groupId) => {
    e.stopPropagation(); // Prevent triggering the group selection
    
    if (window.confirm("Are you sure you want to delete this group? All expenses and members will be deleted as well.")) {
      try {
        const success = deleteGroup(groupId);
        
        if (success) {
          // Refresh the groups list
          const allGroups = getGroups();
          setUserGroups(allGroups);
          
          // If the deleted group was selected, clear the selection
          if (internalSelectedGroupId === groupId && typeof setSelectedGroupId === 'function') {
            setSelectedGroupId(null);
          }
          
          toast.success("Group deleted successfully!");
          
          // Call the callback to refresh parent component data
          if (typeof onGroupCreated === 'function') {
            onGroupCreated();
          }
        } else {
          toast.error("Failed to delete group. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.error("Failed to delete group. Please try again.");
      }
    }
  };
  
  // Handle group selection
  const handleSelectGroup = (groupId) => {
    setInternalSelectedGroupId(groupId);
    setNewMemberEmail("");
    setNewMemberName("");
    
    // Update parent component's selected group if function is provided
    if (typeof setSelectedGroupId === 'function') {
      setSelectedGroupId(groupId);
    }
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
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Create Group
          </button>
        </form>
      </div>
      
      {/* Group List */}
      <div className="p-4 border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
        
        {userGroups.length === 0 ? (
          <p>You don&apos;t have any groups yet. Create one above!</p>
        ) : (
          <div className="space-y-2">
            {userGroups.map((group) => (
              <div 
                key={group._id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  internalSelectedGroupId === group._id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center" onClick={() => handleSelectGroup(group._id)}>
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-600">{group.description}</p>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleDeleteGroup(e, group._id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Delete group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
