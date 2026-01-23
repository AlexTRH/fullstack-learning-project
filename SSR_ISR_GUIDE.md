# SSR vs ISR для социальной сети

## 🔄 Стратегии рендеринга в Next.js

### SSR (Server-Side Rendering)

- Рендерится на сервере **при каждом запросе**
- Данные всегда актуальные
- Медленнее (ждёт данные на каждый запрос)
- Используется для: динамического контента, персональных данных

### ISR (Incremental Static Regeneration)

- Генерируется статически, **обновляется периодически**
- Данные могут быть немного устаревшими
- Быстрее (кешируется)
- Используется для: контента, который обновляется не очень часто

### CSR (Client-Side Rendering)

- Рендерится в браузере
- Используется для: реального времени, интерактивности

---

## 📱 Применение для страниц соцсети

### 1. **Landing / Home** (маркетинговая)

**Рекомендация: ISR или Static**

```typescript
// app/page.tsx
export const revalidate = 3600; // 1 час

export default async function HomePage() {
  // Статистика, общая информация
  // Обновляется редко
}
```

**Почему:** Маркетинговая страница не требует частых обновлений.

---

### 2. **Feed / Лента** (главная, персонализированная)

**Рекомендация: SSR или Client-Side**

```typescript
// app/feed/page.tsx
// НЕ используем ISR - данные персональные и меняются часто

export default async function FeedPage() {
  // SSR: получаем данные на сервере
  const posts = await fetch(`${API_URL}/api/posts`, {
    cache: 'no-store', // Не кэшируем
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return <Feed posts={posts} />;
}
```

**Почему:**

- Персональная лента (разная для каждого пользователя)
- Данные меняются часто (новые посты)
- Нужны актуальные данные

**Альтернатива (лучше):**

```typescript
// app/feed/page.tsx
'use client';

export default function FeedPage() {
  // Client-side с TanStack Query
  const { data: posts } = useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => api.get('/api/posts').then(res => res.data.data),
    staleTime: 30000, // 30 секунд
  });
  
  return <Feed posts={posts} />;
}
```

**Почему Client-Side лучше:**

- Можно обновлять без перезагрузки страницы
- Оптимистичные обновления
- Real-time через WebSocket (позже)

---

### 3. **Profile пользователя** (публичный)

**Рекомендация: ISR с коротким revalidate**

```typescript
// app/users/[username]/page.tsx
export const revalidate = 60; // 1 минута

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await fetch(`${API_URL}/api/users/username/${params.username}`, {
    next: { revalidate: 60 }
  });
  
  return <Profile user={user} />;
}
```

**Почему:**

- Профиль меняется не очень часто
- Можно кэшировать для производительности
- 1 минута - хороший баланс между актуальностью и скоростью

**Исключение:** Если это свой профиль → SSR или Client-Side (нужны актуальные данные)

---

### 4. **Post Detail** (просмотр поста)

**Рекомендация: ISR с коротким revalidate**

```typescript
// app/posts/[id]/page.tsx
export const revalidate = 30; // 30 секунд

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(`${API_URL}/api/posts/${params.id}`, {
    next: { revalidate: 30 }
  });
  
  return <PostDetail post={post} />;
}
```

**Почему:**

- Пост меняется не очень часто (лайки, комментарии можно обновлять через Client-Side)
- Можно кэшировать для SEO и производительности
- 30 секунд - достаточно для актуальности

---

### 5. **Search / Explore** (поиск)

**Рекомендация: SSR или Client-Side**

```typescript
// app/search/page.tsx
export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  // SSR: поиск всегда актуальный
  const results = await fetch(`${API_URL}/api/search?q=${searchParams.q}`, {
    cache: 'no-store'
  });
  
  return <SearchResults results={results} />;
}
```

**Почему:**

- Поиск должен быть актуальным
- Запросы разные для каждого пользователя
- Нельзя кэшировать

---

### 6. **Create / Composer** (создание поста)

**Рекомендация: Client-Side только**

```typescript
// app/create/page.tsx
'use client';

export default function CreatePage() {
  // Только Client-Side
  // Форма, загрузка файлов, предпросмотр
  return <PostComposer />;
}
```

