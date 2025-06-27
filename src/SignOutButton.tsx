"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Button } from "./components/ui/button";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) return null;

  return (
    <Button className="px-12" onClick={() => void signOut()} variant="outline">
      Sign out
    </Button>
  );
}
