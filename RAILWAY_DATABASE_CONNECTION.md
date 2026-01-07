# Исправление подключения к базе данных в Railway

## Проблема
```
Can't reach database server at db.gykgvdssaaloinxkqwtz.supabase.co:5432
P1001 error code
```

База данных работает (MCP может подключиться), но Railway не может подключиться через Prisma.

---

## Решения

### Решение 1: Проверить Connection Pooling URL

Supabase предоставляет специальный URL для connection pooling, который может работать лучше с Railway:

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите **"Connection string"** → **"Connection pooling"**
5. Скопируйте URL (формат: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`)
6. Обновите `DATABASE_URL` в Railway

**Важно**: Pooling URL использует порт **6543**, а не 5432!

### Решение 2: Использовать прямой Connection String без параметров

Попробуйте упрощенный формат:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

Без параметров `?sslmode=require&connect_timeout=10`.

### Решение 3: Проверить Network Restrictions в Supabase

1. В Supabase → **Settings** → **Database**
2. Проверьте **"Network restrictions"**
3. Убедитесь, что нет ограничений по IP
4. Если есть - добавьте IP Railway (или отключите ограничения)

### Решение 4: Использовать Railway PostgreSQL (альтернатива)

Если Supabase продолжает вызывать проблемы, можно использовать встроенную PostgreSQL от Railway:

1. В Railway → **New** → **Database** → **Add PostgreSQL**
2. Railway автоматически создаст `DATABASE_URL`
3. Запустите миграции: `npx prisma migrate deploy`

---

## Текущие изменения в коде

1. **Lazy connection** - Prisma подключается при первом запросе, а не сразу
2. **Retry logic** - автоматическая повторная попытка через 5 секунд
3. **Delayed initialization** - задержка 2 секунды перед попыткой подключения

Это помогает с таймингом инициализации сети в Railway.

---

## Проверка после исправления

1. Railway автоматически перезапустит сервер
2. Проверьте логи:
   - Должно быть: `✅ Prisma connected to database`
   - Если ошибка - будет retry через 5 секунд
3. Попробуйте войти или зарегистрироваться

---

## Если ничего не помогает

1. **Проверьте статус Supabase проекта** - может быть приостановлен
2. **Сбросьте пароль базы данных** в Supabase
3. **Используйте Connection Pooling URL** вместо прямого подключения
4. **Создайте новый Supabase проект** и перенесите данные

---

## Готово! ✅

Попробуйте сначала **Connection Pooling URL** - это часто решает проблемы с Railway.


