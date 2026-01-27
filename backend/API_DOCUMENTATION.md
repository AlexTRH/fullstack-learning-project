# API Documentation

## 📚 Swagger UI

После запуска сервера, документация доступна по адресу:

**<http://localhost:5001/api-docs>**

Здесь вы можете:

- Просмотреть все доступные endpoints
- Увидеть схемы запросов и ответов
- Протестировать API прямо в браузере
- Скопировать примеры запросов

## 📥 OpenAPI JSON Schema

Для генерации TypeScript типов на фронтенде, используйте:

**<http://localhost:5001/api-docs.json>**

Эта схема может быть использована с инструментами типа:

- `openapi-typescript` - генерация TypeScript типов
- `swagger-codegen` - генерация клиентов
- Postman - импорт API

## 🔧 Как добавить документацию к новому endpoint

Документация вынесена в отдельные файлы для чистоты кода:

**Структура:**

```
backend/src/presentation/swagger/docs/
├── auth.js      # Документация для auth endpoints
└── users.js     # Документация для user endpoints
```

**Добавление нового endpoint:**

1. Откройте соответствующий файл в `swagger/docs/` (или создайте новый)
2. Добавьте JSDoc комментарий с `@swagger` тегом:

```javascript
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/UserPublic' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
```

1. Роут в `routes/*.ts` остается чистым:

```typescript
router.get('/:id', getUserById);
```

## 📖 Полезные ссылки

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc Examples](https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md)

## 🎯 Для фронтенда

### Генерация TypeScript типов

```bash
# Установить openapi-typescript
pnpm add -D openapi-typescript

# Генерация типов
npx openapi-typescript http://localhost:5001/api-docs.json -o src/types/api.ts
```

### Использование в коде

```typescript
import type { paths } from './types/api';

// Типы для запросов и ответов автоматически доступны
type RegisterRequest = paths['/api/auth/register']['post']['requestBody']['content']['application/json'];
type RegisterResponse = paths['/api/auth/register']['post']['responses']['201']['content']['application/json'];
```
