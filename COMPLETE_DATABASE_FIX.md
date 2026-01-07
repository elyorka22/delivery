# Полное исправление подключения к базе данных

## Проблема
Все запросы возвращают ошибку 500 из-за проблем с подключением к базе данных.

---

## Пошаговое решение

### Шаг 1: Проверить Supabase проект

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Проверьте статус проекта:
   - Должен быть **"Active"** (активен)
   - Если приостановлен - активируйте его

### Шаг 2: Получить правильный Connection String

1. В Supabase → **Settings** → **Database**
2. Прокрутите до **"Connection string"**
3. Выберите вкладку **"URI"**
4. Скопируйте Connection String

**Формат:**
```
postgresql://postgres:[PASSWORD]@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

### Шаг 3: Добавить параметры SSL

Добавьте параметры для надежного подключения:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
```

### Шаг 4: Обновить DATABASE_URL в Railway

1. Зайдите на https://railway.app
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите переменную `DATABASE_URL`
5. Нажмите для редактирования
6. Вставьте значение:
   ```
   postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
   ```
7. Нажмите **Save**
8. Railway автоматически перезапустит сервер

---

## Если проблема осталась

### Вариант 1: Сбросить пароль базы данных

1. В Supabase → **Settings** → **Database**
2. Нажмите **"Reset database password"**
3. Установите новый простой пароль (без специальных символов)
4. Обновите `DATABASE_URL` в Railway с новым паролем

### Вариант 2: Проверить все переменные окружения

Убедитесь, что в Railway есть все переменные:

- ✅ `DATABASE_URL` - Connection String из Supabase
- ✅ `JWT_SECRET` - сгенерированный ключ
- ✅ `FRONTEND_URL` - ваш Vercel URL
- ✅ `NODE_ENV` - `production`

### Вариант 3: Перезапустить сервер вручную

1. В Railway → **Deployments**
2. Найдите последний деплой
3. Нажмите **"Redeploy"** или **"Restart"**

---

## Проверка работы

После обновления `DATABASE_URL`:

1. Дождитесь перезапуска сервера (1-2 минуты)
2. Проверьте логи:
   - **Deployments** → последний деплой → **Logs**
   - Не должно быть ошибок `Can't reach database server` или `Tenant or user not found`
3. Проверьте health endpoint:
   ```
   https://delivery-production-1860.up.railway.app/api/health
   ```
   Должен вернуться: `{"status":"ok","message":"Server is running"}`
4. Попробуйте зарегистрироваться или войти

---

## Правильный DATABASE_URL

Используйте этот формат:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
```

**Важно:**
- Используйте прямой Connection String (не Pooler URL)
- Добавьте `?sslmode=require&connect_timeout=10`
- Пароль: `2fjzhO8DlWGTzpIY` (без изменений)

---

## Готово! ✅

После правильной настройки `DATABASE_URL` все должно работать.


