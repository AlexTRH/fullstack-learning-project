# Быстрый старт

## 1. Установка зависимостей

### Backend

```bash
cd backend
pnpm install
```

### Frontend (пока не обязательно, но можно)

```bash
cd frontend
pnpm install
```

## 2. Настройка базы данных

### Запуск PostgreSQL через Docker

```bash
# В корне проекта
docker-compose up -d
```

Проверь, что контейнер запущен:

```bash
docker ps
```

### Создание .env файла для backend

Скопируй пример:

```bash
cd backend
cp .env.example .env
```

Заполни `.env` файл:

```env
PORT=5000
NODE_ENV=development

# Database (из docker-compose.yml)
DATABASE_URL="postgresql://user:password@localhost:5432/fullstack_db?schema=public"

# JWT (сгенерируй случайные строки)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=http://localhost:3000
```

**Важно:** Замени `JWT_SECRET` и `JWT_REFRESH_SECRET` на случайные строки (минимум 32 символа).

## 3. Инициализация базы данных

```bash
cd backend

# Генерируем Prisma Client
pnpm exec prisma generate

# Применяем схему к БД
pnpm exec prisma db push
```

Проверь, что всё создалось:

```bash
# Открыть Prisma Studio (визуальный редактор БД)
pnpm run db:studio
```

## 4. Запуск backend

```bash
cd backend
pnpm run dev
```

Сервер запустится на <http://localhost:5001> (или PORT из .env)

**Примечание:** Если порт 5000 занят (часто macOS AirPlay Receiver), измени PORT в `.env` на другой (например, 5001).

Проверь:

```bash
curl http://localhost:5001/health
# Должен вернуть: {"status":"ok","timestamp":"..."}
```

## 5. Тестирование API

### Регистрация

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234",
    "name": "Test User"
  }'
```

### Логин

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Сохрани `accessToken` и `refreshToken` из ответа.

### Проверка защищённого роута

```bash
curl -X POST http://localhost:5001/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Полезные команды

### Prisma

```bash
cd backend
pnpm run db:studio    # Открыть Prisma Studio
pnpm run db:push      # Применить изменения схемы
pnpm run db:migrate   # Создать миграцию
```

### Backend

```bash
cd backend
pnpm run dev          # Запуск в dev режиме
pnpm run build        # Сборка
pnpm run start        # Запуск production версии
pnpm run lint         # Проверка кода
```

## Структура проекта

```
backend/
├── src/
│   ├── auth/            # Модуль аутентификации (NestJS)
│   ├── users/           # Модуль пользователей
│   ├── prisma/          # PrismaService
│   ├── common/          # guards, filters, decorators
│   ├── presentation/validators/  # Zod схемы валидации
│   └── main.ts          # Точка входа
└── prisma/
    └── schema.prisma    # Схема БД
```

## Следующие шаги

После того как всё запустится:

1. Протестируй AUTH endpoints
2. Начнём реализовывать USER/PROFILE endpoints
3. Затем POSTS, COMMENTS и т.д.
