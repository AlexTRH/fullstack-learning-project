# Контекст чата: посты, дизайн, настройки (февраль 2026)

Документ для продолжения работы в другом чате.

---

## Текущее состояние репозитория

- **Активная ветка:** `feature/error-toasts` (создана от `development`). После мержа — переключиться на `development`.
- Ветка `feature/posts-frontend` ранее смержена в `development`.
- План работ: `docs/ROADMAP.md` (текущий фокус — ближайшие улучшения; тосты отмечены как сделанные).

---

## Что сделано

### Посты (фронт)
- **Лента:** `/posts` — список постов, пагинация, форма создания (для авторизованных), удаление.
- **Пост:** `/posts/[id]` — просмотр, кнопки Edit/Delete для автора.
- **Редактирование:** `/posts/[id]/edit` — только автор.
- API и типы: `frontend/features/posts/api.ts`; компоненты в `frontend/features/posts/components/`.
- В сайдбаре пункт **Feed** → `/posts`.

### Профиль и дашборд
- **Dashboard** = полный «мой профиль»: карточка профиля, кликабельные Followers/Following (раскрываются списки), блок «My posts» с превью постов и ссылкой на ленту.
- Заход на `/users/[мой-id]` редиректит на `/dashboard`.
- Ссылка «Public profile» убрана из ProfileCard.

### Исправления
- **Счётчики followers/following:** в Prisma имена связей перепутаны; в репозиториях (User, Follow, Post) добавлен маппинг: API возвращает `followers` = кто подписан на меня, `following` = на кого подписан я.
- **Список «Following»:** при открытии на своей странице у всех пунктов корректно показывается «Unfollow» (проп `initialIsFollowing` в `UserListItem`).

### Тема и настройки
- **Тема:** светлая / тёмная / системная. Сохранение в `localStorage` (ключ `app-theme`), без мигания при загрузке (инлайн-скрипт в `layout`).
- **Настройки:** `Dashboard → Profile settings` (`/dashboard/settings`) — блок «Appearance» (ThemeSwitcher) + форма редактирования профиля.
- Store: `frontend/stores/useThemeStore.ts`; провайдер: `frontend/components/theme-provider.tsx`.

### Дизайн (Facebook-style)
- Единый источник правды: `frontend/app/globals.css` — палитра (#1877F2, #F0F2F5, #050505, #65676B), без видимых границ (--border прозрачный).
- Карточки без рамки, тень `shadow-card`; шапка с `bg-header` (белая в светлой теме).
- Конфиг: `frontend/tailwind.config.ts` (header, shadow-card).

### Обработка ошибок API (тосты)
- **Sonner:** зависимость `sonner`, компонент `<Toaster richColors position="bottom-right" />` в `frontend/app/providers.tsx`.
- **Глобальный interceptor:** в `frontend/lib/api.ts` при любой ошибке ответа (кроме 401 с refresh) показывается `toast.error(message)`. Сообщение: `response.data.message` или `error.message`, иначе «Something went wrong».
- Ошибки создания/редактирования/удаления поста и загрузки ленты показываются тостом без доп. кода в компонентах.

---

## Бэкенд (посты) — кратко

- **Роуты:** `GET/POST /api/posts`, `GET/PATCH/DELETE /api/posts/:id`. Валидация в `backend/src/posts/schemas/post.schemas.ts`.
- **Авторизация:** JWT; тестовый пользователь — см. `CREDENTIALS.md`.
- Скрипт проверки API: `backend/scripts/test-posts-api.mjs` (задать `API_URL`, `TEST_EMAIL`, `TEST_PASSWORD`).

---

## Полезные пути

| Назначение | Путь |
|------------|------|
| API постов (бэкенд) | `backend/src/posts/` |
| Домен поста | `backend/src/domain/entities/Post.ts` |
| Маппинг счётчиков followers/following | `backend/src/infrastructure/database/PrismaUserRepository.ts` (mapUserWithCounts), `PrismaFollowRepository.ts`, `PrismaPostRepository.ts` |
| Посты на фронте | `frontend/features/posts/` (api, components, utils) |
| Страницы постов | `frontend/app/posts/`, `frontend/app/posts/[id]/`, `frontend/app/posts/[id]/edit/` |
| Тема | `frontend/stores/useThemeStore.ts`, `frontend/components/theme-provider.tsx` |
| Настройки (внешний вид) | `frontend/features/settings/components/ThemeSwitcher.tsx` |
| Дизайн-токены | `frontend/app/globals.css` |
| Тосты (API-ошибки) | `frontend/lib/api.ts` (interceptor), `frontend/app/providers.tsx` (Toaster) |
| План работ | `docs/ROADMAP.md` |
| Тестовые учётные данные | `CREDENTIALS.md` |

---

*Документ обновлён для передачи контекста между чатами.*
