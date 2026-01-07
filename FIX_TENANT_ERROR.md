# Исправление ошибки "Tenant or user not found"

## Проблема
```
FATAL: Tenant or user not found
```

Это означает, что Pooler URL неправильный или используется неправильный формат.

---

## Решение: Использовать прямой Connection String

### Шаг 1: Получить прямой Connection String из Supabase

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **Database**
4. Прокрутите до секции **"Connection string"**
5. Выберите вкладку **"URI"** (не "Connection Pooling")
6. Скопируйте Connection String

**Формат будет:**
```
postgresql://postgres:[PASSWORD]@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

### Шаг 2: Добавить параметры для надежного подключения

Добавьте параметры SSL и таймауты:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
```

### Шаг 3: Обновить DATABASE_URL в Railway

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

## Альтернатива: Проверить Supabase проект

### Шаг 1: Проверить статус проекта

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Проверьте статус проекта (должен быть активен)
4. Если проект приостановлен - активируйте его

### Шаг 2: Проверить пароль базы данных

1. В Supabase → **Settings** → **Database**
2. Проверьте, что пароль правильный
3. Если нужно - сбросьте пароль:
   - Нажмите **"Reset database password"**
   - Установите новый пароль
   - Обновите `DATABASE_URL` в Railway с новым паролем

---

## Проверка

После обновления `DATABASE_URL`:

1. Railway автоматически перезапустит сервер (1-2 минуты)
2. Проверьте логи:
   - **Deployments** → последний деплой → **Logs**
   - Не должно быть ошибок `Tenant or user not found`
3. Проверьте health endpoint:
   ```
   https://delivery-production-1860.up.railway.app/api/health
   ```
4. Попробуйте войти снова

---

## Если проблема осталась

### Вариант 1: Сбросить пароль базы данных

1. В Supabase → **Settings** → **Database**
2. Нажмите **"Reset database password"**
3. Установите новый простой пароль (без специальных символов)
4. Обновите `DATABASE_URL` в Railway с новым паролем

### Вариант 2: Проверить, что проект активен

1. Убедитесь, что Supabase проект не приостановлен
2. Проверьте, что база данных доступна
3. Попробуйте перезапустить проект в Supabase

---

## Готово! ✅

Используйте прямой Connection String с параметрами SSL - это должно решить проблему.


