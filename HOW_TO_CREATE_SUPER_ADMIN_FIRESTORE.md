# Как создать супер-админа в Firestore

## Способ 1: Через скрипт (РЕКОМЕНДУЕТСЯ) ⭐

### Локально (Development)

1. Убедитесь, что Firebase настроен (переменные окружения установлены)
2. Перейдите в папку `backend`:
   ```bash
   cd backend
   ```

3. Запустите скрипт:
   ```bash
   npx ts-node src/scripts/createSuperAdmin.ts
   ```

   Или с кастомными параметрами:
   ```bash
   ADMIN_EMAIL=myadmin@example.com \
   ADMIN_PASSWORD=mypassword123 \
   ADMIN_NAME="Мой Админ" \
   ADMIN_PHONE="+7 (999) 111-11-11" \
   npx ts-node src/scripts/createSuperAdmin.ts
   ```

### На сервере (Production - Railway)

1. Зайдите на https://railway.app
2. Откройте ваш проект → сервис (backend)
3. Перейдите в **Deployments** → выберите последний deployment
4. Нажмите на **"..."** → **"Open Shell"** (или используйте Railway CLI)

5. В терминале выполните:
   ```bash
   cd backend
   npx ts-node src/scripts/createSuperAdmin.ts
   ```

   Или с демо данными:
   ```bash
   cd backend
   ADMIN_EMAIL=admin@demo.com \
   ADMIN_PASSWORD=admin123 \
   ADMIN_NAME="Demo Super Admin" \
   ADMIN_PHONE="+7 (999) 000-00-00" \
   npx ts-node src/scripts/createSuperAdmin.ts
   ```

---

## Способ 2: Через Firebase Console (вручную)

1. Зайдите на https://console.firebase.google.com
2. Выберите проект `delivery-34a6e`
3. Перейдите в **Firestore Database**
4. Создайте коллекцию `users` (если её нет)
5. Нажмите **"Add document"**
6. Заполните поля:

### Поля документа:

- **Document ID**: Оставьте пустым (Firestore создаст автоматически) или создайте свой ID
- **email** (string): `admin@demo.com`
- **password** (string): Хеш пароля (см. ниже как получить)
- **name** (string): `Demo Super Admin`
- **phone** (string): `+7 (999) 000-00-00`
- **role** (string): `SUPER_ADMIN`
- **createdAt** (timestamp): Текущая дата/время
- **updatedAt** (timestamp): Текущая дата/время

### Как получить хеш пароля:

**Вариант 1: Через Node.js (локально)**
```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash))"
```

**Вариант 2: Через скрипт**
```bash
cd backend
npx ts-node -e "import('./src/utils/password').then(m => m.hashPassword('admin123').then(h => console.log(h)))"
```

**Пример хеша для пароля `admin123`:**
```
$2a$10$b/ZJ6Rt1FxTSzx8PJPJviuH4OFxejWrFd/X59wjtaRBAMhiRQBv8K
```

---

## Способ 3: Через регистрацию + обновление роли

1. Зарегистрируйтесь через обычную регистрацию (станет CUSTOMER)
2. Затем через Firebase Console измените поле `role` на `SUPER_ADMIN`

---

## Демо данные (по умолчанию)

Если запустить скрипт без параметров, создастся супер-админ с данными:

- **Email:** `admin@demo.com`
- **Пароль:** `admin123`
- **Имя:** `Demo Super Admin`
- **Телефон:** `+7 (999) 000-00-00`
- **Роль:** `SUPER_ADMIN`

**⚠️ ВАЖНО:** После первого входа смените пароль через админ-панель!

---

## Проверка

После создания супер-админа:

1. Откройте сайт
2. Нажмите **"Войти"**
3. Введите email и пароль
4. После входа вы должны увидеть кнопку для перехода в админ-панель

---

## Устранение проблем

### Ошибка: "Firestore is not initialized"

**Решение:** Убедитесь, что переменные окружения Firebase установлены:
- `FIREBASE_SERVICE_ACCOUNT` (JSON строка)
- Или `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

### Ошибка: "User already exists"

**Решение:** Супер-админ с таким email уже существует. Используйте другой email или обновите существующего пользователя.

### Ошибка при запуске скрипта

**Решение:** Убедитесь, что:
1. Вы находитесь в папке `backend`
2. Установлены все зависимости: `npm install`
3. Firebase правильно настроен

---

## Безопасность

1. **Используйте сильный пароль** для production
2. **Не делитесь учетными данными**
3. **Смените пароль** после первого входа
4. **Ограничьте доступ** к Firebase Console

