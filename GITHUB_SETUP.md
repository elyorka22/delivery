# Подключение к GitHub - Пошаговая инструкция

## Шаг 1: Проверка и подготовка

### 1.1. Убедитесь, что Git установлен

Откройте терминал и выполните:
```bash
git --version
```

Если Git не установлен, установите его:
- **macOS:** `brew install git` или скачайте с https://git-scm.com
- **Windows:** Скачайте с https://git-scm.com/download/win

### 1.2. Проверьте текущую директорию

```bash
cd /Users/admin/fooddelivery
pwd
```

Должно показать: `/Users/admin/fooddelivery`

---

## Шаг 2: Инициализация Git репозитория

### 2.1. Инициализируйте Git

```bash
git init
```

Вы увидите: `Initialized empty Git repository in /Users/admin/fooddelivery/.git`

### 2.2. Проверьте статус

```bash
git status
```

Вы увидите список всех файлов, которые еще не добавлены в Git.

---

## Шаг 3: Настройка .gitignore

### 3.1. Проверьте .gitignore

Убедитесь, что `.gitignore` содержит:
```
node_modules/
dist/
build/
.env
.env.local
.DS_Store
*.log
uploads/
```

Это важно, чтобы не загружать в GitHub:
- Зависимости (node_modules)
- Собранные файлы (dist, build)
- Секретные данные (.env)
- Загруженные файлы (uploads)

### 3.2. Если нужно, обновите .gitignore

Файл `.gitignore` уже создан и содержит нужные правила ✅

---

## Шаг 4: Добавление файлов в Git

### 4.1. Добавьте все файлы

```bash
git add .
```

Это добавит все файлы проекта в staging area (кроме тех, что в .gitignore).

### 4.2. Проверьте, что добавлено

```bash
git status
```

Вы должны увидеть список файлов, готовых к коммиту (зеленым цветом).

---

## Шаг 5: Первый коммит

### 5.1. Создайте первый коммит

```bash
git commit -m "Initial commit: Food delivery app ready for deployment"
```

Вы увидите сообщение о том, сколько файлов добавлено.

### 5.2. Проверьте историю

```bash
git log --oneline
```

Должен показать ваш первый коммит.

---

## Шаг 6: Создание репозитория на GitHub

### 6.1. Зайдите на GitHub

1. Откройте https://github.com в браузере
2. Войдите в свой аккаунт (или создайте новый, если нет)

### 6.2. Создайте новый репозиторий

1. Нажмите на **"+"** в правом верхнем углу
2. Выберите **"New repository"**

### 6.3. Заполните форму

- **Repository name:** `fooddelivery` (или любое другое имя)
- **Description:** `Food delivery app with admin panels` (опционально)
- **Visibility:** 
  - ✅ **Public** - если хотите, чтобы код был открытым
  - ✅ **Private** - если хотите, чтобы код был приватным (рекомендуется)
- **НЕ** ставьте галочки на:
  - ❌ "Add a README file" (у нас уже есть README)
  - ❌ "Add .gitignore" (у нас уже есть .gitignore)
  - ❌ "Choose a license" (можно добавить позже)

### 6.4. Создайте репозиторий

Нажмите кнопку **"Create repository"**

---

## Шаг 7: Подключение локального репозитория к GitHub

### 7.1. Скопируйте URL репозитория

После создания репозитория GitHub покажет страницу с инструкциями.

Найдите секцию **"...or push an existing repository from the command line"**

Скопируйте URL. Он будет выглядеть так:
- **HTTPS:** `https://github.com/ваш-username/fooddelivery.git`
- **SSH:** `git@github.com:ваш-username/fooddelivery.git`

**Рекомендуется использовать HTTPS** (проще для начала).

### 7.2. Добавьте remote репозиторий

В терминале выполните (замените URL на ваш):

```bash
git remote add origin https://github.com/ваш-username/fooddelivery.git
```

**Важно:** Замените `ваш-username` на ваш реальный username на GitHub!

