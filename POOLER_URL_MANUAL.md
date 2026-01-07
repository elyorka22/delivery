# Создание Pooler URL вручную

## Ваш PROJECT-REF
```
gykgvdssaaloinxkqwtz
```

## Ваш пароль
```
2fjzhO8DlWGTzpIY
```

---

## Pooler URL формат

Pooler URL имеет следующий формат:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Готовый Pooler URL для вашего проекта

### Вариант 1: US West (обычно используется)

```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Вариант 2: EU Central (если проект в Европе)

```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Вариант 3: US East

```
postgresql://postgres.gykgvdssaaloinxkqwtz:2fjzhO8DlWGTzpIY@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Как добавить в Railway

1. Зайдите на https://railway.app
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите переменную `DATABASE_URL`
5. Нажмите для редактирования
6. Вставьте один из Pooler URL выше (начните с Варианта 1)
7. Нажмите **Save**
8. Railway автоматически перезапустит сервер

---

## Проверка

После добавления Pooler URL:

1. Railway автоматически перезапустит сервер (1-2 минуты)
2. Проверьте логи:
   - **Deployments** → последний деплой → **Logs**
   - Не должно быть ошибок `Can't reach database server`
3. Если Вариант 1 не работает, попробуйте Вариант 2 или 3

---

## Если ни один Pooler URL не работает

### Альтернатива: Прямое подключение с параметрами

Попробуйте прямой URL с дополнительными параметрами:

```
postgresql://postgres:2fjzhO8DlWGTzpIY@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10&pool_timeout=10
```

---

## Готово! ✅

Начните с Варианта 1 (US West) - это самый распространенный регион для Supabase.

