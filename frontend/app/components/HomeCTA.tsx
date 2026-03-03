"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

export function HomeCTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return (
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/settings"
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2"
        >
          Profile settings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Link
        href="/login"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2"
      >
        Sign up
      </Link>
    </div>
  );
}
