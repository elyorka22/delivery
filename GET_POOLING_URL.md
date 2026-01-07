# Как получить Connection Pooling URL из Supabase

## ✅ Connection Pooling доступен!

Вы видите настройки Connection Pooling. Теперь нужно получить Pooling URL.

---

## Шаг 1: Найти Connection String для Pooling

1. В Supabase → **Settings** → **Database**
2. Прокрутите до секции **"Connection string"**
3. Вы увидите несколько вкладок:
   - **"URI"** (прямое подключение - не используйте)
   - **"Connection Pooling"** ← **ВЫБЕРИТЕ ЭТУ**
   - Возможно другие варианты

4. Нажмите на вкладку **"Connection Pooling"**

---

## Шаг 2: Выбрать режим и скопировать URL

1. Выберите режим: **"Session mode"** (рекомендуется)
2. Скопируйте Connection String

**Формат Pooling URL будет примерно таким:**
```
postgresql://postgres.gykgvdssaaloinxkqwtz:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Важные отличия от обычного URL:**
- Пользователь: `postgres.gykgvdssaaloinxkqwtz` (с точкой!)
- Домен: `aws-0-[REGION].pooler.supabase.com` (не `db.gykgvdssaaloinxkqwtz.supabase.co`)
- Порт: **6543** (не 5432!)
- Параметр: `?pgbouncer=true`

---

## Шаг 3: Заменить пароль

В скопированном URL замените `[PASSWORD]` на ваш пароль: `2fjzhO8DlWGTzpIY`

**Пример результата:**
```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Или:
```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Шаг 4: Обновить в Railway

1. Зайдите на **https://railway.app**
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите `DATABASE_URL`
5. Нажмите для редактирования
6. **Удалите старое значение полностью**
7. Вставьте Pooling URL (с вашим паролем)
8. Нажмите **Save**
9. Railway автоматически перезапустит сервер

---

## Если не можете найти Pooling URL

Если в Supabase нет вкладки "Connection Pooling" в Connection string, попробуйте вручную сконструировать URL:

### Вариант 1: US West
```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

### Вариант 2: EU Central
```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

### Вариант 3: US East
```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

Попробуйте каждый вариант по очереди в Railway.

---

## Проверка после обновления

1. Railway автоматически перезапустит сервер (1-2 минуты)
2. Проверьте логи:
   - **Deployments** → последний деплой → **Logs**
   - Должно быть: `✅ Prisma connected to database`
   - НЕ должно быть: `Can't reach database server`
3. Проверьте диагностический endpoint:
   ```
   https://delivery-production-1860.up.railway.app/api/diagnose
   ```
   Должно показать: `"prisma_connection": "✅ Connected"`

---

## Готово! ✅

Connection Pooling URL должен решить проблему, так как использует другой порт и домен, который Railway может достичь.


