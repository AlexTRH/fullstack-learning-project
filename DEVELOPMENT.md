# Руководство по локальной разработке

## 🔄 Синхронизация изменений

### Backend (Express + TypeScript)

**Автоматическая перезагрузка:**

- Используется `tsx watch` в `pnpm run dev`
- При изменении любого `.ts` файла сервер автоматически перезапускается
- Изменения применяются без ручного перезапуска

**Что перезагружается автоматически:**

- ✅ Изменения в контроллерах (`controllers/`)
- ✅ Изменения в роутах (`routes/`)
- ✅ Изменения в middleware (`middleware/`)
- ✅ Изменения в утилитах (`utils/`)
- ✅ Изменения в валидаторах (`validators/`)

**Что НЕ перезагружается автоматически:**

- ❌ Изменения в `.env` файле (нужен ручной перезапуск)
- ❌ Изменения в `package.json` (нужна переустановка зависимостей)

### Frontend (Next.js)

**Автоматическая перезагрузка (HMR - Hot Module Replacement):**

- Next.js автоматически обновляет страницу при изменении файлов
- Изменения применяются мгновенно без полной перезагрузки страницы
- Состояние компонентов сохраняется где возможно

**Что обновляется автоматически:**

- ✅ React компоненты (`components/`, `app/`)
- ✅ Стили (CSS, Tailwind)
- ✅ Хуки и утилиты (`hooks/`, `lib/`)
- ✅ Zustand stores (`stores/`)

**Что требует перезагрузки страницы:**

- Изменения в `next.config.ts`
- Изменения в `tailwind.config.ts`
- Изменения в `.env` файлах

### База данных (Prisma)

**Важно:** Изменения в `schema.prisma` НЕ применяются автоматически!

#### Процесс обновления БД

**1. Изменил `prisma/schema.prisma`:**

```bash
cd backend

# Вариант 1: Быстрое обновление (для разработки)
pnpm exec prisma db push
# Применяет изменения сразу, без создания миграции

# Вариант 2: Создать миграцию (рекомендуется)
pnpm exec prisma migrate dev --name название_миграции
# Создаёт миграцию и применяет её
```

**2. После изменения схемы нужно обновить Prisma Client:**

```bash
cd backend
pnpm exec prisma generate
# Генерирует новый Prisma Client с обновлёнными типами
```

**3. TypeScript автоматически подхватит новые типы:**

- После `prisma generate` TypeScript увидит новые типы
- IDE может потребовать перезапуска TypeScript сервера
- `tsx watch` автоматически перезапустит сервер

#### Рекомендуемый workflow

```bash
# 1. Изменил schema.prisma
# 2. Примени изменения к БД
pnpm exec prisma migrate dev --name add_new_field

# 3. Prisma автоматически вызовет generate после migrate
# Если использовал db push, запусти вручную:
pnpm exec prisma generate

# 4. Backend автоматически перезапустится (tsx watch)
# 5. Frontend продолжит работать, но нужно обновить типы если используешь shared types
```

## 📋 Чеклист при изменении схемы БД

- [ ] Изменил `prisma/schema.prisma`
- [ ] Запустил `pnpm exec prisma migrate dev` или `prisma db push`
- [ ] Prisma Client обновлён (`prisma generate` выполнен автоматически)
- [ ] Backend перезапустился (автоматически через `tsx watch`)
- [ ] Проверил, что новые поля доступны в коде
- [ ] Обновил типы во frontend (если используешь shared types)

## 🔗 Синхронизация между Backend и Frontend

### API изменения

**Backend:**

- Изменил endpoint → Backend перезапускается автоматически
- Frontend продолжит работать, но может получить ошибку если endpoint изменился

**Frontend:**

- Изменил API вызов → Frontend обновится автоматически (HMR)
- Если endpoint ещё не существует, увидишь ошибку в консоли браузера

### Типы TypeScript

**Если используешь shared types:**

```
shared/
└── types/
    └── api.ts  # Общие типы для backend и frontend
```

**Синхронизация:**

- Изменил тип в `shared/types/` → Оба проекта увидят изменения
- TypeScript автоматически проверит типы
- Может потребоваться перезапуск TypeScript сервера в IDE

**Если НЕ используешь shared types:**

- Backend и Frontend имеют независимые типы
- Нужно вручную синхронизировать типы при изменении API

## 🚀 Типичный workflow разработки

### Сценарий 1: Добавил новое поле в User модель

```bash
# 1. Изменил schema.prisma
# Добавил поле: phone String?

# 2. Применил изменения
cd backend
pnpm exec prisma migrate dev --name add_user_phone

# 3. Backend автоматически перезапустился
# 4. Обновил контроллер, чтобы использовать phone
# 5. Backend автоматически перезапустился снова
# 6. Frontend продолжает работать
# 7. Обновил frontend форму для добавления phone
# 8. Frontend автоматически обновился (HMR)
```

### Сценарий 2: Добавил новый API endpoint

```bash
# 1. Создал новый роут в routes/
# 2. Создал контроллер в controllers/
# 3. Backend автоматически перезапустился
# 4. Протестировал endpoint через curl/Postman
# 5. Создал frontend hook для вызова API
# 6. Frontend автоматически обновился
# 7. Использовал hook в компоненте
# 8. Frontend автоматически обновился
```

## ⚠️ Частые проблемы

### Проблема: Изменил schema.prisma, но изменения не применяются

**Решение:**

```bash
cd backend
pnpm exec prisma db push  # или migrate dev
pnpm exec prisma generate
```

### Проблема: TypeScript не видит новые типы Prisma

**Решение:**

1. Убедись, что запустил `prisma generate`
2. Перезапусти TypeScript сервер в IDE: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
3. Перезапусти backend: останови и запусти `pnpm run dev` снова

### Проблема: Frontend не видит изменения в API

**Решение:**

- Проверь, что backend запущен и перезапустился
- Проверь консоль браузера на ошибки
- Проверь Network tab в DevTools
- Очисти кэш TanStack Query если нужно

### Проблема: Изменения в .env не применяются

**Решение:**

- Backend: Перезапусти сервер вручную
- Frontend: Перезапусти dev сервер (переменные с `NEXT_PUBLIC_` требуют перезапуска)

## 🛠 Полезные команды

### Backend

```bash
# Запуск с автоперезагрузкой
pnpm run dev

# Применить изменения схемы
pnpm exec prisma db push          # Быстро (dev)
pnpm exec prisma migrate dev       # С миграцией (рекомендуется)

# Обновить Prisma Client
pnpm exec prisma generate

# Открыть Prisma Studio (визуальный редактор БД)
pnpm run db:studio
```

### Frontend

```bash
# Запуск с HMR
pnpm run dev

# Сборка для проверки
pnpm run build
```

## 📝 Рекомендации

1. **Всегда используй миграции в продакшене:**

   - `prisma migrate dev` для разработки
   - `prisma db push` только для быстрого прототипирования

2. **Следи за консолью:**

   - Backend: смотри логи сервера
   - Frontend: смотри консоль браузера и терминал Next.js

3. **Используй Prisma Studio для проверки данных:**

   ```bash
   cd backend
   pnpm run db:studio
   # Откроется на http://localhost:5555
   ```

4. **Тестируй изменения сразу:**

   - После изменения API → протестируй через curl/Postman
   - После изменения frontend → проверь в браузере

5. **Коммить миграции:**
   - Миграции в `prisma/migrations/` нужно коммитить в git
   - Это позволяет синхронизировать БД между разработчиками
