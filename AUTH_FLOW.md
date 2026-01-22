# Подробное описание аутентификации на Backend

## 🏗 Архитектура компонентов

```
HTTP Request
    ↓
Express Server (server.ts)
    ↓
Routes (routes/authRoutes.ts) - определяет пути
    ↓
Middleware (validate, authenticate) - валидация и проверка токена
    ↓
Controller (controllers/authController.ts) - бизнес-логика
    ↓
Utils (jwt.ts, bcrypt.ts) - работа с токенами и паролями
    ↓
Prisma Client (lib/prisma.ts) - запросы к БД
    ↓
PostgreSQL (Docker)
```

---

## 📋 Компоненты системы

### 1. **Routes** (`routes/authRoutes.ts`)

**Назначение:** Определяет URL пути и подключает middleware/контроллеры

```typescript
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refresh);
router.post("/logout", authenticate, logout);
```

**Что происходит:**

- `POST /api/auth/register` → валидация → контроллер `register`
- `POST /api/auth/login` → валидация → контроллер `login`
- `POST /api/auth/refresh` → валидация → контроллер `refresh`
- `POST /api/auth/logout` → проверка токена → контроллер `logout`

**Порядок выполнения:**

1. Сначала выполняется `validate()` middleware
2. Затем `authenticate()` (только для logout)
3. Потом контроллер

---

### 2. **Validators** (`validators/auth.ts`)

**Назначение:** Zod схемы для валидации входящих данных

#### `registerSchema`

```typescript
{
  body: {
    email: string (должен быть валидным email)
    username: string (3-30 символов, только буквы/цифры/_)
    password: string (мин. 8 символов, заглавная, строчная, цифра)
    name: string (опционально, 1-100 символов)
  }
}
```

#### `loginSchema`

```typescript
{
  body: {
    email: string (валидный email)
    password: string (не пустой)
  }
}
```

#### `refreshTokenSchema`

```typescript
{
  body: {
    refreshToken: string (не пустой)
  }
}
```

**Что проверяется:**

- Формат данных (типы)
- Длина строк
- Регулярные выражения (email, username)
- Обязательные поля

---

### 3. **Validation Middleware** (`middleware/validate.ts`)

**Назначение:** Выполняет валидацию через Zod перед контроллером

**Как работает:**

```typescript
export const validate = (schema: ZodSchema) => {
  return (req, res, next) => {
    try {
      // Парсит body, query, params через Zod схему
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // Всё ОК, идём дальше
    } catch (error) {
      if (error instanceof ZodError) {
        // Берём первую ошибку и возвращаем 400
        next(new AppError(`Validation error: ${errors[0].message}`, 400));
      }
    }
  };
};
```

**Что происходит:**

1. Принимает Zod схему
2. Пытается распарсить `req.body`, `req.query`, `req.params`
3. Если ошибка → возвращает 400 с сообщением
4. Если ОК → вызывает `next()` для перехода к контроллеру

**Пример ошибки:**

```json
{
  "success": false,
  "message": "Validation error: Password must be at least 8 characters"
}
```

---

### 4. **Auth Middleware** (`middleware/auth.ts`)

**Назначение:** Проверяет JWT токен и добавляет `userId` в запрос

**Как работает:**

```typescript
export const authenticate = (req: AuthRequest, res, next) => {
  // 1. Извлекает заголовок Authorization
  const authHeader = req.headers.authorization;

  // 2. Проверяет формат "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401);
  }

  // 3. Извлекает токен (убирает "Bearer ")
  const token = authHeader.substring(7);

  // 4. Проверяет и декодирует токен
  const payload = verifyAccessToken(token);

  // 5. Добавляет userId и email в req
  req.userId = payload.userId;
  req.userEmail = payload.email;

  // 6. Переходит к контроллеру
  next();
};
```

**Что добавляется в `req`:**

- `req.userId` - ID пользователя из токена
- `req.userEmail` - email пользователя из токена

**Тип `AuthRequest`:**

```typescript
interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}
```

**Ошибки:**

- Нет заголовка → `401: No token provided`
- Неверный формат → `401: No token provided`
- Неверный/истёкший токен → `401: Invalid or expired token`

---

### 5. **JWT Utils** (`utils/jwt.ts`)

**Назначение:** Генерация и проверка JWT токенов

#### Конфигурация

```typescript
JWT_SECRET - секретный ключ для access токенов
JWT_REFRESH_SECRET - секретный ключ для refresh токенов
JWT_EXPIRES_IN - время жизни access токена (15 минут)
JWT_REFRESH_EXPIRES_IN - время жизни refresh токена (30 дней)
```

