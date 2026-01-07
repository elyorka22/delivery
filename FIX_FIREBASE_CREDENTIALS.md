# Исправление ошибки Firebase credentials

## Проблема

Ошибка: `Failed to parse private key: Error: Invalid PEM formatted message`

Причина: `FIREBASE_SERVICE_ACCOUNT` слишком короткий (331 символ вместо ~2000+). Это означает, что был скопирован не весь JSON.

## Решение

### Шаг 1: Получите полный JSON файл

1. Откройте Firebase Console: https://console.firebase.google.com
2. Выберите проект `delivery-34a6e`
3. Перейдите в **Project Settings** (⚙️) → **Service accounts**
4. Нажмите **"Generate new private key"** (если еще не скачали)
5. Скачайте JSON файл (например, `delivery-34a6e-firebase-adminsdk-xxxxx.json`)

### Шаг 2: Откройте JSON файл

Откройте скачанный файл в текстовом редакторе. Он должен выглядеть примерно так:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n...много строк...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

**Важно:** Файл должен содержать ВСЕ поля, особенно длинный `private_key` (начинается с `-----BEGIN PRIVATE KEY-----`).

### Шаг 3: Преобразуйте в одну строку

Нужно преобразовать многострочный JSON в одну строку. Есть несколько способов:

#### Способ 1: Использовать онлайн-инструмент

1. Откройте https://www.jsonformatter.org/json-minify
2. Вставьте весь JSON из файла
3. Нажмите "Minify"
4. Скопируйте результат (одна строка)

#### Способ 2: Использовать команду (если есть доступ к терминалу)

```bash
cat delivery-34a6e-firebase-adminsdk-xxxxx.json | jq -c .
```

Или просто удалите все переносы строк вручную в текстовом редакторе.

### Шаг 4: Добавьте в Railway

1. Откройте Railway: https://railway.app
2. Выберите проект → сервис (backend)
3. Перейдите в **Settings** → **Variables**
4. Найдите переменную `FIREBASE_SERVICE_ACCOUNT`
5. Нажмите на неё для редактирования
6. **Удалите старое значение** (331 символ)
7. **Вставьте полный JSON как одну строку** (должно быть ~2000+ символов)
8. Нажмите **Save**

### Шаг 5: Проверьте

После сохранения Railway автоматически перезапустит сервер. Проверьте логи - должно появиться:

```
✅ Firebase Admin initialized
```

Если ошибка осталась, проверьте:
- Длина `FIREBASE_SERVICE_ACCOUNT` должна быть ~2000+ символов
- JSON должен быть валидным (можно проверить на jsonlint.com)
- `private_key` должен содержать `-----BEGIN PRIVATE KEY-----` и `-----END PRIVATE KEY-----`

---

## Альтернативный способ: Использовать отдельные переменные

Если JSON не работает, можно использовать отдельные переменные:

1. `FIREBASE_PROJECT_ID` = `your-project-id`
2. `FIREBASE_CLIENT_EMAIL` = `your-service-account@your-project.iam.gserviceaccount.com`
3. `FIREBASE_PRIVATE_KEY` = Вставьте значение `private_key` из JSON (со всеми `\n`)

**Важно для FIREBASE_PRIVATE_KEY:**
- Скопируйте весь `private_key` из JSON (от `-----BEGIN PRIVATE KEY-----` до `-----END PRIVATE KEY-----`)
- Сохраните все `\n` как есть (не удаляйте их)

---

## Проверка через диагностику

После добавления credentials, откройте:
```
https://your-railway-url.up.railway.app/api/diagnose
```

Должно показать:
```json
{
  "firebase_status": "✅ Initialized",
  "firebase_connection": "✅ Connected"
}
```

