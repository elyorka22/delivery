# Настройка Supabase для проекта

## ✅ Проект настроен для Supabase

**Текущая конфигурация:** PostgreSQL (Supabase)
- Prisma schema обновлен для PostgreSQL
- Готов к подключению к Supabase

## Зачем нужен Supabase?

Supabase предоставляет:
- ✅ PostgreSQL базу данных в облаке
- ✅ Автоматические бэкапы
- ✅ Масштабируемость
- ✅ Простое управление через веб-интерфейс
- ✅ Бесплатный тариф для начала
- ✅ Дополнительные сервисы (Storage, Auth, Realtime)

## Как переключиться на Supabase

### Шаг 1: Создать проект в Supabase

1. Зайдите на https://supabase.com
2. Создайте аккаунт (если нет)
3. Создайте новый проект
4. Дождитесь завершения настройки (2-3 минуты)

### Шаг 2: Получить Connection String

1. В проекте Supabase перейдите в **Settings** → **Database**
2. Найдите секцию **Connection string**
3. Выберите **URI** и скопируйте строку подключения
4. Она будет выглядеть так:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Шаг 3: Обновить Prisma Schema

Изменить `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Шаг 4: Настроить .env

Создать/обновить `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Важно:** Используйте `?pgbouncer=true&connection_limit=1` для Supabase

### Шаг 5: Выполнить миграции

```bash
cd backend
npx prisma migrate deploy
# или для разработки:
npx prisma migrate dev
```

### Шаг 6: Сгенерировать Prisma Client

```bash
npx prisma generate
```

## Альтернатива: Обычный PostgreSQL

Если у вас есть свой PostgreSQL сервер:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fooddelivery?schema=public"
```

## Рекомендации

### Для разработки:
- Можно оставить SQLite (быстро, просто)
- Или использовать Supabase (ближе к продакшену)

### Для продакшена:
- ✅ **Рекомендуется:** Supabase или PostgreSQL
- ❌ **Не рекомендуется:** SQLite (ограничения по масштабированию)

## Миграция данных из SQLite в Supabase

Если у вас уже есть данные в SQLite:

1. Экспортируйте данные из SQLite
2. Импортируйте в Supabase через SQL или Prisma Studio
3. Или используйте `prisma db push` для синхронизации схемы

## Проверка подключения

После настройки проверьте:

```bash
cd backend
npx prisma studio
```

Должен открыться Prisma Studio с вашей Supabase базой данных.

