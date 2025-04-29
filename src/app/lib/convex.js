"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";

// Create a Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
