# Быстрый старт с Supabase

## ✅ Проект готов к работе с Supabase!

Все настройки уже выполнены. Вам нужно только:

### 1. Создать проект в Supabase (5 минут)

1. Зайдите на https://supabase.com
2. Создайте аккаунт (если нет)
3. Нажмите **New Project**
4. Заполните форму и создайте проект
5. Дождитесь завершения настройки

### 2. Получить Connection String

1. В проекте: **Settings** → **Database**
2. Скопируйте **Connection string** (URI)
3. Формат: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 3. Настроить .env

```bash
cd backend
cp .env.example .env
```

Откройте `.env` и вставьте ваш Connection String:

```env
DATABASE_URL="postgresql://postgres:[ВАШ-ПАРОЛЬ]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Важно:** Добавьте `?pgbouncer=true&connection_limit=1` в конец URL!

### 4. Применить миграции

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 5. Создать тестовых пользователей

```bash
npm run create-test-users
```

### 6. Запустить сервер

```bash
npm run dev
```

## Готово! 🎉

Теперь ваш проект работает с Supabase.

### Проверка

Откройте Prisma Studio для просмотра базы данных:
```bash
npx prisma studio
```

### Подробная инструкция

См. `backend/MIGRATION_GUIDE.md` для детальной инструкции.

