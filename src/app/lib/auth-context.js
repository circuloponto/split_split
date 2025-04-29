"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from './local-storage';

// Create a simplified auth context with a localStorage user
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component using localStorage
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize user from localStorage
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Get or create user from localStorage
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
      }
      
      setIsLoading(false);
    }
  }, []);
  
  // Auth context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
