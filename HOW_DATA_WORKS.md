# Как работают данные в проекте

## 🔄 Процесс создания пользователя

### 1. Запрос приходит на backend

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234"
  }'
```

### 2. Backend обрабатывает запрос

**Путь данных:**
```
HTTP Request
  ↓
Express Router (routes/authRoutes.ts)
  ↓
Validation Middleware (validators/auth.ts) - проверяет данные
  ↓
Controller (controllers/authController.ts) - бизнес-логика
  ↓
Prisma Client (lib/prisma.ts) - запрос к БД
  ↓
PostgreSQL (в Docker)
```

### 3. Что происходит в контроллере

```typescript
// backend/src/controllers/authController.ts

export const register = async (req, res, next) => {
  // 1. Проверка существования пользователя
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });

  // 2. Хеширование пароля
  const hashedPassword = await hashPassword(password);

  // 3. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ В БД
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name: name || username,
    }
  });

  // 4. Генерация токенов
  // 5. Сохранение refresh token в БД
  // 6. Отправка ответа
};
```

**Важно:** `prisma.user.create()` **сразу записывает данные в PostgreSQL**!

## 📊 Как посмотреть данные в БД

### Способ 1: Prisma Studio (рекомендуется)

**Визуальный редактор БД:**

```bash
cd backend
pnpm run db:studio
```

Откроется браузер на `http://localhost:5555`

**Что можно делать:**
- ✅ Просматривать все таблицы
- ✅ Видеть данные в удобном формате
- ✅ Редактировать данные (для разработки)
- ✅ Добавлять/удалять записи
- ✅ Фильтровать и сортировать

**Интерфейс:**
- Слева: список таблиц (users, posts, comments и т.д.)
- Справа: данные выбранной таблицы
- Можно кликнуть на запись для редактирования

### Способ 2: Прямой SQL запрос

**Через psql (если установлен):**

```bash
# Подключиться к БД
docker exec -it fullstack_postgres psql -U user -d fullstack_db

# В psql:
SELECT * FROM users;
SELECT id, email, username, "createdAt" FROM users;
\q  # выход
```

**Или через Docker:**

```bash
docker exec -it fullstack_postgres psql -U user -d fullstack_db -c "SELECT * FROM users;"
```

### Способ 3: Prisma CLI

```bash
cd backend

# Выполнить SQL запрос
pnpm exec prisma db execute --stdin <<< "SELECT * FROM users;"

# Или через файл
echo "SELECT * FROM users;" > query.sql
pnpm exec prisma db execute --file query.sql
```

### Способ 4: Через код (для отладки)

Добавь временный endpoint для просмотра данных:

```typescript
// В routes/authRoutes.ts (только для разработки!)
router.get('/debug/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      createdAt: true,
    }
  });
  res.json({ users });
});
```

Затем:
```bash
curl http://localhost:5001/api/auth/debug/users
```

## ✅ Проверка после создания пользователя

### Шаг 1: Создай пользователя

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

**Ожидаемый ответ:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "username": "testuser",
      ...
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Шаг 2: Открой Prisma Studio

```bash
cd backend
pnpm run db:studio
```

### Шаг 3: Проверь данные

1. Откроется браузер на `http://localhost:5555`
2. Слева выбери таблицу **users**
3. Увидишь созданного пользователя:
   - `id` (UUID)
   - `email`: "test@example.com"
   - `username`: "testuser"
   - `password`: хешированный пароль (не видно в Studio)
   - `createdAt`: время создания

## 🔍 Что происходит с данными

### При создании пользователя:

1. **Валидация** → проверка email, username, password
2. **Проверка уникальности** → запрос к БД: `SELECT * FROM users WHERE email = ... OR username = ...`
3. **Хеширование пароля** → bcrypt создаёт хеш
4. **Запись в БД** → `INSERT INTO users (...) VALUES (...)`
5. **Генерация токенов** → JWT токены
6. **Сохранение refresh token** → `INSERT INTO refresh_tokens (...)`

**Все эти операции происходят в одной транзакции!**

### Где хранятся данные:

```
PostgreSQL (Docker контейнер)
  └── fullstack_db (база данных)
      ├── users (таблица пользователей)
      ├── posts (таблица постов)
      ├── comments (таблица комментариев)
      ├── refresh_tokens (таблица токенов)
      └── ... (другие таблицы)
```

**Данные сохраняются в volume:**
- `postgres_data` volume в Docker
- Данные не теряются при перезапуске контейнера
- Данные теряются только при `docker-compose down -v`

## 🧪 Тестирование

### Создай несколько пользователей:

```bash
# Пользователь 1
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@test.com", "username": "user1", "password": "Test1234"}'

# Пользователь 2
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user2@test.com", "username": "user2", "password": "Test1234"}'
```

### Проверь в Prisma Studio:

1. Открой `http://localhost:5555`
2. Выбери таблицу `users`
3. Увидишь обоих пользователей

### Проверь через SQL:

```bash
docker exec -it fullstack_postgres psql -U user -d fullstack_db \
  -c "SELECT id, email, username, \"createdAt\" FROM users ORDER BY \"createdAt\" DESC;"
```

## 📝 Полезные SQL запросы

```sql
-- Все пользователи
SELECT * FROM users;

-- Количество пользователей
SELECT COUNT(*) FROM users;

-- Последние 5 пользователей
SELECT * FROM users ORDER BY "createdAt" DESC LIMIT 5;

-- Пользователь по email
SELECT * FROM users WHERE email = 'test@example.com';

-- Все refresh токены
SELECT * FROM refresh_tokens;

-- Удалить пользователя (осторожно!)
DELETE FROM users WHERE email = 'test@example.com';
```

## ⚠️ Важно

1. **Данные сохраняются сразу:**
   - `prisma.user.create()` делает `INSERT` в БД
   - Данные доступны сразу после успешного ответа

2. **Пароли хешируются:**
   - В БД хранится хеш, не оригинальный пароль
   - В Prisma Studio пароль будет выглядеть как `$2a$10$...`

3. **Транзакции:**
   - Если что-то пошло не так, изменения откатываются
   - Например, если создание refresh token не удалось, пользователь тоже не создастся

4. **Данные персистентны:**
   - Остаются после перезапуска Docker контейнера
   - Удаляются только при `docker-compose down -v`

## 🚀 Быстрая проверка

```bash
# 1. Создай пользователя
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "check@test.com", "username": "checkuser", "password": "Test1234"}'

# 2. Открой Prisma Studio
cd backend && pnpm run db:studio

# 3. Проверь таблицу users - должен быть новый пользователь!
```
