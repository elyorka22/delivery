# Создание супер-админа с демо данными

## Демо данные для супер-админа:

- **Email:** `admin@demo.com`
- **Пароль:** `admin123`
- **Имя:** `Demo Super Admin`
- **Телефон:** `+7 (999) 000-00-00`

---

## Способ 1: Через Railway (Рекомендуется)

1. Зайдите на https://railway.app
2. Откройте ваш проект → сервис (backend)
3. Перейдите в **Deployments** → **View Logs**
4. Используйте **Shell** для выполнения команд:

```bash
cd backend
npm run create-admin
```

Или с демо данными:
```bash
cd backend
ADMIN_EMAIL=admin@demo.com \
ADMIN_PASSWORD=admin123 \
ADMIN_NAME="Demo Super Admin" \
ADMIN_PHONE="+7 (999) 000-00-00" \
npm run create-admin
```

---

## Способ 2: Через Supabase Dashboard

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **SQL Editor**
4. Выполните следующий SQL запрос:

```sql
-- Создание супер-админа с демо данными
-- Email: admin@demo.com
-- Пароль: admin123

INSERT INTO users (email, password, name, phone, role, created_at, updated_at)
VALUES (
  'admin@demo.com',
  '$2a$10$b/ZJ6Rt1FxTSzx8PJPJviuH4OFxejWrFd/X59wjtaRBAMhiRQBv8K',
  'Demo Super Admin',
  '+7 (999) 000-00-00',
  'SUPER_ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
  role = 'SUPER_ADMIN',
  password = '$2a$10$b/ZJ6Rt1FxTSzx8PJPJviuH4OFxejWrFd/X59wjtaRBAMhiRQBv8K',
  name = 'Demo Super Admin',
  phone = '+7 (999) 000-00-00',
  updated_at = NOW();
```

**Важно:** Нужно получить правильный хеш пароля. Используйте:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash))"
```

Скопируйте полученный хеш и замените в SQL запросе.

---

## Способ 3: Через Prisma Studio (если доступно)

1. Запустите Prisma Studio:
   ```bash
   cd backend
   npx prisma studio
   ```

2. Откройте таблицу `User`
3. Нажмите **Add record**
4. Заполните:
   - `email`: `admin@demo.com`
   - `password`: (хеш пароля - см. способ 2)
   - `name`: `Demo Super Admin`
   - `phone`: `+7 (999) 000-00-00`
   - `role`: `SUPER_ADMIN`
   - `createdAt`: текущая дата
   - `updatedAt`: текущая дата

---

## После создания

1. Откройте ваш сайт (Vercel URL)
2. Нажмите **"Войти"**
3. Введите:
   - Email: `admin@demo.com`
   - Пароль: `admin123`
4. После входа перейдите в **Админ-панель** (`/admin`)
5. Перейдите в **Профиль** (`/admin/profile`)
6. Измените демо данные на ваши реальные данные:
   - Имя
   - Email
   - Телефон
   - Пароль (если нужно)
   - Аватар (если нужно)

---

## Изменение данных в админ-панели

После входа с демо данными:

1. Перейдите в **Админ-панель** → **Профиль** (или `/admin/profile`)
2. Заполните форму:
   - **Имя:** ваше реальное имя
   - **Email:** ваш реальный email
   - **Телефон:** ваш реальный телефон
   - **Пароль:** ваш новый пароль (если хотите изменить)
   - **Аватар:** загрузите ваше фото (опционально)
3. Нажмите **"Saqlash"** (Сохранить)

---

## Готово! ✅

Теперь у вас есть:
- ✅ Супер-админ с демо данными
- ✅ Возможность изменить данные через админ-панель
- ✅ Безопасный способ обновления пароля

---

## Важно

- После первого входа **обязательно** измените пароль на более безопасный
- Используйте ваш реальный email для восстановления доступа
- Не делитесь учетными данными

