# Git Workflow для команды из 2 разработчиков

## 🌿 Стратегия ветвления

### Основные ветки

```
main (или master)
  ├── develop (опционально, для больших проектов)
  ├── feature/название-фичи
  ├── fix/название-бага
  └── hotfix/критичный-баг
```

**Для проекта из 2 человек:**

- `main` — продакшн-готовая версия
- `develop` — опционально, если нужна стабильная dev ветка
- `feature/*` — новые фичи
- `fix/*` — исправления багов

---

## 🔄 Рекомендуемый Workflow

### Вариант 1: Простой (рекомендуется для 2 человек)

```
main
  ├── feature/auth-backend
  ├── feature/auth-frontend
  ├── feature/user-profile
  └── fix/login-error
```

**Процесс:**

1. Создаёшь feature ветку от `main`
2. Работаешь, коммитишь
3. Пушишь в remote
4. Создаёшь Pull Request (или просто мержишь в main)
5. Мержишь в `main`
6. Удаляешь feature ветку

### Вариант 2: С develop веткой

```
main (production-ready)
  └── develop (интеграционная ветка)
      ├── feature/auth-backend
      ├── feature/auth-frontend
      └── feature/user-profile
```

**Процесс:**

1. Создаёшь feature ветку от `develop`
2. Работаешь, коммитишь
3. Мержишь в `develop`
4. Тестируешь вместе
5. Когда `develop` стабилен → мержишь в `main`

**Для 2 человек:** Вариант 1 проще и быстрее.

---

## 📝 Правила работы

### 1. **Создание веток**

**Название веток:**

```bash
# Фичи
feature/user-profile-endpoints
feature/auth-frontend
feature/posts-crud

# Баги
fix/login-token-expiry
fix/register-validation

# Горячие исправления (критичные баги в main)
hotfix/security-patch
```

**Создание:**

```bash
# Обновить main
git checkout main
git pull origin main

# Создать feature ветку
git checkout -b feature/user-profile-endpoints

# Или для бага
git checkout -b fix/login-error
```

### 2. **Коммиты**

**Формат (Conventional Commits):**

```bash
feat(auth): add refresh token endpoint
fix(users): correct profile validation
refactor(api): simplify error handling
docs(readme): update setup instructions
style(components): fix formatting
test(auth): add login tests
```

**Структура:**

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Типы:**

- `feat` — новая функциональность
- `fix` — исправление бага
- `refactor` — рефакторинг кода
- `docs` — документация
- `style` — форматирование, стили
- `test` — тесты
- `chore` — рутинные задачи (зависимости, конфиги)

**Примеры хороших коммитов:**

```bash
feat(auth): add JWT refresh token endpoint
fix(users): handle duplicate username error
refactor(api): extract validation to middleware
docs(setup): add docker-compose instructions
```

**Примеры плохих коммитов:**

```bash
# Плохо
git commit -m "fix"
git commit -m "update"
git commit -m "changes"

# Хорошо
git commit -m "fix(auth): handle expired token error"
```

### 3. **Частота коммитов**

**Коммить часто:**

- После каждой логической единицы работы
- После исправления бага
- После добавления функции
- Не коммить незавершённый код (broken state)

**Пример:**

```bash
# Плохо: один большой коммит
git add .
git commit -m "add user profile feature"

# Хорошо: несколько маленьких коммитов
git commit -m "feat(users): add getMe endpoint"
git commit -m "feat(users): add updateProfile endpoint"
git commit -m "feat(users): add follow/unfollow endpoints"
```

### 4. **Push в remote**

**Правило:**

- Пуши в feature ветку регулярно (не реже раза в день)
- Это позволяет коллеге видеть твой прогресс
- Избегай конфликтов (чаще синхронизируйся)

```bash
# После каждого коммита (или нескольких)
git push origin feature/user-profile-endpoints

# Если ветка новая, установи upstream
git push -u origin feature/user-profile-endpoints
```

---

## 👥 Работа в паре

### Сценарий 1: Работаете над разными фичами

**Разработчик 1:**