**Почему:**

- Интерактивная форма
- Нужны события (onChange, onSubmit)
- Не нужен SSR

---

### 7. **Messages / Direct** (чат)

**Рекомендация: Client-Side + WebSocket**

```typescript
// app/messages/page.tsx
'use client';

export default function MessagesPage() {
  // Client-Side с WebSocket для real-time
  return <ChatInterface />;
}
```

**Почему:**

- Real-time обновления
- Интерактивность
- WebSocket соединение

---

### 8. **Notifications** (уведомления)

**Рекомендация: Client-Side с polling или WebSocket**

```typescript
// app/notifications/page.tsx
'use client';

export default function NotificationsPage() {
  // Client-Side с автоматическим обновлением
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/api/notifications'),
    refetchInterval: 10000, // Обновлять каждые 10 секунд
  });
  
  return <NotificationsList notifications={data} />;
}
```

**Почему:**

- Нужны актуальные данные
- Real-time обновления
- Персональные данные

---

## 📊 Сравнительная таблица

| Страница | Стратегия | Revalidate | Почему |
|----------|-----------|------------|--------|
| Landing | ISR | 3600s (1ч) | Статический контент |
| Feed | Client-Side | - | Персональный, часто меняется |
| Profile (публичный) | ISR | 60s | Меняется редко |
| Profile (свой) | Client-Side | - | Нужны актуальные данные |
| Post Detail | ISR | 30s | Меняется редко |
| Search | SSR | - | Всегда актуальный |
| Create | Client-Side | - | Интерактивная форма |
| Messages | Client-Side | - | Real-time |
| Notifications | Client-Side | - | Real-time |

---

## 🎯 Рекомендуемый подход для проекта

### Гибридная стратегия

**1. Статические страницы (ISR):**

- Landing
- Публичные профили
- Детали постов

**2. Динамические страницы (SSR или Client-Side):**

- Feed (Client-Side лучше)
- Search (SSR)
- Свой профиль (Client-Side)

**3. Интерактивные страницы (Client-Side):**

- Create/Composer
- Messages
- Notifications
- Edit Profile

---

## 💡 Best Practices

### Когда использовать ISR

- ✅ Контент обновляется не очень часто
- ✅ Нужна производительность и SEO
- ✅ Данные одинаковые для многих пользователей
- ✅ Можно допустить небольшую задержку в обновлении

### Когда использовать SSR

- ✅ Нужны актуальные данные
- ✅ Персональный контент
- ✅ SEO важно, но данные меняются часто

### Когда использовать Client-Side

- ✅ Real-time обновления
- ✅ Интерактивность
- ✅ Персональный контент с частыми обновлениями
- ✅ Оптимистичные обновления

---

## 🔄 Примеры реализации

### ISR с revalidate

```typescript
// app/posts/[id]/page.tsx
export const revalidate = 60; // 60 секунд

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(`${API_URL}/api/posts/${params.id}`, {
    next: { revalidate: 60 }
  });
  
  return <Post post={post} />;
}
```

### SSR (без кэширования)

```typescript
// app/search/page.tsx
export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const results = await fetch(`${API_URL}/api/search?q=${searchParams.q}`, {
    cache: 'no-store' // Не кэшировать
  });
  
  return <SearchResults results={results} />;
}
```

### Client-Side с TanStack Query

```typescript
// app/feed/page.tsx
'use client';

export default function FeedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => api.get('/api/posts').then(res => res.data.data),
    staleTime: 30000, // 30 секунд
  });
  
  if (isLoading) return <Loading />;
  return <Feed posts={data} />;
}
```

---

## 🚀 Рекомендации для нашего проекта

**Начни с Client-Side для большинства страниц:**

- Проще реализовать
- Легче добавить real-time позже
- Хорошая производительность с TanStack Query

**Используй ISR для:**

- Публичных профилей (SEO)
- Деталей постов (SEO)
- Landing страницы

**Используй SSR для:**

- Search (SEO + актуальность)

**Используй Client-Side для:**

- Feed (персонализация)
- Messages (real-time)
- Notifications (real-time)
- Create/Edit (интерактивность)
