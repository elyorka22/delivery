# Деплой на Railway - Пошаговая инструкция

## Подготовка

### 1. Убедитесь, что код в GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Обновите код для продакшена

#### Backend: Использовать переменную PORT

Railway автоматически устанавливает `PORT`, нужно использовать `process.env.PORT`:

Файл уже использует: `const PORT = process.env.PORT || 5000;` ✅

#### Backend: Обновить CORS

Убедитесь, что CORS принимает ваш фронтенд URL.

---

## Деплой на Railway

### Шаг 1: Создать аккаунт

1. Зайдите на https://railway.app
2. Нажмите "Start a New Project"
3. Войдите через GitHub

### Шаг 2: Создать проект

1. Нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите ваш репозиторий `elyorka22/delivery`

### Шаг 3: Настроить сервис

Railway автоматически определит, что это Node.js проект.

1. В настройках сервиса найдите "Settings"
2. Установите:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start` (Railway автоматически запустит `npm run build`)

### Шаг 4: Добавить переменные окружения

В настройках сервиса → "Variables":

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=[СГЕНЕРИРУЙТЕ_БЕЗОПАСНЫЙ_КЛЮЧ]
FRONTEND_URL=https://yourproject.vercel.app
NODE_ENV=production
```

**Как сгенерировать JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Шаг 5: Деплой

Railway автоматически:
1. Установит зависимости (`npm install`)
2. Соберет проект (`npm run build`)
3. Запустит сервер (`npm start`)

### Шаг 6: Получить URL

1. В настройках сервиса → "Settings" → "Networking"
2. Нажмите "Generate Domain"
3. Скопируйте URL (например: `https://yourproject.up.railway.app`)

---

## Настройка для файлов (uploads)

### Вариант 1: Railway Volume (простой)

1. В настройках сервиса → "Settings" → "Volumes"
2. Нажмите "Create Volume"
3. Укажите путь: `/app/uploads`
4. Railway будет хранить файлы в этом volume

### Вариант 2: Supabase Storage (рекомендуется)

Нужно обновить код для загрузки в Supabase Storage вместо локальной папки.

---

## Проверка

1. Откройте URL вашего Railway сервиса
2. Проверьте: `https://yourproject.up.railway.app/api/health`
3. Должен вернуться: `{"status":"ok","message":"Server is running"}`

---

## Логи

Для просмотра логов:
1. В Railway dashboard откройте ваш сервис
2. Вкладка "Deployments" → выберите последний деплой
3. Вкладка "Logs" покажет все логи в реальном времени

---

## Обновление кода

После каждого push в GitHub:
1. Railway автоматически обнаружит изменения
2. Запустит новый деплой
3. Обновит сервис

---

## Мониторинг

Railway предоставляет:
- Метрики использования (CPU, Memory, Network)
- Логи в реальном времени
- Health checks
- Автоматическое масштабирование

---

## Стоимость

- **Бесплатно:** $5 кредитов каждый месяц
- **Paid:** От $5/мес за использование
- Для вашего проекта: ~$5-10/мес

---

## Troubleshooting

### Проблема: Сервис не запускается

1. Проверьте логи в Railway
2. Убедитесь, что все переменные окружения установлены
3. Проверьте, что `DATABASE_URL` правильный

### Проблема: Ошибка подключения к базе данных

1. Проверьте `DATABASE_URL` в переменных окружения
2. Убедитесь, что Supabase проект активен
3. Проверьте, что пароль правильный (может содержать специальные символы - нужно URL encode)

### Проблема: CORS ошибки

1. Убедитесь, что `FRONTEND_URL` установлен правильно
2. Проверьте, что в коде CORS настроен для этого URL

---

## Следующие шаги

После деплоя backend:
1. Задеплойте frontend на Vercel
2. Обновите `FRONTEND_URL` в Railway
3. Обновите `VITE_API_URL` в Vercel

