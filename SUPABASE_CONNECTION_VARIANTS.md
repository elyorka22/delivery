# Варианты Connection String для Supabase

## Проблема
Railway не может подключиться к Supabase напрямую. Connection Pooling недоступен.

---

## ✅ Попробуйте эти варианты по очереди в Railway

### Вариант 1: Без параметров (самый простой)
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

### Вариант 2: Только SSL
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require
```

### Вариант 3: С таймаутами
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=30
```

### Вариант 4: С application_name
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&application_name=railway-backend
```

### Вариант 5: С pool_timeout
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=30&pool_timeout=30
```

### Вариант 6: Без SSL (если SSL блокируется)
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=prefer
```

### Вариант 7: С direct connection
```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&direct=true
```

---

## Как тестировать

1. Зайдите на **https://railway.app**
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите `DATABASE_URL`
5. Замените значение на один из вариантов выше
6. Нажмите **Save**
7. Подождите 1-2 минуты (Railway перезапустит сервер)
8. Проверьте логи:
   - **Deployments** → последний деплой → **Logs**
   - Ищите: `✅ Prisma connected to database`
9. Если не работает - попробуйте следующий вариант

---

## Проверка в Supabase

Также проверьте настройки в Supabase:

1. Зайдите на **https://supabase.com**
2. Откройте проект → **Settings** → **Database**
3. Проверьте:
   - **"Network restrictions"** - должно быть отключено или разрешено для всех
   - **"IP allowlist"** - должно быть пусто или включать Railway IP
   - **"Connection pooling"** - если есть, попробуйте включить

---

## Если ни один вариант не работает

Возможные причины:
1. Supabase блокирует подключения из Railway (firewall)
2. Railway блокирует исходящие подключения к Supabase
3. Проблемы с DNS разрешением

В этом случае можно:
- Использовать Railway PostgreSQL (как альтернатива)
- Обратиться в поддержку Supabase
- Проверить статус проекта Supabase (может быть приостановлен)

---

## Готово! ✅

Начните с **Варианта 1** (самый простой) и идите по порядку. Один из них должен сработать!

