import { useAuthStore } from "@/stores/useAuthStore";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { SignUpFormUserData } from "./types";
import type { SignUpResponse } from "./types";

export function useAuth() {
  const { setUser, setToken, logout, token } = useAuthStore((s) => s);

  async function signUp(userData: SignUpFormUserData) {
    try {
      const { data } = await api.post<SignUpResponse>(`/api/auth/register`, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        name: userData.fullname,
      });

      const user = data.data.user;
      const token = data.data.accessToken;

      setUser({ name: user.name, email: user.email, id: user.id });
      setToken(token);
      return { ok: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response !== undefined) {
        return { ok: false, error: error.response.data.message };
      }

      return { ok: false, error: "Something went wrong" };
    }
  }

  async function signOut() {
    try {
      await api.post(
        `/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      logout();
      return { ok: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response !== undefined) {
        return { ok: false, error: error.response.data.message };
      }

      return { ok: false, error: "Something went wrong" };
    }
  }

  return { signUp, signOut };
}
