import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Must match AUTH_COOKIE_NAME in lib/auth-cookie.ts (used for Edge; no @/ in middleware) */
const AUTH_COOKIE_NAME = "auth_session";
const PROTECTED_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }
  const hasSession = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
