# Пошаговая инструкция: Деплой Frontend на Vercel

## Подготовка

### Шаг 1: Убедитесь, что код в GitHub

1. Проверьте, что все изменения закоммичены:
   ```bash
   git status
   ```

2. Если есть незакоммиченные изменения, закоммитьте их:
   ```bash
   git add .
   git commit -m "Prepare frontend for Vercel deployment"
   git push
   ```

---

## Деплой на Vercel

### Шаг 2: Создать аккаунт на Vercel

1. Зайдите на https://vercel.com
2. Нажмите **"Sign Up"** или **"Log In"**
3. Войдите через GitHub (рекомендуется)

### Шаг 3: Создать новый проект

1. После входа нажмите **"Add New..."** → **"Project"**
2. Выберите ваш GitHub репозиторий (`fooddelivery`)
3. Vercel автоматически определит проект

### Шаг 4: Настроить проект

#### 4.1. Root Directory

1. В настройках проекта найдите **"Root Directory"**
2. Нажмите **"Edit"**
3. Выберите **"frontend"** (так как это монорепо)
4. Нажмите **"Save"**

#### 4.2. Framework Preset

1. Vercel должен автоматически определить **Vite**
2. Если нет, выберите **"Vite"** вручную

#### 4.3. Build Settings

Vercel автоматически определит:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Проверьте, что эти настройки правильные.

### Шаг 5: Добавить переменные окружения

1. В настройках проекта найдите **"Environment Variables"**
2. Нажмите **"Add New"**

#### Переменная 1: VITE_API_URL

**Имя:** `VITE_API_URL`

**Значение:** URL вашего Railway backend

**Как получить Railway URL:**

1. Зайдите на https://railway.app
2. Откройте ваш проект
3. Откройте ваш сервис (service)
4. Перейдите в **Settings** → **Networking**
5. Найдите **"Public Domain"** или **"Custom Domain"**
6. Скопируйте URL (например: `https://yourproject.up.railway.app`)

**Важно:**
- Используйте полный URL с `https://`
- Добавьте `/api` в конце, если ваш API находится по пути `/api`
- Или просто базовый URL, если API на корневом пути

**Пример:**
```
https://yourproject.up.railway.app/api
```

**Или если API на корневом пути:**
```
https://yourproject.up.railway.app
```

#### Переменная 2: NODE_ENV (опционально)

**Имя:** `NODE_ENV`

**Значение:** `production`

---

### Шаг 6: Деплой

1. После настройки всех параметров нажмите **"Deploy"**
2. Vercel начнет процесс деплоя:
   - Установка зависимостей
   - Сборка проекта
   - Деплой

3. Дождитесь завершения (обычно 2-5 минут)

---

## После деплоя

### Шаг 7: Получить URL проекта

1. После успешного деплоя вы увидите:
   - ✅ **"Deployment successful"**
   - URL вашего проекта (например: `https://fooddelivery.vercel.app`)

2. **Скопируйте этот URL** - он понадобится для Railway переменных

### Шаг 8: Проверить работу

1. Откройте URL вашего проекта в браузере
2. Проверьте:
   - ✅ Страница загружается
   - ✅ Можно зарегистрироваться/войти
   - ✅ API запросы работают (проверьте в DevTools → Network)

### Шаг 9: Обновить переменные в Railway

После получения Vercel URL:

1. Зайдите на https://railway.app
2. Откройте ваш проект → сервис → **Settings** → **Variables**
3. Добавьте или обновите переменную:

**Имя:** `FRONTEND_URL`

**Значение:** Ваш Vercel URL (например: `https://fooddelivery.vercel.app`)

4. Railway автоматически перезапустит сервер

---

## Структура переменных окружения

### В Vercel (Frontend):

```
VITE_API_URL = https://yourproject.up.railway.app/api
NODE_ENV = production
```

### В Railway (Backend):

```
DATABASE_URL = postgresql://postgres:...@db....supabase.co:5432/postgres
JWT_SECRET = [сгенерированный ключ]
FRONTEND_URL = https://fooddelivery.vercel.app
NODE_ENV = production
```

---

## Troubleshooting

### Проблема: Build failed

**Решение:**
1. Проверьте логи в Vercel
2. Убедитесь, что `Root Directory` установлен на `frontend`
3. Проверьте, что все зависимости в `package.json`

### Проблема: API запросы не работают

**Решение:**
1. Проверьте переменную `VITE_API_URL` в Vercel
2. Убедитесь, что Railway backend доступен
3. Проверьте CORS настройки в backend (должен разрешать запросы с Vercel домена)

### Проблема: Страница белая или 404

**Решение:**
1. Проверьте `vercel.json` - должен быть правильный `rewrites`
2. Убедитесь, что `outputDirectory` установлен на `dist`

### Проблема: Изображения не загружаются

**Решение:**
1. Проверьте, что `VITE_API_URL` правильно настроен
2. Убедитесь, что Railway backend доступен
3. Проверьте логи в Railway

---

## Важные моменты

1. **CORS настройки:**
   - В backend должен быть разрешен доступ с Vercel домена
   - Проверьте `FRONTEND_URL` в Railway

2. **Переменные окружения:**
   - Переменные с префиксом `VITE_` доступны в коде
   - После изменения переменных нужно пересобрать проект

3. **Автоматический деплой:**
   - Vercel автоматически деплоит при каждом push в GitHub
   - Можно настроить деплой только из определенной ветки

4. **Custom Domain:**
   - После деплоя можно добавить свой домен
   - Settings → Domains → Add Domain

---

## Готово! ✅

После успешного деплоя:
1. ✅ Frontend доступен на Vercel
2. ✅ Получите Vercel URL
3. ✅ Обновите `FRONTEND_URL` в Railway
4. ✅ Проверьте работу всего приложения

---

## Следующие шаги

После деплоя frontend:
1. Добавьте переменные окружения в Railway (см. `RAILWAY_ENV_VARIABLES.md`)
2. Обновите `FRONTEND_URL` в Railway на ваш Vercel URL
3. Проверьте работу всего приложения
4. Настройте CORS в backend (если нужно)

