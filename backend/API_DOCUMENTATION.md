# API Documentation

## Как это устроено

Swagger поднят через **NestJS** (`@nestjs/swagger`). В `main.ts` создаётся OpenAPI-документ (DocumentBuilder + SwaggerModule), подключается Bearer Auth, UI монтируется по пути `api-docs`. Документ собирается автоматически из контроллеров: маршруты и типы Nest подхватываются, а теги и описания задаются декораторами в коде.

- **Swagger UI** — интерактивная документация и «Try it out».
- **OpenAPI JSON** — по фиксированному URL (см. ниже), для генерации типов на фронте и импорта в Postman.

## 📚 Swagger UI

После запуска бэкенда (`pnpm run dev` в `backend/`):

**http://localhost:5001/api-docs** (порт из `PORT` в `.env`, по умолчанию 5000/5001)

В UI можно:

- Смотреть все эндпоинты по тегам (Health, Auth, Users).
- Для защищённых маршрутов нажать **Authorize**, ввести `Bearer <accessToken>` и вызывать запросы из браузера.
- Смотреть описание операций и коды ответов (добавлены декораторы `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth()`).

## 📥 OpenAPI JSON

Схема в формате OpenAPI 3.0 доступна по адресу:

**http://localhost:5001/api-docs-json**

(Путь всегда `{путь_UI}-json`: в `main.ts` задан `api-docs`, значит JSON — `api-docs-json`.)

Использование:

- **openapi-typescript** — генерация TypeScript-типов для фронта.
- **Postman / Insomnia** — импорт по этому URL.
- **swagger-codegen** и др. — генерация клиентов.

## 🔧 Как добавить описание нового endpoint

В контроллере добавь декораторы Nest Swagger:

- `@ApiTags('ИмяГруппы')` на класс контроллера.
- `@ApiOperation({ summary: '...' })` — краткое описание.
- `@ApiResponse({ status: 200, description: '...' })` и при необходимости 400, 401, 404.
- Для маршрутов с JWT: `@ApiBearerAuth()` (в конфиге уже включён `addBearerAuth()`).

Валидация по-прежнему через Zod (схемы в `auth/schemas/`, `users/schemas/`). Если нужно отобразить в Swagger точные поля body, можно добавить DTO-классы с `@ApiProperty()` или вручную описать схему в `@ApiBody()`; для базового описания эндпоинтов текущих декораторов достаточно.

## 📖 Полезные ссылки

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)

## 🎯 Для фронтенда

### Генерация TypeScript типов

```bash
# Установить openapi-typescript
pnpm add -D openapi-typescript

# Убедиться, что backend запущен; затем сгенерировать типы
npx openapi-typescript http://localhost:5001/api-docs-json -o src/types/api.ts
```

(Путь к JSON-схеме уточни в Swagger UI или в коде `main.ts`.)

### Использование в коде

```typescript
import type { paths } from './types/api';

// Типы для запросов и ответов автоматически доступны
type RegisterRequest = paths['/api/auth/register']['post']['requestBody']['content']['application/json'];
type RegisterResponse = paths['/api/auth/register']['post']['responses']['201']['content']['application/json'];
```
