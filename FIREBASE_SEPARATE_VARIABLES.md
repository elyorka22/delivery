# Настройка Firebase через отдельные переменные (РЕКОМЕНДУЕТСЯ)

## Проблема с JSON

При копировании полного JSON в Railway `private_key` обрезается. Используйте отдельные переменные - это надежнее.

## Шаг 1: Откройте JSON файл

Откройте файл `serviceAccountKey.json` из Firebase в текстовом редакторе.

## Шаг 2: Найдите нужные значения

В JSON файле найдите эти три значения:

1. **project_id** - строка вида `"delivery-34a6e"`
2. **client_email** - строка вида `"firebase-adminsdk-xxxxx@delivery-34a6e.iam.gserviceaccount.com"`
3. **private_key** - **ОЧЕНЬ ДЛИННАЯ** строка, начинается с `"-----BEGIN PRIVATE KEY-----\n"` и заканчивается `"\n-----END PRIVATE KEY-----\n"`

## Шаг 3: Добавьте переменные в Railway

В Railway (Settings → Variables) добавьте **три отдельные переменные**:

### Переменная 1: FIREBASE_PROJECT_ID

- **Name**: `FIREBASE_PROJECT_ID`
- **Value**: Скопируйте значение `project_id` из JSON (без кавычек)
  - Пример: `delivery-34a6e`

### Переменная 2: FIREBASE_CLIENT_EMAIL

- **Name**: `FIREBASE_CLIENT_EMAIL`
- **Value**: Скопируйте значение `client_email` из JSON (без кавычек)
  - Пример: `firebase-adminsdk-fbsvc@delivery-34a6e.iam.gserviceaccount.com`

### Переменная 3: FIREBASE_PRIVATE_KEY

- **Name**: `FIREBASE_PRIVATE_KEY`
- **Value**: Скопируйте **ВЕСЬ** `private_key` из JSON

**КРИТИЧЕСКИ ВАЖНО для FIREBASE_PRIVATE_KEY:**

1. В JSON файле найдите строку с `"private_key":`
2. Скопируйте **ВСЁ значение** от `-----BEGIN PRIVATE KEY-----` до `-----END PRIVATE KEY-----`
3. **Включите все `\n`** (не удаляйте их!)
4. Должно быть примерно **1600+ символов**
5. Пример правильного формата:
   ```
   -----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDsWcHGFhkmJDnh\nJIDvLPRXX52AHQYQUFiHcMQkONGSo3Mlh4jSxsHeWy//QqBtuoImzSH+7oGu0y9d\n...много строк...\n-----END PRIVATE KEY-----\n
   ```

## Шаг 4: Удалите старую переменную (если есть)

Если у вас есть `FIREBASE_SERVICE_ACCOUNT` - **удалите её**, чтобы не было конфликта.

## Шаг 5: Проверьте результат

После сохранения Railway перезапустит сервер. В логах должно появиться:

```
✅ Firebase Admin initialized
```

## Проверка через диагностику

Откройте:
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

---

## Пример значений (для справки)

**НЕ КОПИРУЙТЕ ЭТИ ПРИМЕРЫ** - используйте свои значения из JSON файла!

```
FIREBASE_PROJECT_ID = delivery-34a6e
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@delivery-34a6e.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDsWcHGFhkmJDnh\n...много строк...\n-----END PRIVATE KEY-----\n
```

---

## Почему это лучше?

1. ✅ Не нужно преобразовывать JSON в одну строку
2. ✅ `private_key` не обрезается при вставке
3. ✅ Легче проверить каждое значение отдельно
4. ✅ Меньше вероятность ошибок

---

## Если всё ещё не работает

1. Проверьте длину `FIREBASE_PRIVATE_KEY` - должно быть 1600+ символов
2. Убедитесь, что `private_key` начинается с `-----BEGIN PRIVATE KEY-----`
3. Убедитесь, что `private_key` заканчивается `-----END PRIVATE KEY-----`
4. Проверьте, что все `\n` сохранены (не удалены)

