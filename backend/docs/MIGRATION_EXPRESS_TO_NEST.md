# Миграция с Express на NestJS — завершена

Ветка: `feature/express-to-nest-backend`  
База: `development`

## Итог

Бэкенд полностью переведён на **NestJS**. Код Express (server.ts, routes, controllers, middleware, swagger-jsdoc) удалён.

### Текущая точка входа и скрипты

- **Точка входа:** `src/main.ts` — bootstrap Nest, helmet, compression, morgan, CORS, глобальный ExceptionFilter, Swagger на `/api-docs`.
- **Скрипты:** `pnpm run dev` (tsx watch src/main.ts), `pnpm run build`, `pnpm run start`. Отдельных скриптов для Express больше нет.

### Структура backend (NestJS)

```
backend/src/
├── main.ts                    # bootstrap Nest
├── app.module.ts
├── app.controller.ts          # GET /health, GET /api
├── common/
│   ├── filters/http-exception.filter.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── decorators/current-user.decorator.ts
│   └── pipes/                  # ZodValidationPipe
├── auth/                       # AuthModule, AuthController, AuthService
├── users/                      # UsersModule, UsersController, UsersService
├── prisma/                     # PrismaModule, PrismaService
├── infrastructure/             # репозитории, TokenService, PasswordHasher
├── domain/                     # entities, interfaces
├── application/use-cases/      # use cases
├── auth/schemas/               # Zod-схемы для auth
└── users/schemas/              # Zod-схемы для users
```

### Проверка работоспособности

1. В каталоге `backend`: `pnpm run db:generate`, затем `pnpm run dev` или `pnpm run build` и `pnpm start`.
2. Эндпоинты: `/health`, `/api`, `api/auth/*`, `api/users/*` — те же пути и форматы ответов, что были в Express.
3. Swagger UI: http://localhost:5001/api-docs (через Nest DocumentBuilder).

### Соответствие маршрутов и контрактов

| Маршрут | Метод | Примечание |
|--------|--------|-------------|
| /health | GET | `{ status, timestamp }` |
| /api | GET | `{ message }` |
| api/auth/register | POST | 201, `{ success, data }` |
| api/auth/login | POST | 200, `{ success, data }` |
| api/auth/refresh | POST | 200, `{ success, data }` |
| api/auth/logout | POST | JWT обязателен, 200, `{ success, message }` |
| api/users/me | GET/PUT | JWT, `{ success, data }` |
| api/users/:id | GET | Публичный профиль |
| api/users/:id/followers, following, follow | GET/POST | как раньше |

Формат ошибок: `{ success: false, message }`; коды HTTP 400, 401, 404, 409, 500 сохранены.

### Что удалено (Express)

- `server.ts`
- Папка `presentation/` удалена; валидаторы перенесены в `auth/schemas/`, `users/schemas/`
- `infrastructure/dependencies.ts`, `infrastructure/database/prisma.ts`

Откат на Express не предусмотрен; при необходимости смотри историю коммитов.
