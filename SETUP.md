# Инструкция по запуску

## Предварительные требования

- Node.js (v18 или выше)
- PostgreSQL
- npm или yarn

## Установка и запуск

### 1. Настройка базы данных (Supabase)

**Рекомендуется использовать Supabase:**

1. Зайдите на https://supabase.com
2. Создайте аккаунт и новый проект
3. Дождитесь завершения настройки (2-3 минуты)
4. Перейдите в **Settings** → **Database**
5. Скопируйте **Connection string** (URI)
6. Формат будет: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

**Альтернатива:** Используйте локальный PostgreSQL (см. ниже)

### 2. Backend

```bash
cd backend
npm install

# Создайте файл .env на основе .env.example
cp .env.example .env

# Отредактируйте .env и укажите DATABASE_URL:
# Для Supabase:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
# 
# Для локального PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/fooddelivery?schema=public"
#
# Также настройте:
# JWT_SECRET="your-secret-key-change-in-production"
# PORT=5000
# FRONTEND_URL="http://localhost:3000"

# Сгенерируйте Prisma клиент
npx prisma generate

# Запустите миграции
npx prisma migrate dev

# Запустите сервер
npm run dev
```

**Подробная инструкция по Supabase:** см. `SUPABASE_SETUP.md`

Backend будет доступен на `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

## Создание первого пользователя

После запуска backend, вы можете создать пользователя через API:

```bash
# Создать супер-админа
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin",
    "role": "SUPER_ADMIN"
  }'

# Создать менеджера
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "manager123",
    "name": "Manager",
    "role": "MANAGER"
  }'
```

## Роли пользователей

- **CUSTOMER** - клиент (по умолчанию)
- **SUPER_ADMIN** - супер-администратор
- **MANAGER** - менеджер ресторана
- **COOK** - повар
- **COURIER** - курьер

## Структура проекта

- `backend/` - серверная часть (Node.js + Express + Prisma)
- `frontend/` - клиентская часть (React + TypeScript + Vite)
- `PROJECT_PLAN.md` - детальный план проекта

## Основные функции

✅ Регистрация и авторизация
✅ Просмотр ресторанов и меню
✅ Корзина и оформление заказа
✅ Отслеживание заказов
✅ Админ-панели для всех ролей
✅ Real-time уведомления (Socket.io)
✅ Мобильная адаптация

## Примечания

- Для работы менеджера нужно создать ресторан и связать его с менеджером через базу данных
- Real-time уведомления работают через Socket.io
- Все изображения пока используют placeholder'ы

