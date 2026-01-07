# Исправление подключения к базе данных

## Проблема
Prisma не может подключиться к Supabase:
```
Can't reach database server at db.gykgvdssaaloinxkqwtz.supabase.co:5432
```

---

## Решение

### Шаг 1: Проверить DATABASE_URL в Railway

1. Зайдите на https://railway.app
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите переменную `DATABASE_URL`
5. Проверьте значение

### Шаг 2: Получить правильный Connection String из Supabase

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **Database**
4. Прокрутите до секции **"Connection string"**
5. Выберите вкладку **"URI"**
6. Скопируйте строку подключения

**Формат будет:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

### Шаг 3: URL-encode пароль

Если пароль содержит специальные символы, их нужно закодировать:

- `#` → `%23`
- `+` → `%2B`
- `$` → `%24`
- `@` → `%40`
- `&` → `%26`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (пробел) → `%20`

**Пример:**
Если пароль: `My#Pass+123`
То в URL должно быть: `My%23Pass%2B123`

### Шаг 4: Обновить DATABASE_URL в Railway

1. В Railway → Settings → Variables
2. Найдите `DATABASE_URL`
3. Нажмите для редактирования
4. Вставьте правильный Connection String с URL-encoded паролем
5. Нажмите **Save**
6. Railway автоматически перезапустит сервер

---

## Альтернативное решение: Использовать Pooler URL

Если прямое подключение не работает, попробуйте использовать Pooler URL:

1. В Supabase → Settings → Database
2. Найдите **"Connection string"** → вкладка **"Connection Pooling"**
3. Выберите **"Session mode"** или **"Transaction mode"**
4. Скопируйте Pooler URL
5. Обновите `DATABASE_URL` в Railway

**Формат Pooler URL:**
```
postgresql://postgres.gykgvdssaaloinxkqwtz:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Проверка

После обновления `DATABASE_URL`:

1. Railway автоматически перезапустит сервер (1-2 минуты)
2. Проверьте логи в Railway:
   - **Deployments** → последний деплой → **Logs**
   - Не должно быть ошибок `Can't reach database server`
3. Проверьте health endpoint:
   ```
   https://delivery-production-1860.up.railway.app/api/health
   ```
4. Попробуйте войти снова

---

## Если проблема осталась

### Вариант 1: Проверить Supabase проект

1. Зайдите на https://supabase.com
2. Проверьте статус проекта
3. Убедитесь, что проект активен (не приостановлен)
4. Попробуйте сбросить пароль базы данных

### Вариант 2: Использовать Pooler URL

Pooler URL более надежен для production:
- Использует connection pooling
- Лучше работает с Railway
- Меньше проблем с подключением

### Вариант 3: Проверить пароль

1. В Supabase → Settings → Database
2. Нажмите **"Reset database password"**
3. Установите новый простой пароль (без специальных символов)
4. Обновите `DATABASE_URL` в Railway с новым паролем

---

## Важно

- ✅ Пароль должен быть правильно URL-encoded
- ✅ Используйте полный Connection String из Supabase
- ✅ Проверьте, что Supabase проект активен
- ✅ Попробуйте Pooler URL, если прямое подключение не работает

---

## Готово! ✅

После правильной настройки `DATABASE_URL` подключение к базе данных должно работать.

