"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth-cookie";
import api from "@/lib/api";
import type { GetMeResponse } from "@/features/profile/api";

/**
 * Restores session on app load: if we have token or refreshToken in store
 * (after rehydration from localStorage), fetches current user via getMe
 * or refresh + getMe and updates the store.
 */
export function SessionRestore() {
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;

    const run = () => {
      const { token, refreshToken, setUser, setToken, logout } =
        useAuthStore.getState();

      if (token) {
        attempted.current = true;
        api
          .get<{ success: boolean; data: GetMeResponse }>("/api/users/me")
          .then((res) => {
            const u = res.data.data;
            setUser({
              id: u.id,
              email: u.email,
              username: u.username,
              name: u.name ?? undefined,
            });
            setAuthCookie();
          })
          .catch(() => {
            // 401: interceptor tried refresh and may have logged out
            // Other errors: don't clear session, just leave as is
          });
        return;
      }

      if (refreshToken) {
        const baseURL = process.env.NEXT_PUBLIC_API_URL;
        if (!baseURL) return;
        attempted.current = true;
        axios
          .post<{ success: boolean; data: { accessToken: string } }>(
            `${baseURL}/api/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((res) => {
            const accessToken = res.data.data.accessToken;
            setToken(accessToken);
            return api.get<{ success: boolean; data: GetMeResponse }>(
              "/api/users/me"
            );
          })
          .then((res) => {
            const u = res.data.data;
            setUser({
              id: u.id,
              email: u.email,
              username: u.username,
              name: u.name ?? undefined,
            });
            setAuthCookie();
          })
          .catch(() => {
            clearAuthCookie();
            logout();
          });
      }
    };

    // Run after a tick so zustand persist has time to rehydrate from localStorage
    const t = setTimeout(run, 0);
    return () => clearTimeout(t);
  }, []);

  return null;
}
