# Исправление подключения Prisma к Supabase

## Проблема
```
Can't reach database server at db.gykgvdssaaloinxkqwtz.supabase.co:5432
P1001 error code
DATABASE_URL: Set
```

Prisma не может подключиться к Supabase, хотя DATABASE_URL установлен.

---

## Возможные причины

### 1. Supabase проект приостановлен
- Проверьте статус проекта в Supabase Dashboard
- Убедитесь, что проект активен

### 2. Неправильный формат DATABASE_URL
- Проверьте, что URL правильный
- Убедитесь, что нет лишних символов

### 3. Проблемы с сетью/firewall
- Railway может блокировать подключение
- Supabase может блокировать IP Railway

---

## Решения

### Решение 1: Проверить Supabase проект

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Проверьте статус:
   - Должен быть **"Active"** (активен)
   - Если приостановлен - активируйте его
4. Проверьте базу данных:
   - Settings → Database
   - Убедитесь, что база данных доступна

### Решение 2: Использовать другой формат Connection String

Попробуйте без параметров (только для теста):

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

Или с другими параметрами:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require
```

### Решение 3: Сбросить пароль базы данных

1. В Supabase → **Settings** → **Database**
2. Нажмите **"Reset database password"**
3. Установите новый простой пароль (без специальных символов)
4. Обновите `DATABASE_URL` в Railway с новым паролем

### Решение 4: Проверить IP whitelist в Supabase

1. В Supabase → **Settings** → **Database**
2. Проверьте **"Connection pooling"** и **"Network restrictions"**
3. Убедитесь, что нет ограничений по IP

---

## Проверка DATABASE_URL в Railway

### Убедитесь, что значение правильное:

1. Зайдите на https://railway.app
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите `DATABASE_URL`
5. Проверьте значение - должно быть точно:
   ```
   postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
   ```

---

## Альтернативное решение: Использовать Supabase через MCP

Если Prisma не может подключиться напрямую, можно временно использовать MCP для работы с базой данных, но это не долгосрочное решение.

---

## Проверка после исправления

1. Railway автоматически перезапустит сервер
2. Проверьте логи:
   - Должно быть: `✅ Prisma connected to database`
   - Не должно быть: `❌ Prisma connection error`
3. Попробуйте войти или зарегистрироваться

---

## Если ничего не помогает

1. **Создайте новый Supabase проект** и перенесите данные
2. **Используйте другой хостинг базы данных** (например, Railway PostgreSQL)
3. **Проверьте, не блокирует ли Supabase подключения из Railway**

---

## Готово! ✅

Попробуйте сначала проверить статус Supabase проекта и сбросить пароль базы данных.

