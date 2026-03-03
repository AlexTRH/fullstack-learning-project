# Архитектура backend (Clean Architecture + NestJS)

## Слои и зависимости

Зависимости направлены **внутрь**: внешние слои знают о внутренних, не наоборот.

```
┌─────────────────────────────────────────────────────────────────┐
│  Presentation (HTTP)                                             │
│  auth/*, users/* — контроллеры + схемы валидации (Zod)           │
│  common/ — guards, filters, pipes, decorators                    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ использует
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Application (Use cases)                                         │
│  application/use-cases/ — чистая логика, без фреймворка          │
└───────────────────────────────┬─────────────────────────────────┘
                                │ использует интерфейсы из
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Domain                                                          │
│  domain/entities/, domain/interfaces/ — сущности и контракты      │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │ реализуют
┌───────────────────────────────┴─────────────────────────────────┐
│  Infrastructure                                                    │
│  infrastructure/ — репозитории (Prisma), TokenService, PasswordHasher │
│  prisma/ — PrismaService (обёртка над PrismaClient)                │
└───────────────────────────────────────────────────────────────────┘
```

## Роль каждого слоя в проекте

### Domain (`domain/`)

- **entities/** — типы и сущности (User, Auth, Follow). Без логики БД и HTTP.
- **interfaces/** — контракты репозиториев и сервисов (UserRepository, TokenService, PasswordHasher и т.д.).

Ничего из Nest сюда не импортируется. Слой не знает ни про HTTP, ни про Prisma.

### Application (`application/use-cases/`)

- **use-cases** — функции или классы с бизнес-логикой. Принимают входные данные и объект зависимостей (репозитории, сервисы).
- Не импортируют Nest, Express, Prisma. Только domain и свои типы.

Пример: `registerUseCase(input, { userRepository, refreshTokenRepository, tokenService, passwordHasher })`.

### Infrastructure (`infrastructure/`, `prisma/`)

- **Реализации** интерфейсов из domain: PrismaUserRepository, JwtTokenService, BcryptPasswordHasher и т.д.
- Регистрируются в Nest через **InfrastructureModule** (providers, useFactory).
- **prisma/** — PrismaService (singleton для PrismaClient), подключается через PrismaModule.

Слой знает про Prisma и внешние библиотеки (bcrypt, jwt). Не знает про HTTP или use cases (только реализует интерфейсы).

### Presentation (Nest-модули `auth/`, `users/` + `common/`)

Это **адаптер для HTTP**: превращает запросы в вызовы приложения и ответы в JSON.

- **Контроллер** — маршруты, вызов Guard/Pipe, вызов сервиса, формирование `{ success, data }`.
- **Сервис модуля** (AuthService, UsersService) — тонкая обёртка: получает зависимости через Nest DI и вызывает **use case**.
- **Схемы валидации** — Zod-схемы для body (в папке модуля: `auth/schemas/`, `users/schemas/`). Используются в контроллере через ZodValidationPipe.
- **common/** — переиспользуемые guards (JwtAuthGuard), filters (HttpExceptionFilter), pipes (ZodValidationPipe), decorators (@CurrentUser).

Правило: контроллер не вызывает use case напрямую — только через сервис модуля. Сервис не знает про Request/Response, только про входные данные и типы из domain/application.

## Где что лежит

| Что | Где |
|-----|-----|
| Сущности, интерфейсы | `domain/` |
| Use cases | `application/use-cases/` |
| Реализации репозиториев, JWT, bcrypt | `infrastructure/` |
| PrismaClient | `prisma/PrismaService` |
| HTTP: маршруты, валидация, ответы | `auth/`, `users/` (контроллеры + schemas) |
| Общая HTTP-логика | `common/` |
| Точка входа, Swagger, middleware | `main.ts`, `app.module.ts` |

## Поток запроса

1. **HTTP** → `main.ts` (Nest), маршрут попадает в **Controller**.
2. **Controller** — Guard (JWT при необходимости), Pipe (Zod для body), вызов **ModuleService**.
3. **ModuleService** — собирает зависимости (уже инжектированы Nest) и вызывает **use case**.
4. **Use case** — обращается к репозиториям/сервисам через интерфейсы, возвращает данные.
5. **Controller** — оборачивает результат в `{ success: true, data }` или отдаёт ошибку через **HttpExceptionFilter**.

## Зачем так делать

- **Domain и use cases** можно тестировать и переиспользовать без Nest и БД (подставляешь моки).
- **Смена фреймворка или БД** затрагивает только infrastructure и presentation, не бизнес-логику.
- **Чёткие границы**: контроллеры тонкие, вся логика — в use cases и домене.
