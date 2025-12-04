# Инструкция по настройке

## Установка зависимостей

### Backend
```bash
cd backend
pnpm install
```

### Frontend
```bash
cd frontend
pnpm install
```

## Настройка shadcn/ui

После установки зависимостей, можно добавлять компоненты shadcn/ui:

```bash
cd frontend
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# и т.д.
```

Или добавить все популярные компоненты сразу:
```bash
npx shadcn@latest add button card input label form select textarea dialog dropdown-menu
```

## Настройка переменных окружения

### Backend
```bash
cd backend
cp .env.example .env
# Отредактируй .env и заполни:
# - DATABASE_URL (для Prisma)
# - JWT_SECRET и JWT_REFRESH_SECRET
# - FRONTEND_URL
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Отредактируй .env и заполни:
# - NEXT_PUBLIC_API_URL (обычно http://localhost:5000)
```

## Запуск PostgreSQL

```bash
# В корне проекта
docker-compose up -d
```

## Инициализация базы данных

```bash
cd backend
pnpm exec prisma generate
pnpm exec prisma db push
```

## Запуск проекта

### Backend (терминал 1)
```bash
cd backend
pnpm run dev
```

### Frontend (терминал 2)
```bash
cd frontend
pnpm run dev
```

## Полезные команды

### Prisma
```bash
cd backend
pnpm run db:studio  # Открыть Prisma Studio
pnpm run db:migrate # Создать миграцию
pnpm run db:push    # Применить изменения схемы
```

### Frontend
```bash
cd frontend
pnpm run build      # Сборка для production
pnpm run start      # Запуск production версии
```

## ISR (Incremental Static Regeneration)

ISR уже настроен в Next.js. Пример использования:
- `app/example-isr/page.tsx` - пример страницы с ISR
- Используй `export const revalidate = 60` для настройки интервала регенерации
- Или `{ next: { revalidate: 60 } }` в fetch запросах

## Структура проекта

```
backend/
  src/
    controllers/    # Контроллеры для обработки запросов
    routes/         # API роуты
    middleware/     # Express middleware
    utils/          # Утилиты
    server.ts       # Точка входа

frontend/
  app/              # Next.js App Router
  components/       # React компоненты
    ui/             # shadcn/ui компоненты (будут добавлены)
  lib/              # Утилиты, API клиент
  stores/           # Zustand stores
  hooks/             # Custom React hooks (создай при необходимости)
```