```bash
git checkout main
git pull origin main
git checkout -b feature/auth-backend
# Работает над backend аутентификацией
git push origin feature/auth-backend
```

**Разработчик 2:**

```bash
git checkout main
git pull origin main
git checkout -b feature/auth-frontend
# Работает над frontend аутентификацией
git push origin feature/auth-frontend
```

**Результат:** Нет конфликтов, работаете параллельно.

### Сценарий 2: Работаете над одной фичей

**Вариант A: Разделить по файлам**

- Один делает backend, другой frontend
- Меньше конфликтов

**Вариант B: По очереди**

- Один коммитит, другой пуллит
- Или используйте feature ветку и мержите по готовности частей

### Сценарий 3: Конфликт при мерже

**Что делать:**

```bash
# 1. Обновить свою ветку
git checkout feature/my-feature
git pull origin main  # или git merge main

# 2. Если конфликт
# Git покажет конфликтующие файлы
# Отредактируй вручную, оставь нужный код

# 3. Разрешить конфликт
git add .
git commit -m "merge: resolve conflicts with main"

# 4. Запушить
git push origin feature/my-feature
```

**Как избежать конфликтов:**

- Чаще синхронизируйся с main: `git pull origin main`
- Пуши изменения регулярно
- Общайся с коллегой о том, какие файлы меняешь

---

## 🔀 Процесс мержа в main

### Вариант 1: Прямой мерж (для 2 человек)

```bash
# 1. Убедись, что feature ветка актуальна
git checkout feature/user-profile
git pull origin main  # синхронизация с main
git push origin feature/user-profile

# 2. Переключись на main
git checkout main
git pull origin main

# 3. Мерж feature ветки
git merge feature/user-profile

# 4. Запуши
git push origin main

# 5. Удали feature ветку
git branch -d feature/user-profile
git push origin --delete feature/user-profile
```

### Вариант 2: Pull Request (рекомендуется)

**Через GitHub:**

1. Запуши feature ветку
2. Создай Pull Request на GitHub
3. Коллега ревьюит (опционально)
4. Мержишь через GitHub UI
5. Удаляешь feature ветку

**Преимущества:**

- История изменений
- Возможность обсуждения
- Автоматические проверки (если настроены)

---

## 📋 Чеклист перед мержем

Перед мержем feature ветки в main:

- [ ] Код работает локально
- [ ] Нет ошибок линтера: `pnpm run lint`
- [ ] TypeScript компилируется: `pnpm exec tsc --noEmit`
- [ ] Протестировал функциональность
- [ ] Синхронизировал с main: `git pull origin main`
- [ ] Нет конфликтов
- [ ] Коммиты понятные и логичные

---

## 🚨 Частые проблемы и решения

### Проблема 1: Конфликт при pull

```bash
# Ситуация: коллега запушил в main, ты пытаешься пуллить
git pull origin main
# Конфликт!

# Решение:
# 1. Git покажет конфликтующие файлы
# 2. Открой файлы, найди маркеры конфликта:
<<<<<<< HEAD
твой код
=======
код из main
>>>>>>> main

# 3. Выбери нужный код или объедини
# 4. Удали маркеры конфликта
# 5. Сохрани файлы
git add .
git commit -m "merge: resolve conflicts"
```

### Проблема 2: Запушил не в ту ветку

```bash
# Ситуация: случайно запушил в main вместо feature ветки
git push origin main  # ой!

# Решение:
# 1. Откати последний коммит (но оставь изменения)
git reset --soft HEAD~1

# 2. Переключись на правильную ветку
git checkout feature/my-feature

# 3. Закоммить там
git commit -m "feat: my feature"

# 4. Если нужно откатить в remote main (осторожно!)
git push origin main --force  # только если уверен!
```

### Проблема 3: Забыл синхронизироваться

```bash
# Ситуация: работал долго, не пуллил main
# Теперь много конфликтов

# Решение:
# 1. Закоммить текущие изменения
git add .
git commit -m "WIP: work in progress"

# 2. Синхронизироваться с main
git pull origin main

# 3. Разрешить конфликты по одному
# 4. Продолжить работу
```

