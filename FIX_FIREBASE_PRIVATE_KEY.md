# Исправление ошибки DECODER routines::unsupported

## Проблема

Ошибка `DECODER routines::unsupported` означает, что `FIREBASE_PRIVATE_KEY` неправильно отформатирован. Railway может экранировать символы по-разному.

## Решение 1: Использовать JSON формат (РЕКОМЕНДУЕТСЯ)

Вместо отдельных переменных используйте одну переменную `FIREBASE_SERVICE_ACCOUNT` с полным JSON.

### Шаги:

1. Откройте ваш `serviceAccountKey.json` файл
2. Скопируйте **ВЕСЬ** JSON (все поля)
3. Преобразуйте в одну строку:
   - Используйте: https://www.jsonformatter.org/json-minify
   - Или удалите все переносы строк вручную
4. В Railway:
   - **Удалите** переменные: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - **Добавьте** переменную: `FIREBASE_SERVICE_ACCOUNT`
   - **Вставьте** весь JSON как одну строку (без переносов)

### Пример формата:

```json
{"type":"service_account","project_id":"delivery-34a6e","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDsWcHGFhkmJDnh\n...много строк...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

**Важно:** Должно быть ~2000+ символов!

---

## Решение 2: Исправить FIREBASE_PRIVATE_KEY

Если хотите использовать отдельные переменные:

### Проблема:
Railway может экранировать `\n` по-разному. Нужно скопировать private key с **реальными переносами строк**.

### Шаги:

1. Откройте `serviceAccountKey.json` в текстовом редакторе
2. Найдите поле `"private_key"`
3. Скопируйте **ВСЁ значение** (от `-----BEGIN PRIVATE KEY-----` до `-----END PRIVATE KEY-----`)
4. **Важно:** При копировании должны быть реальные переносы строк, а не строка `\n`

### Проверка:

После вставки в Railway, проверьте логи. Должно быть:
- `ℹ️ Private key length: 1600+ characters`
- `ℹ️ Private key has 30+ newlines`

Если newlines меньше 20, значит private key скопирован неправильно.

---

## Решение 3: Использовать base64 (альтернатива)

Если проблемы продолжаются, можно закодировать private key в base64:

1. Закодируйте private key в base64
2. Сохраните в `FIREBASE_PRIVATE_KEY_BASE64`
3. В коде декодируйте обратно

Но это сложнее, лучше использовать Решение 1 (JSON формат).

---

## Проверка после исправления

После изменения переменных, Railway перезапустит сервер. Проверьте логи:

✅ **Успех:**
```
✅ Firebase Admin initialized
```

❌ **Ошибка:**
```
❌ Failed to create certificate from private key
```

Если ошибка осталась, используйте Решение 1 (JSON формат) - это самый надежный способ.

