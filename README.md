# Система доставки еды

Полнофункциональная система доставки еды с админ-панелями для разных ролей пользователей.

## Технологии

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **База данных**: Supabase (PostgreSQL) + Prisma ORM
- **Real-time**: Socket.io

## Установка

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Настройте DATABASE_URL в .env (см. SUPABASE_SETUP.md)
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Важно:** Для работы с Supabase нужно:
1. Создать проект на https://supabase.com
2. Получить Connection String из Settings → Database
3. Добавить его в `.env` как `DATABASE_URL`
4. Подробнее см. `SUPABASE_SETUP.md`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Роли пользователей

1. **Клиент (CUSTOMER)** - публичная часть
2. **Супер-админ (SUPER_ADMIN)** - полное управление системой
3. **Менеджер (MANAGER)** - управление рестораном
4. **Повар (COOK)** - управление заказами на кухне
5. **Курьер (COURIER)** - доставка заказов

## Функционал

### Клиент
- Просмотр ресторанов и меню
- Добавление в корзину
- Оформление заказа
- Отслеживание заказа
- История заказов
- Профиль

### Супер-админ
- Статистика системы
- Управление ресторанами
- Управление пользователями
- Просмотр всех заказов

### Менеджер
- Статистика ресторана
- Управление меню
- Просмотр заказов ресторана

### Повар
- Просмотр заказов
- Изменение статуса готовности

### Курьер
- Просмотр доступных заказов
- Принятие заказов
- Отслеживание доставки

## Структура проекта

```
fooddelivery/
├── backend/          # Backend приложение
├── frontend/         # Frontend приложение
└── PROJECT_PLAN.md   # План проекта
```

