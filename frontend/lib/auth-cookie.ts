/**
 * Session cookie for Next.js middleware: middleware can't read localStorage,
 * so we set a same-site cookie when the user has a valid session (login/refresh).
 * Cleared on logout. Used only for route protection (redirect to /login).
 */

const COOKIE_NAME = "auth_session";
const MAX_AGE_DAYS = 30;

export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  const value = "1";
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
