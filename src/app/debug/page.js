"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { getToken } = useAuth();
  const [issuer, setIssuer] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function debugToken() {
      try {
        const token = await getToken({ template: "convex" });
        if (!token) {
          setError("No token returned. Make sure you have created a JWT template named 'convex' in your Clerk dashboard.");
          return;
        }
        
        // Decode the JWT to see its contents
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token payload:", payload);
          setIssuer(payload.iss);
        }
      } catch (error) {
        console.error("Error getting token:", error);
        setError(error.message);
      }
    }
    
    debugToken();
  }, [getToken]);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debugging Clerk-Convex Integration</h1>
      
      {error ? (
        <div className="bg-red-50 p-4 rounded-md mb-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      ) : null}
      
      {issuer ? (
        <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
          <h2 className="text-lg font-semibold text-green-700">Clerk Issuer Found</h2>
          <p className="font-mono bg-white p-2 rounded border mt-2">{issuer}</p>
          <div className="mt-4">
            <h3 className="font-semibold">Next Steps:</h3>
            <ol className="list-decimal ml-5 mt-2 space-y-2">
              <li>Copy this issuer URL</li>
              <li>Update your <code className="bg-gray-100 px-1 rounded">convex.config.js</code> file with this exact domain</li>
              <li>Make sure you have a JWT template named "convex" in your Clerk dashboard</li>
              <li>Restart your Convex server with <code className="bg-gray-100 px-1 rounded">npx convex dev</code></li>
            </ol>
          </div>
        </div>
      ) : !error ? (
        <p>Loading token information...</p>
      ) : null}
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-700">Clerk JWT Template Instructions</h2>
        <p className="mt-2">In your Clerk dashboard:</p>
        <ol className="list-decimal ml-5 mt-2 space-y-2">
          <li>Go to JWT Templates</li>
          <li>Create a template named exactly <code className="bg-gray-100 px-1 rounded">convex</code> (case-sensitive)</li>
          <li>Add a claim with key <code className="bg-gray-100 px-1 rounded">userId</code> and value <code className="bg-gray-100 px-1 rounded">{"{{user.id}}"}</code></li>
          <li>Save the template</li>
        </ol>
      </div>
    </div>
  );
}