---

## 🎯 Рекомендуемый workflow для вашего проекта

### Ежедневный процесс

**Утро:**

```bash
# 1. Обновить main
git checkout main
git pull origin main

# 2. Создать/переключиться на feature ветку
git checkout feature/my-feature
# или
git checkout -b feature/new-feature

# 3. Синхронизировать с main (если ветка уже существует)
git pull origin main
```

**В течение дня:**

```bash
# Коммить часто
git add .
git commit -m "feat: add user endpoint"

# Пушить регулярно
git push origin feature/my-feature
```

**Вечер:**

```bash
# Финальный коммит и пуш
git add .
git commit -m "feat: complete user profile feature"
git push origin feature/my-feature
```

### Когда фича готова

```bash
# 1. Финальная синхронизация
git checkout feature/my-feature
git pull origin main
# Разрешить конфликты если есть

# 2. Создать Pull Request на GitHub
# Или мержить напрямую:

git checkout main
git pull origin main
git merge feature/my-feature
git push origin main

# 3. Удалить feature ветку
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

---

## 📂 Работа с монорепо

**Ваш проект:**

```
fullstack-learning-project/
├── backend/
└── frontend/
```

**Рекомендации:**

- Коммить изменения в backend и frontend отдельными коммитами
- Или коммить вместе, если изменения связаны

**Пример:**

```bash
# Вариант 1: Отдельные коммиты
git add backend/
git commit -m "feat(backend): add user endpoints"

git add frontend/
git commit -m "feat(frontend): add user profile page"

# Вариант 2: Один коммит для связанных изменений
git add .
git commit -m "feat: add user profile feature (backend + frontend)"
```

---

## 🔐 Защита main ветки (опционально)

**На GitHub можно настроить:**

- Require pull request reviews (для 2 человек не обязательно)
- Require status checks to pass (если есть CI/CD)
- Require branches to be up to date

**Для 2 человек:** Можно работать напрямую с main, но Pull Request полезен для истории.

---

## 💡 Best Practices

1. **Коммить часто, пушить регулярно**
   - Не теряешь работу
   - Коллега видит прогресс
   - Меньше конфликтов

2. **Понятные сообщения коммитов**
   - Легче найти изменения
   - Легче понять историю

3. **Синхронизироваться с main часто**
   - Меньше конфликтов
   - Актуальный код

4. **Общаться с коллегой**
   - Кто над чем работает
   - Какие файлы меняешь
   - Когда планируешь мержить

5. **Тестировать перед мержем**
   - Код должен работать
   - Нет ошибок линтера

---

## 📝 Примеры для вашего проекта

### Создание фичи "User Profile"

```bash
# 1. Обновить main
git checkout main
git pull origin main

# 2. Создать feature ветку
git checkout -b feature/user-profile-endpoints

# 3. Работать, коммитить
# ... создал userController.ts
git add backend/src/controllers/userController.ts
git commit -m "feat(users): add getMe endpoint"

# ... создал userRoutes.ts
git add backend/src/routes/userRoutes.ts
git commit -m "feat(users): add user routes"

# ... обновил server.ts
git add backend/src/server.ts
git commit -m "feat(users): register user routes in server"

# 4. Пушить регулярно
git push origin feature/user-profile-endpoints

# 5. Когда готово - мержить
git checkout main
git pull origin main
git merge feature/user-profile-endpoints
git push origin main

# 6. Удалить feature ветку
git branch -d feature/user-profile-endpoints
git push origin --delete feature/user-profile-endpoints
```

---

## 🎓 Итоговая рекомендация

**Для проекта из 2 человек:**

1. **Используй простой workflow:**
   - `main` — стабильная версия
   - `feature/*` — новые фичи
   - Прямой мерж или Pull Request

2. **Коммить часто, пушить регулярно**

3. **Синхронизироваться с main минимум раз в день**

4. **Общаться с коллегой о том, что делаешь**

5. **Тестировать перед мержем**

Этот подход простой и эффективный для команды из 2 человек.
