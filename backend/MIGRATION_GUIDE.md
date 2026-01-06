# Руководство по миграции на Supabase

## Шаг 1: Создать проект в Supabase

1. Зайдите на https://supabase.com
2. Создайте аккаунт (если нет)
3. Нажмите **New Project**
4. Заполните:
   - **Name**: название проекта (например, `fooddelivery`)
   - **Database Password**: придумайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
5. Нажмите **Create new project**
6. Дождитесь завершения настройки (2-3 минуты)

## Шаг 2: Получить Connection String

1. В проекте Supabase перейдите в **Settings** (шестеренка внизу слева)
2. Выберите **Database**
3. Прокрутите до секции **Connection string**
4. Выберите вкладку **URI**
5. Скопируйте строку подключения
6. Она будет выглядеть так:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## Шаг 3: Настроить .env

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Откройте `.env` и замените `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   ```
   
   **Важно:** 
   - Замените `[YOUR-PASSWORD]` на пароль, который вы указали при создании проекта
   - Замените `[PROJECT-REF]` на ваш Project Reference (из URL проекта)
   - Добавьте `?pgbouncer=true&connection_limit=1` в конце для Supabase

3. Настройте остальные переменные:
   ```env
   JWT_SECRET="your-secret-key-change-in-production"
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   ```

## Шаг 4: Выполнить миграции

```bash
cd backend

# Сгенерировать Prisma Client
npx prisma generate

# Применить миграции к Supabase
npx prisma migrate deploy

# Или для разработки (создаст новую миграцию):
npx prisma migrate dev
```

## Шаг 5: Проверить подключение

```bash
# Открыть Prisma Studio для просмотра базы данных
npx prisma studio
```

Должен открыться веб-интерфейс с вашей Supabase базой данных.

## Шаг 6: Создать тестовых пользователей

```bash
npm run create-test-users
```

## Миграция данных из SQLite (если нужно)

Если у вас уже есть данные в SQLite и вы хотите их перенести:

1. Экспортируйте данные из SQLite:
   ```bash
   # Используйте Prisma Studio или SQLite CLI
   sqlite3 prisma/dev.db .dump > backup.sql
   ```

2. Импортируйте в Supabase:
   - Откройте Supabase Dashboard → SQL Editor
   - Выполните SQL команды из backup.sql (адаптировав под PostgreSQL синтаксис)

Или используйте Prisma Studio для ручного копирования данных.

## Проверка работы

После настройки проверьте:

1. Backend запускается без ошибок:
   ```bash
   npm run dev
   ```

2. API доступен:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. База данных подключена:
   - Откройте Prisma Studio: `npx prisma studio`
   - Должны быть видны все таблицы

## Troubleshooting

### Ошибка подключения

- Проверьте правильность пароля в `DATABASE_URL`
- Убедитесь, что добавили `?pgbouncer=true&connection_limit=1`
- Проверьте, что проект Supabase активен

### Ошибка миграции

- Убедитесь, что Prisma Client сгенерирован: `npx prisma generate`
- Проверьте права доступа к базе данных в Supabase

### Проблемы с типами данных

- PostgreSQL поддерживает все типы, которые мы используем
- Если возникнут проблемы, проверьте схему в `prisma/schema.prisma`

## Дополнительные настройки Supabase

### Row Level Security (RLS)

По умолчанию RLS отключен. Если нужно включить:
1. Settings → Database → Row Level Security
2. Включите для нужных таблиц

### Бэкапы

Supabase автоматически делает бэкапы. Настройки:
- Settings → Database → Backups

### Мониторинг

- Dashboard → Database → показывает статистику использования
- Settings → Database → Connection Pooling для оптимизации

