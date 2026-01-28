import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

interface InternalAxiosRequestWithRetry extends InternalAxiosRequestConfig {
  retry: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
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
      try {
        originalRequest.retry = true;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.data.accessToken;

        useAuthStore.getState().setToken(newAccessToken);
        return api(originalRequest);
      } catch (error) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