#### `generateAccessToken(payload)`

```typescript
// Создаёт JWT токен с payload { userId, email }
// Подписывает JWT_SECRET
// Время жизни: 15 минут
// Возвращает строку токена
```

#### `generateRefreshToken(payload)`

```typescript
// Создаёт JWT токен с payload { userId, email }
// Подписывает JWT_REFRESH_SECRET
// Время жизни: 30 дней
// Возвращает строку токена
```

#### `verifyAccessToken(token)`

```typescript
// Проверяет подпись токена (JWT_SECRET)
// Проверяет срок действия
// Возвращает payload { userId, email }
// Бросает ошибку если токен неверный/истёк
```

#### `verifyRefreshToken(token)`

```typescript
// Аналогично, но использует JWT_REFRESH_SECRET
```

**Структура JWT токена:**

```
header.payload.signature

header: { alg: "HS256", typ: "JWT" }
payload: { userId: "...", email: "...", iat: 123, exp: 456 }
signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

---

### 6. **Bcrypt Utils** (`utils/bcrypt.ts`)

**Назначение:** Хеширование и проверка паролей

#### `hashPassword(password)`

```typescript
// Хеширует пароль с солью (10 раундов)
// Использует bcrypt алгоритм
// Возвращает хеш вида: $2a$10$...
// Время выполнения: ~100ms (защита от brute force)
```

#### `comparePassword(password, hashedPassword)`

```typescript
// Сравнивает пароль с хешем
// Безопасное сравнение (timing attack защита)
// Возвращает true/false
```

**Почему bcrypt:**

- Медленный алгоритм (защита от brute force)
- Автоматическая соль (каждый хеш уникален)
- Проверенное решение

**Пример хеша:**

```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

---

### 7. **Error Handler** (`middleware/errorHandler.ts`)

**Назначение:** Централизованная обработка ошибок

#### `AppError` класс

```typescript
class AppError extends Error {
  statusCode: number; // HTTP статус код
  isOperational: boolean; // Операционная ошибка (не баг)
}
```

#### `errorHandler` middleware

```typescript
// Если AppError → возвращает статус код из ошибки
// Если другая ошибка → возвращает 500
// В production скрывает детали внутренних ошибок
```

**Формат ответа:**

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔄 Полный Flow запросов

### Flow 1: Регистрация (`POST /api/auth/register`)

```
1. HTTP Request
   POST /api/auth/register
   Body: { email, username, password, name }

2. Express Server
   → Принимает запрос
   → Парсит JSON body

3. Routes (authRoutes.ts)
   → Находит роут /register
   → Вызывает validate(registerSchema)

4. Validation Middleware
   → Проверяет данные через Zod
   → Если ошибка → 400 Bad Request
   → Если ОК → next() к контроллеру

5. Controller (register)
   → Извлекает данные из req.body
   → Проверяет существование пользователя:
      prisma.user.findFirst({ OR: [{ email }, { username }] })
   → Если существует → 409 Conflict
   → Хеширует пароль:
      hashPassword(password) → "$2a$10$..."
   → Создаёт пользователя:
      prisma.user.create({ email, username, password: hashed, name })
   → Генерирует токены:
      generateAccessToken({ userId, email })
      generateRefreshToken({ userId, email })
   → Сохраняет refresh token в БД:
      prisma.refreshToken.create({ token, userId, expiresAt })
   → Возвращает ответ:
      { success: true, data: { user, accessToken, refreshToken } }

6. Response
   Status: 201 Created
   Body: { success: true, data: {...} }
```

**Что записывается в БД:**

- Таблица `users`: новый пользователь
- Таблица `refresh_tokens`: refresh token

---

### Flow 2: Логин (`POST /api/auth/login`)

```
1. HTTP Request
   POST /api/auth/login
   Body: { email, password }

2. Validation Middleware
   → Проверяет email и password
   → Если ошибка → 400

3. Controller (login)
   → Ищет пользователя:
      prisma.user.findUnique({ where: { email } })
   → Если не найден → 401 Unauthorized
   → Проверяет пароль:
      comparePassword(password, user.password)
   → Если неверный → 401
   → Генерирует токены (как в register)
   → Сохраняет refresh token
   → Возвращает ответ

4. Response
   Status: 200 OK
   Body: { success: true, data: { user, accessToken, refreshToken } }
```

**Важно:** Пароль НЕ возвращается в ответе (только хеш в БД)

---

### Flow 3: Обновление токена (`POST /api/auth/refresh`)

