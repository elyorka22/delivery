# Исправление ошибки 405 при входе

## Проблема
Ошибка 405 (Method Not Allowed) при попытке войти означает, что:
- Запрос идет на неправильный URL
- Или API URL не настроен правильно в Vercel

---

## Решение

### Шаг 1: Проверить переменную VITE_API_URL в Vercel

1. Зайдите на https://vercel.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Проверьте, есть ли переменная `VITE_API_URL`

**Значение должно быть:**
```
https://yourproject.up.railway.app/api
```

**Важно:**
- Используйте полный URL с `https://`
- Добавьте `/api` в конце
- Без слеша в конце после `/api`

**Пример правильного значения:**
```
https://fooddelivery-production.up.railway.app/api
```

### Шаг 2: Проверить Railway URL

1. Зайдите на https://railway.app
2. Откройте ваш проект → сервис (backend)
3. Перейдите в **Settings** → **Networking**
4. Скопируйте **Public Domain** (например: `https://yourproject.up.railway.app`)
5. Добавьте `/api` в конце

### Шаг 3: Обновить VITE_API_URL в Vercel

1. В Vercel → Settings → Environment Variables
2. Если переменной нет - добавьте:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://yourproject.up.railway.app/api`
3. Если переменная есть - обновите значение
4. **Важно:** После изменения переменной Vercel автоматически пересоберет проект

### Шаг 4: Проверить работу backend

Откройте в браузере:
```
https://yourproject.up.railway.app/api/health
```

Должен вернуться:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

Если не работает - проверьте логи в Railway.

### Шаг 5: Проверить логин endpoint

Откройте в браузере (должна быть ошибка, но это нормально):
```
https://yourproject.up.railway.app/api/auth/login
```

Должна вернуться ошибка типа "Method not allowed" или "Bad request" (это нормально, так как это POST запрос).

Если вернулась ошибка 404 - значит путь неправильный.

---

## Проверка в браузере

1. Откройте сайт на Vercel
2. Откройте **DevTools** (F12)
3. Перейдите в **Network** (Сеть)
4. Попробуйте войти
5. Найдите запрос к `/auth/login`
6. Проверьте:
   - **URL** - должен быть полный URL с Railway доменом
   - **Method** - должен быть `POST`
   - **Status** - если 405, значит URL неправильный

---

## Частые ошибки

### Ошибка: VITE_API_URL не настроен

**Решение:**
- Добавьте переменную `VITE_API_URL` в Vercel
- Значение: `https://yourproject.up.railway.app/api`

### Ошибка: VITE_API_URL без /api

**Неправильно:**
```
https://yourproject.up.railway.app
```

**Правильно:**
```
https://yourproject.up.railway.app/api
```

### Ошибка: Backend не работает

**Решение:**
- Проверьте логи в Railway
- Убедитесь, что backend запущен
- Проверьте переменные окружения в Railway

---

## После исправления

1. Vercel автоматически пересоберет проект (1-2 минуты)
2. Обновите страницу в браузере (Ctrl+F5 или Cmd+Shift+R)
3. Попробуйте войти снова

---

## Проверка работы

После настройки `VITE_API_URL`:

1. Откройте DevTools (F12) → **Console**
2. Введите:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
3. Должен показать ваш Railway URL с `/api`

Если показывает `undefined` - переменная не настроена правильно.

---

## Готово! ✅

После правильной настройки `VITE_API_URL` вход должен работать.

