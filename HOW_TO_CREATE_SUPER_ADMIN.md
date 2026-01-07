# Как создать супер-админа

Есть несколько способов создать супер-админа в системе:

---

## Способ 1: Через скрипт (Рекомендуется) ⭐

### Локально (Development)

1. Перейдите в папку `backend`:
   ```bash
   cd backend
   ```

2. Запустите скрипт:
   ```bash
   npx ts-node src/scripts/createSuperAdmin.ts
   ```

   Или с кастомными параметрами:
   ```bash
   ADMIN_EMAIL=myadmin@example.com ADMIN_PASSWORD=mypassword123 ADMIN_NAME="Мой Админ" npx ts-node src/scripts/createSuperAdmin.ts
   ```

### На сервере (Production - Railway)

1. Подключитесь к Railway через терминал или используйте Railway CLI
2. Запустите команду:
   ```bash
   npx ts-node src/scripts/createSuperAdmin.ts
   ```

   Или через Railway Dashboard:
   - Откройте ваш сервис
   - Перейдите в **Deployments** → **View Logs**
   - Используйте **Shell** для выполнения команд

---

## Способ 2: Через базу данных (Supabase)

### Через Supabase Dashboard

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **Table Editor** → **users**
4. Нажмите **Insert** → **Insert row**
5. Заполните поля:
   - `email`: ваш email (например: `admin@example.com`)
   - `password`: хеш пароля (см. ниже как получить)
   - `name`: ваше имя (например: `Супер Админ`)
   - `phone`: ваш телефон (например: `+7 (999) 000-00-00`)
   - `role`: `SUPER_ADMIN`
   - `createdAt`: текущая дата/время
   - `updatedAt`: текущая дата/время

### Как получить хеш пароля

**Вариант 1: Через Node.js**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('ваш_пароль', 10).then(hash => console.log(hash))"
```

**Вариант 2: Через скрипт**
```bash
cd backend
npx ts-node -e "import { hashPassword } from './src/utils/password'; hashPassword('ваш_пароль').then(h => console.log(h))"
```

---

## Способ 3: Через API (если уже есть супер-админ)

Если у вас уже есть супер-админ, вы можете создать нового через админ-панель:

1. Войдите как супер-админ
2. Перейдите в **Админ-панель** → **Пользователи**
3. Создайте нового пользователя
4. Затем обновите его роль в базе данных на `SUPER_ADMIN`

---

## Способ 4: Через MCP (Supabase)

Если у вас настроен MCP для Supabase:

1. Используйте MCP инструменты для выполнения SQL:
   ```sql
   INSERT INTO "User" (email, password, name, phone, role, "createdAt", "updatedAt")
   VALUES (
     'admin@example.com',
     '$2a$10$хеш_пароля_здесь',
     'Супер Админ',
     '+7 (999) 000-00-00',
     'SUPER_ADMIN',
     NOW(),
     NOW()
   );
   ```

---

## Проверка

После создания супер-админа:

1. Откройте сайт
2. Нажмите **"Войти"**
3. Введите email и пароль
4. После входа вы должны увидеть кнопку для перехода в админ-панель

---

## Важные моменты

1. **Безопасность:**
   - Используйте сильный пароль
   - Не делитесь учетными данными
   - После первого входа смените пароль (если есть такая функция)

2. **Email:**
   - Email должен быть уникальным
   - Если пользователь с таким email уже существует, скрипт обновит его роль

3. **Пароль:**
   - Минимум 6 символов (рекомендуется 8+)
   - Используйте комбинацию букв, цифр и символов

---

## Примеры использования

### Создать супер-админа с дефолтными данными:
```bash
cd backend
npx ts-node src/scripts/createSuperAdmin.ts
```

Результат:
- Email: `admin@example.com`
- Пароль: `admin123`
- Имя: `Супер Админ`

### Создать с кастомными данными:
```bash
cd backend
ADMIN_EMAIL=myadmin@mydomain.com \
ADMIN_PASSWORD=MySecurePass123! \
ADMIN_NAME="Мой Супер Админ" \
ADMIN_PHONE="+7 (999) 123-45-67" \
npx ts-node src/scripts/createSuperAdmin.ts
```

---

## Troubleshooting

### Проблема: "Cannot find module 'prisma'"

**Решение:**
```bash
cd backend
npm install
```

### Проблема: "Database connection error"

**Решение:**
1. Проверьте `.env` файл
2. Убедитесь, что `DATABASE_URL` правильно настроен
3. Проверьте, что база данных доступна

### Проблема: "User already exists"

**Решение:**
- Скрипт автоматически обновит роль существующего пользователя
- Или используйте другой email

---

## Готово! ✅

После создания супер-админа вы можете:
- Войти в систему
- Управлять ресторанами
- Создавать менеджеров
- Управлять пользователями
- Просматривать статистику


