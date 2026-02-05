"use client";

import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionRestore } from "@/features/auth/SessionRestore";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionRestore />
      {children}
    </QueryClientProvider>
  );
}


