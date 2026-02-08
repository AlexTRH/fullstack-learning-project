# Fullstack Learning Project

Учебный fullstack проект для изучения современных технологий.

## 🛠 Технологический стек

### Backend
- **Node.js** 20+ с TypeScript
- **NestJS** - веб-фреймворк
- **PostgreSQL** - база данных
- **Prisma** - ORM
- **JWT** - аутентификация
- **Zod** - валидация
- **Helmet, CORS, Compression** - безопасность и оптимизация

### Frontend
- **Next.js 16** (App Router) с TypeScript
- **Tailwind CSS** - стилизация
- **Zustand** - state management
- **TanStack Query** - data fetching и кэширование
- **shadcn/ui** - UI компоненты
- **React Hook Form + Zod** - формы и валидация
- **Axios** - HTTP клиент

## 🚀 Быстрый старт

### Требования
- Node.js 20+
- pnpm (рекомендуется) или npm/yarn
- Docker и Docker Compose (для PostgreSQL)

### Установка

1. **Клонируй репозиторий** (если есть)

2. **Запусти PostgreSQL через Docker:**
```bash
docker-compose up -d
```

3. **Настрой Backend:**
```bash
cd backend
pnpm install
cp .env.example .env  # и заполни переменные
pnpm exec prisma generate
pnpm exec prisma db push
pnpm run dev
```

4. **Настрой Frontend:**
```bash
cd frontend
pnpm install
cp .env.example .env  # и заполни переменные
pnpm run dev
```

5. **Открой браузер:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: `cd backend && pnpm run db:studio`

## 📁 Структура проекта

```
fullstack-learning-project/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── auth/          # модуль аутентификации
│   │   ├── users/         # модуль пользователей
│   │   ├── prisma/        # PrismaService
│   │   ├── common/        # guards, filters, decorators
│   │   └── main.ts        # точка входа
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/          # Next.js приложение
│   ├── app/           # App Router
│   ├── components/    # React компоненты
│   ├── lib/           # Утилиты, API клиент
│   ├── stores/        # Zustand stores
│   └── package.json
├── shared/            # Общие типы (опционально)
└── docker-compose.yml
```

## 📝 Следующие шаги

1. Настрой аутентификацию (JWT)
2. Создай первую модель данных
3. Реализуй CRUD операции
4. Добавь ISR для статических страниц в Next.js

## 🔗 Полезные ссылки

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com)
