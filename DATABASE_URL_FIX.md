# Правильный DATABASE_URL для Railway

## Ваш Connection String

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

---

## Как добавить в Railway

### Шаг 1: Открыть Railway

1. Зайдите на https://railway.app
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**

### Шаг 2: Добавить или обновить DATABASE_URL

1. Найдите переменную `DATABASE_URL` (или создайте новую)
2. Нажмите для редактирования
3. Вставьте значение:
   ```
   postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require
   ```
4. Нажмите **Save**

**Важно:** Добавлен параметр `?sslmode=require` для безопасного подключения.

---

## Альтернатива: С параметрами подключения

Если базовый вариант не работает, попробуйте с дополнительными параметрами:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
```

Или с connection pooling (если прямое подключение не работает):

```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

---

## Проверка

После добавления `DATABASE_URL`:

1. Railway автоматически перезапустит сервер (1-2 минуты)
2. Проверьте логи:
   - **Deployments** → последний деплой → **Logs**
   - Не должно быть ошибок `Can't reach database server`
3. Проверьте health endpoint:
   ```
   https://delivery-production-1860.up.railway.app/api/health
   ```
4. Попробуйте войти снова

---

## Если проблема осталась

### Вариант 1: Использовать Pooler URL

1. Зайдите на https://supabase.com
2. Откройте проект → **Settings** → **Database**
3. Найдите **"Connection string"** → вкладка **"Connection Pooling"**
4. Выберите **"Session mode"**
5. Скопируйте Pooler URL
6. Обновите `DATABASE_URL` в Railway

### Вариант 2: Проверить Supabase проект

1. Убедитесь, что проект активен (не приостановлен)
2. Проверьте, что база данных доступна
3. Попробуйте сбросить пароль базы данных

---

## Готово! ✅

После правильной настройки `DATABASE_URL` подключение должно работать.

