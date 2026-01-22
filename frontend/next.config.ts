import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ISR настройки
  experimental: {
    // Включаем ISR для статических страниц
  },
  // Переменные окружения для API
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  },
};

export default nextConfig;
