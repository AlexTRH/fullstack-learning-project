import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor для добавления токена
api.interceptors.request.use(
  (config) => {
    // Токен будет добавляться через interceptor или через TanStack Query
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Обработка неавторизованного доступа
      // Можно добавить редирект на логин
    }
    return Promise.reject(error);
  }
);

export default api;


