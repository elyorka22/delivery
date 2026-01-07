# Деплой Frontend на Vercel - Пошаговая инструкция

## Подготовка

### 1. Убедитесь, что код в GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Деплой на Vercel

### Шаг 1: Создать аккаунт

1. Зайдите на https://vercel.com
2. Нажмите "Sign Up"
3. Войдите через GitHub

### Шаг 2: Создать проект

1. Нажмите "Add New..." → "Project"
2. Выберите ваш репозиторий `elyorka22/delivery`
3. Нажмите "Import"

### Шаг 3: Настроить проект

Vercel автоматически определит, что это Vite проект.

Настройте:
- **Framework Preset:** Vite (автоматически)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (автоматически)
- **Output Directory:** `dist` (автоматически)
- **Install Command:** `npm install` (автоматически)

### Шаг 4: Добавить переменные окружения

В настройках проекта → "Environment Variables":

```env
VITE_API_URL=https://yourproject.up.railway.app/api
```

**Важно:** Добавьте эту переменную для всех окружений (Production, Preview, Development)

### Шаг 5: Деплой

1. Нажмите "Deploy"
2. Vercel автоматически:
   - Установит зависимости
   - Соберет проект
   - Задеплоит на CDN

### Шаг 6: Получить URL

После деплоя вы получите:
- Production URL: `https://yourproject.vercel.app`
- Preview URLs: для каждого pull request

---

## Настройка домена (опционально)

1. В настройках проекта → "Settings" → "Domains"
2. Нажмите "Add Domain"
3. Введите ваш домен (например: `fooddelivery.com`)
4. Следуйте инструкциям для настройки DNS

---

## Обновление кода

После каждого push в `main` ветку:
1. Vercel автоматически обнаружит изменения
2. Запустит новый деплой
3. Обновит production

Для pull requests:
- Vercel создаст preview deployment
- Вы получите уникальный URL для тестирования

---

## Переменные окружения

### Production
```env
VITE_API_URL=https://yourproject.up.railway.app/api
```

### Preview/Development
Можно использовать тот же URL или другой для тестирования.

---

## Проверка

1. Откройте URL вашего Vercel проекта
2. Проверьте, что сайт загружается
3. Проверьте, что API запросы работают (откройте DevTools → Network)

---

## Analytics (опционально)

На Pro тарифе ($20/мес) доступны:
- Web Analytics
- Speed Insights
- Real User Monitoring

---

## Стоимость

- **Hobby (Free):** Бесплатно
  - Неограниченные деплои
  - 100GB bandwidth/мес
  - SSL автоматически
  - CDN по всему миру

- **Pro ($20/мес):** Для больших проектов
  - Больше bandwidth
  - Analytics
  - Priority support

---

## Troubleshooting

### Проблема: Сайт не загружается

1. Проверьте логи деплоя в Vercel
2. Убедитесь, что build прошел успешно
3. Проверьте переменные окружения

### Проблема: API запросы не работают

1. Убедитесь, что `VITE_API_URL` установлен правильно
2. Проверьте CORS настройки на backend
3. Проверьте, что backend доступен по указанному URL

### Проблема: Изображения не загружаются

1. Убедитесь, что `getImageUrl` использует правильный базовый URL
2. Проверьте, что backend доступен для статических файлов

---

## Следующие шаги

После деплоя frontend:
1. Обновите `FRONTEND_URL` в Railway (backend)
2. Протестируйте весь flow: регистрация → заказ → админ панели

