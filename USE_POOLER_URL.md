# Использование Pooler URL для подключения к Supabase

## Проблема
Прямое подключение к Supabase не работает из Railway. Нужно использовать Connection Pooler.

---

## Как получить Pooler URL

### Шаг 1: Открыть Supabase

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **Database**

### Шаг 2: Найти Connection Pooling

1. Прокрутите вниз до секции **"Connection string"**
2. Выберите вкладку **"Connection Pooling"** (не "URI")
3. Выберите режим: **"Session mode"** (рекомендуется)
4. Скопируйте Connection String

**Формат Pooler URL будет:**
```
postgresql://postgres.gykgvdssaaloinxkqwtz:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Или:**
```
postgresql://postgres.gykgvdssaaloinxkqwtz:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Шаг 3: Заменить пароль

Замените `[PASSWORD]` на ваш реальный пароль: `2fjzhO8DlWGTzpIY`

**Пример:**
```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Добавить в Railway

### Шаг 4: Обновить DATABASE_URL в Railway

1. Зайдите на https://railway.app
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите переменную `DATABASE_URL`
5. Нажмите для редактирования
6. Вставьте Pooler URL (с вашим паролем)
7. Нажмите **Save**
8. Railway автоматически перезапустит сервер

---

## Преимущества Pooler URL

- ✅ Более надежное подключение
- ✅ Connection pooling (лучше для production)
- ✅ Работает лучше с Railway
- ✅ Меньше проблем с таймаутами

---

## Проверка

После обновления `DATABASE_URL` на Pooler URL:

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

## Если Pooler URL не работает

### Вариант 1: Проверить Supabase проект

1. Убедитесь, что проект активен (не приостановлен)
2. Проверьте статус базы данных
3. Попробуйте сбросить пароль базы данных

### Вариант 2: Использовать другой регион

Pooler URL может быть в другом регионе. Проверьте все доступные варианты в Supabase.

---

## Готово! ✅

Pooler URL должен решить проблему с подключением к базе данных.