### 7.3. Проверьте, что remote добавлен

```bash
git remote -v
```

Должно показать:
```
origin  https://github.com/ваш-username/fooddelivery.git (fetch)
origin  https://github.com/ваш-username/fooddelivery.git (push)
```

---

## Шаг 8: Переименование ветки (опционально, но рекомендуется)

### 8.1. Переименуйте ветку в main

```bash
git branch -M main
```

Это переименует текущую ветку в `main` (современный стандарт GitHub).

---

## Шаг 9: Отправка кода на GitHub

### 9.1. Отправьте код

```bash
git push -u origin main
```

**Если это первый раз:**
- GitHub может попросить авторизацию
- Введите ваш username и password
- **Важно:** Если у вас включена двухфакторная аутентификация, нужно использовать Personal Access Token вместо пароля

### 9.2. Создание Personal Access Token (если нужно)

Если GitHub просит токен вместо пароля:

1. Зайдите на GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Нажмите "Generate new token (classic)"
3. Название: `fooddelivery-deploy`
4. Выберите срок действия (например, 90 дней)
5. Выберите права доступа:
   - ✅ `repo` (полный доступ к репозиториям)
6. Нажмите "Generate token"
7. **ВАЖНО:** Скопируйте токен сразу (он показывается только один раз!)
8. Используйте этот токен вместо пароля при `git push`

### 9.3. Проверьте результат

После успешного `git push`:
1. Обновите страницу репозитория на GitHub
2. Вы должны увидеть все ваши файлы!

---

## Шаг 10: Проверка

### 10.1. Проверьте на GitHub

1. Откройте ваш репозиторий на GitHub
2. Убедитесь, что все файлы загружены
3. Проверьте, что `.env` файлы **НЕ** видны (они должны быть в .gitignore)

### 10.2. Проверьте локально

```bash
git status
```

Должно показать: `Your branch is up to date with 'origin/main'`

---

## ✅ Готово!

Теперь ваш код в GitHub и готов к деплою!

---

## Следующие шаги

После успешной загрузки кода в GitHub:

1. **Деплой Backend на Railway:**
   - См. `RAILWAY_DEPLOY.md`
   - Railway подключится к вашему GitHub репозиторию

2. **Деплой Frontend на Vercel:**
   - См. `VERCEL_DEPLOY.md`
   - Vercel подключится к вашему GitHub репозиторию

---

## Troubleshooting

### Проблема: "fatal: not a git repository"

**Решение:** Вы не в правильной директории. Выполните:
```bash
cd /Users/admin/fooddelivery
git init
```

### Проблема: "remote origin already exists"

**Решение:** Удалите старый remote и добавьте заново:
```bash
git remote remove origin
git remote add origin https://github.com/ваш-username/fooddelivery.git
```

### Проблема: "Permission denied" при push

**Решение:** 
1. Проверьте, что URL правильный
2. Используйте Personal Access Token вместо пароля
3. Убедитесь, что у вас есть права на репозиторий

### Проблема: "Authentication failed"

**Решение:**
1. Создайте Personal Access Token (см. Шаг 9.2)
2. Используйте токен вместо пароля
3. Или настройте SSH ключи (более сложно)

---

## Полезные команды Git

```bash
# Проверить статус
git status

# Посмотреть историю коммитов
git log --oneline

# Посмотреть изменения в файлах
git diff

# Добавить конкретный файл
git add filename.txt

# Создать коммит
git commit -m "Описание изменений"

# Отправить изменения на GitHub
git push

# Получить изменения с GitHub
git pull

# Посмотреть все ветки
git branch

# Создать новую ветку
git branch feature-name

# Переключиться на ветку
git checkout feature-name
```

---

## Безопасность

⚠️ **ВАЖНО:** Никогда не загружайте в GitHub:
- Файлы `.env` с секретными данными
- Пароли и токены
- Личные ключи

Все это должно быть в `.gitignore` ✅