```
1. HTTP Request
   POST /api/auth/refresh
   Body: { refreshToken: "..." }

2. Validation Middleware
   → Проверяет наличие refreshToken

3. Controller (refresh)
   → Проверяет токен:
      verifyRefreshToken(token)
      → Если неверный/истёк → 401
   → Проверяет в БД:
      prisma.refreshToken.findUnique({ where: { token } })
   → Проверяет срок действия:
      if (storedToken.expiresAt < new Date()) → 401
   → Генерирует новый access token:
      generateAccessToken({ userId, email })
   → Возвращает только access token

4. Response
   Status: 200 OK
   Body: { success: true, data: { accessToken } }
```

**Зачем нужен:**

- Access token живёт 15 минут
- Refresh token живёт 30 дней
- Когда access токен истекает, используй refresh для получения нового

---

### Flow 4: Выход (`POST /api/auth/logout`)

```
1. HTTP Request
   POST /api/auth/logout
   Headers: { Authorization: "Bearer <access_token>" }
   Body: { refreshToken: "..." }

2. Auth Middleware (authenticate)
   → Извлекает токен из заголовка
   → Проверяет токен: verifyAccessToken(token)
   → Добавляет req.userId и req.userEmail
   → Если ошибка → 401

3. Controller (logout)
   → Удаляет refresh token из БД:
      prisma.refreshToken.deleteMany({ where: { token } })
   → Возвращает успех

4. Response
   Status: 200 OK
   Body: { success: true, message: "Logged out successfully" }
```

**Что происходит:**

- Refresh token удаляется из БД
- Access token остаётся валидным до истечения (15 минут)
- Пользователь не сможет обновить токен (refresh token удалён)

---

## 🔐 Безопасность

### 1. **Пароли:**

- ✅ Хешируются через bcrypt (10 раундов)
- ✅ Никогда не хранятся в открытом виде
- ✅ Не возвращаются в API ответах

### 2. **Токены:**

- ✅ Access token: короткоживущий (15 минут)
- ✅ Refresh token: долгоживущий (30 дней), хранится в БД
- ✅ Подписываются секретными ключами
- ✅ Проверяются на каждом защищённом запросе

### 3. **Валидация:**

- ✅ Все входные данные проверяются через Zod
- ✅ Email формат проверяется
- ✅ Пароль должен быть сложным
- ✅ Username имеет ограничения

### 4. **Ошибки:**

- ✅ Не раскрываем детали внутренних ошибок
- ✅ Единый формат ошибок
- ✅ Правильные HTTP статус коды

---

## 📊 Структура данных в БД

### Таблица `users`

```sql
id          UUID (primary key)
email       String (unique)
username    String (unique)
password    String (хеш bcrypt)
name        String (nullable)
bio         String (nullable)
avatar      String (nullable)
role        UserRole (USER/ADMIN/MODERATOR)
isVerified  Boolean
createdAt   DateTime
updatedAt   DateTime
```

### Таблица `refresh_tokens`

```sql
id        UUID (primary key)
token     String (unique, JWT refresh token)
userId    UUID (foreign key → users.id)
expiresAt DateTime
createdAt DateTime
```

**Связи:**

- `refresh_tokens.userId` → `users.id` (onDelete: Cascade)

---

## 🧪 Примеры запросов

### Регистрация

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
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
    "email": "user@example.com",
    "password": "Test1234"
  }'
```

### Обновление токена

```bash
curl -X POST http://localhost:5001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Выход

```bash
curl -X POST http://localhost:5001/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## 🔍 Отладка

### Проверить токен

```typescript
// В коде можно декодировать токен (без проверки подписи)
const decoded = jwt.decode(token);
console.log(decoded); // { userId, email, iat, exp }
```

### Проверить пользователей в БД

```bash
cd backend
pnpm run db:studio
# Откроется http://localhost:5555
```

### Проверить refresh токены

```sql
SELECT * FROM refresh_tokens;
SELECT * FROM refresh_tokens WHERE "expiresAt" < NOW(); -- истёкшие
```

---

## ⚠️ Важные моменты

1. **Access token не хранится в БД** - только проверяется подпись
2. **Refresh token хранится в БД** - можно инвалидировать при logout
3. **Пароли никогда не логируются** - только хеши
4. **Токены содержат только userId и email** - минимум данных
5. **Все ошибки обрабатываются централизованно** - единый формат

---

## 🚀 Что дальше

После аутентификации можно:

1. Использовать `authenticate` middleware для защищённых роутов
2. Получать `req.userId` в контроллерах
3. Реализовать USER/PROFILE endpoints
4. Реализовать POSTS endpoints (с привязкой к пользователю)
