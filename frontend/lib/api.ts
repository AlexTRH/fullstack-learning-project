import axios, { InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

interface InternalAxiosRequestWithRetry extends InternalAxiosRequestConfig {
  retry: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${useAuthStore.getState().token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestWithRetry;

    if (
      error.response?.status === 401 &&
      !originalRequest.retry &&
      axios.isAxiosError(error)
    ) {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
      try {
        originalRequest.retry = true;

        const baseURL = process.env.NEXT_PUBLIC_API_URL;
        if (!baseURL) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
        const response = await axios.post(
          `${baseURL}/api/auth/refresh`,
          { refreshToken },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccessToken = response.data.data.accessToken;
        useAuthStore.getState().setToken(newAccessToken);
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
