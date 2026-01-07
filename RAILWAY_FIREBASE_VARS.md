# Настройка Firebase в Railway

## Переменные окружения для Railway

### Вариант 1: JSON строка (РЕКОМЕНДУЕТСЯ)

1. Зайдите на **https://railway.app**
2. Откройте проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Добавьте новую переменную:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT`
   - **Value**: Вставьте весь JSON объект как одну строку:

```json
{"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

**Пример:** Скопируйте весь JSON из вашего `serviceAccountKey.json` файла и вставьте как одну строку.

**Важно:** Вставьте весь JSON как одну строку, без переносов строк!

---

### Вариант 2: Отдельные переменные

Если Вариант 1 не работает, используйте отдельные переменные:

1. `FIREBASE_PROJECT_ID` = `your-project-id`
2. `FIREBASE_CLIENT_EMAIL` = `your-service-account@your-project.iam.gserviceaccount.com`
3. `FIREBASE_PRIVATE_KEY` = Вставьте private_key (со всеми `\n`)

---

## Для локальной разработки

Создайте файл `backend/.env`:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

Или сохраните JSON файл и укажите путь:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

---

## Проверка

После добавления переменных:
1. Railway автоматически перезапустит сервер
2. Проверьте логи - должно быть: `✅ Firebase Admin initialized`
3. Если ошибка - проверьте формат JSON

---

## Готово! ✅

После настройки переменных сообщите мне, и я продолжу миграцию на Firebase.


