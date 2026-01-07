# Инструкции по настройке Firebase

## Шаг 1: Создать проект Firebase

1. Зайдите на **https://firebase.google.com**
2. Нажмите **"Get started"** или **"Go to console"**
3. Нажмите **"Add project"** или **"Create a project"**
4. Введите название проекта (например: `food-delivery`)
5. Нажмите **"Continue"**
6. (Опционально) Отключите Google Analytics, если не нужен
7. Нажмите **"Create project"**
8. Дождитесь создания проекта (1-2 минуты)

---

## Шаг 2: Включить Firestore Database

1. В Firebase Console выберите ваш проект
2. В левом меню найдите **"Firestore Database"** (или **"Build"** → **"Firestore Database"**)
3. Нажмите **"Create database"**
4. Выберите режим:
   - **Production mode** (рекомендуется для начала)
   - Или **Test mode** (для разработки, но менее безопасно)
5. Выберите регион (например: `us-central` или ближайший к вам)
6. Нажмите **"Enable"**
7. Дождитесь создания базы данных (1-2 минуты)

---

## Шаг 3: Получить Service Account Credentials

1. В Firebase Console → **Project Settings** (шестеренка вверху)
2. Перейдите на вкладку **"Service accounts"**
3. Нажмите **"Generate new private key"**
4. Подтвердите действие
5. JSON файл автоматически скачается

**Важно:** Сохраните этот файл в безопасном месте! Он содержит секретные ключи.

---

## Шаг 4: Настроить переменные окружения

### Для локальной разработки:

Создайте файл `backend/.env` и добавьте:

```env
# Firebase credentials (один из вариантов)

# Вариант 1: Путь к JSON файлу
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json

# Или Вариант 2: JSON строка (для Railway)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Или Вариант 3: Отдельные переменные
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Для Railway:

1. Railway → проект → сервис (backend)
2. **Settings** → **Variables**
3. Добавьте переменную `FIREBASE_SERVICE_ACCOUNT`
4. Вставьте **весь JSON файл** как значение (одной строкой)
5. Или используйте отдельные переменные:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

---

## Шаг 5: Проверить подключение

После настройки я помогу проверить подключение и начать миграцию данных.

---

## Готово! ✅

После выполнения этих шагов сообщите мне, и я продолжу настройку Firebase в коде.

