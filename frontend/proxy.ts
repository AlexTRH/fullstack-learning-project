import { NextRequest, NextResponse } from "next/server";
import { useAuthStore } from "./stores/useAuthStore";

export function proxy(request: NextRequest) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: "/dashboard",
};
