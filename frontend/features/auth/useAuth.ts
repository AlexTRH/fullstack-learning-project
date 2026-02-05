import { useAuthStore } from "@/stores/useAuthStore";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth-cookie";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { SignUpFormUserData } from "./types";
import type { SignUpResponse, LoginResponse } from "./types";
import type { LoginFormData } from "./types";

export function useAuth() {
  const { setUser, setToken, setRefreshToken, logout } = useAuthStore((s) => s);

  async function signUp(userData: SignUpFormUserData) {
    try {
      const { data } = await api.post<SignUpResponse>(`/api/auth/register`, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        name: userData.fullname,
      });

      const user = data.data.user;
      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      setUser({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name ?? undefined,
      });
      setToken(accessToken);
      setRefreshToken(refreshToken ?? null);
      setAuthCookie();
      return { ok: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response !== undefined) {
        return { ok: false, error: error.response.data.message };
      }

      return { ok: false, error: "Something went wrong" };
    }
  }

  async function login(credentials: LoginFormData) {
    try {
      const { data } = await api.post<LoginResponse>("/api/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const user = data.data.user;
      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      setUser({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name ?? undefined,
      });
      setToken(accessToken);
      setRefreshToken(refreshToken ?? null);
      setAuthCookie();
      return { ok: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response !== undefined) {
        const msg = error.response.data?.message ?? error.message;
        return { ok: false, error: msg };
      }
      const msg =
        error instanceof Error ? error.message : "Something went wrong";
      return {
        ok: false,
        error: msg === "Network Error" ? "Backend unreachable. Check that it runs and NEXT_PUBLIC_API_URL is correct." : msg,
      };
    }
  }

  async function signOut() {
    const refreshToken = useAuthStore.getState().refreshToken;
    try {
      await api.post(
        `/api/auth/logout`,
        { refreshToken: refreshToken ?? undefined },
        { withCredentials: true }
      );
      return { ok: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return { ok: false, error: error.response.data.message };
      }
      return { ok: false, error: "Something went wrong" };
    } finally {
      clearAuthCookie();
      logout();
    }
  }

  return { signUp, login, signOut };
}
