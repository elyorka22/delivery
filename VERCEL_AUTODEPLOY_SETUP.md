# Настройка автодеплоя на Vercel

## Пошаговая инструкция

### Шаг 1: Войти в Vercel

1. Откройте https://vercel.com
2. Войдите в свой аккаунт (через GitHub, если возможно)

---

### Шаг 2: Добавить новый проект (если проект еще не добавлен)

1. На главной странице Vercel нажмите **"Add New..."** → **"Project"**
2. Или перейдите в **"Dashboard"** → **"Add New Project"**

---

### Шаг 3: Подключить GitHub репозиторий

1. В списке репозиториев найдите **`elyorka22/delivery`**
2. Если репозитория нет в списке:
   - Нажмите **"Adjust GitHub App Permissions"**
   - Или **"Configure GitHub App"**
   - Выберите репозиторий `delivery`
   - Нажмите **"Save"** или **"Install"**

3. Нажмите **"Import"** рядом с репозиторием `elyorka22/delivery`

---

### Шаг 4: Настроить проект

После импорта репозитория откроется страница настроек:

#### 4.1. Настройки проекта

- **Project Name:** `delivery` (или любое другое имя)
- **Framework Preset:** `Vite` (или определится автоматически)

#### 4.2. Root Directory (ВАЖНО!)

1. Нажмите **"Edit"** рядом с "Root Directory"
2. Выберите **`frontend`** (не оставляйте пустым!)
3. Это критически важно, так как ваш проект в папке `frontend`

#### 4.3. Build and Output Settings

Обычно Vercel определяет автоматически, но проверьте:

- **Build Command:** `npm run build` (или оставьте пустым для автоопределения)
- **Output Directory:** `dist` (или оставьте пустым для автоопределения)
- **Install Command:** `npm install` (или оставьте пустым)

#### 4.4. Environment Variables

Добавьте переменные окружения (если еще не добавлены):

1. Нажмите **"Environment Variables"**
2. Добавьте:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://delivery-production-1860.up.railway.app/api`
   - **Environment:** Production, Preview, Development (отметьте все три)
3. Нажмите **"Save"**

---

### Шаг 5: Деплой

1. Нажмите **"Deploy"**
2. Дождитесь завершения деплоя (обычно 1-3 минуты)
3. После завершения вы получите URL (например: `delivery-xxx.vercel.app`)

---

### Шаг 6: Проверка автодеплоя

После первого деплоя автодеплой уже настроен! Проверьте:

1. Сделайте небольшое изменение в коде (например, добавьте комментарий)
2. Закоммитьте и отправьте в GitHub:
   ```bash
   git add .
   git commit -m "Test autodeploy"
   git push
   ```
3. Зайдите в Vercel Dashboard → ваш проект → **"Deployments"**
4. Должен автоматически появиться новый деплой через 1-2 минуты

---

## Настройка для существующего проекта

Если проект уже добавлен в Vercel:

### Вариант 1: Через Settings

1. Откройте ваш проект в Vercel
2. Перейдите в **"Settings"** → **"Git"**
3. Убедитесь, что репозиторий подключен
4. Проверьте настройки:
   - **Production Branch:** `main` (или `master`)
   - **Root Directory:** `frontend` (ВАЖНО!)

### Вариант 2: Переподключить репозиторий

1. **Settings** → **"Git"**
2. Нажмите **"Disconnect"** (если нужно)
3. Нажмите **"Connect Git Repository"**
4. Выберите `elyorka22/delivery`
5. Убедитесь, что **Root Directory** = `frontend`

---

## Настройка Production Branch

1. **Settings** → **"Git"**
2. В разделе **"Production Branch"** выберите `main`
3. Это гарантирует, что деплой будет при каждом push в `main`

---

## Настройка Preview Deployments

Preview деплои создаются автоматически для:
- Pull Requests
- Других веток (не main)

Чтобы отключить (опционально):
1. **Settings** → **"Git"**
2. Отключите **"Automatic Preview Deployments"** (если не нужны)

---

## Проверка настроек

После настройки проверьте:

1. **Settings** → **"General"**:
   - ✅ Root Directory: `frontend`
   - ✅ Framework: Vite (или определится автоматически)

2. **Settings** → **"Git"**:
   - ✅ Repository: `elyorka22/delivery`
   - ✅ Production Branch: `main`

3. **Settings** → **"Environment Variables"**:
   - ✅ `VITE_API_URL` установлена

---

## Что происходит при автодеплое

1. Вы делаете `git push` в GitHub
2. Vercel автоматически обнаруживает изменения (через GitHub webhook)
3. Создается новый деплой
4. Выполняется `npm install` в папке `frontend`
5. Выполняется `npm run build`
6. Файлы из `dist` деплоятся на Vercel
7. Сайт обновляется автоматически

---

## Устранение проблем

### Проблема: Автодеплой не работает

**Решение:**
1. Проверьте, что репозиторий подключен: **Settings** → **"Git"**
2. Проверьте GitHub webhook:
   - В GitHub: **Settings** → **Webhooks**
   - Должен быть webhook от Vercel
3. Проверьте Production Branch: должен быть `main`

### Проблема: Деплой падает с ошибкой

**Решение:**
1. Проверьте логи: **Deployments** → выберите деплой → **"View Build Logs"**
2. Убедитесь, что Root Directory = `frontend`
3. Проверьте Environment Variables

### Проблема: Изменения не появляются

**Решение:**
1. Очистите кеш браузера (Ctrl+Shift+R)
2. Проверьте, что деплой завершился успешно
3. Убедитесь, что открываете production URL, а не preview

---

## Полезные ссылки

- Vercel Dashboard: https://vercel.com/dashboard
- Документация Vercel: https://vercel.com/docs
- GitHub репозиторий: https://github.com/elyorka22/delivery

---

## Быстрая проверка

После настройки выполните:

```bash
# Сделайте небольшое изменение
echo "// Test" >> frontend/src/App.tsx

# Закоммитьте и отправьте
git add frontend/src/App.tsx
git commit -m "Test autodeploy"
git push
```

Через 1-2 минуты проверьте Vercel Dashboard → Deployments - должен появиться новый деплой!

