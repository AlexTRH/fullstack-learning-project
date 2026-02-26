"use client";

import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionRestore } from "@/features/auth/SessionRestore";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionRestore />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}


