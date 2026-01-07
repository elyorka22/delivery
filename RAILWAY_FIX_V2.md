# Исправление ошибки Railway: "No such file or directory"

## Проблема

Ошибка:
```
/bin/bash: line 1: cd: backend: No such file or directory
```

## Причина

Когда Root Directory установлен на `backend` в настройках Railway, Railway **уже автоматически переходит** в папку `backend/` перед выполнением команд.

Поэтому команды в `railway.json` не должны содержать `cd backend &&`, так как мы уже находимся в этой папке.

## Решение

Я исправил `railway.json`:

**Было:**
```json
{
  "buildCommand": "cd backend && npm install && npm run build",
  "startCommand": "cd backend && npm start"
}
```

**Стало:**
```json
{
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm start"
}
```

## Как это работает

1. Railway устанавливает Root Directory = `backend`
2. Railway автоматически переходит в папку `backend/`
3. Выполняются команды из `railway.json`:
   - `npm install` (в папке `backend/`)
   - `npm run build` (в папке `backend/`)
   - `npm start` (в папке `backend/`)

## Проверка

После исправления Railway автоматически перезапустит деплой. Проверьте логи:

1. Откройте **Deployments** → последний деплой
2. Откройте **Logs**
3. Должны увидеть:
   ```
   Installing dependencies...
   Building...
   Server is running on port 5000
   ```

## Альтернатива: Удалить railway.json

Если проблемы продолжаются, можно:

1. Удалить `railway.json` из репозитория
2. Настроить все через UI Railway:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: (оставить пустым, Railway определит автоматически)

Railway автоматически определит Node.js проект и выполнит правильные команды.

## Следующие шаги

После успешного деплоя:
1. Проверьте, что сервер запустился
2. Получите URL backend
3. Добавьте переменные окружения (если еще не добавлены)
4. Задеплойте frontend на Vercel



