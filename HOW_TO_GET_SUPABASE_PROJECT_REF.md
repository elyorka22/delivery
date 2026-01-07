# Как получить PROJECT-REF из Supabase

## Что такое PROJECT-REF?

**PROJECT-REF** (или **Project Reference**) — это уникальный идентификатор вашего Supabase проекта. Он используется в URL базы данных.

**Пример:**
```
db.gykgvdssaaloinxkqwtz.supabase.co
         ↑
    Это PROJECT-REF
```

В данном случае `PROJECT-REF` = `gykgvdssaaloinxkqwtz`

---

## Как получить PROJECT-REF?

### Способ 1: Из Connection String (самый простой)

1. Зайдите на https://supabase.com
2. Войдите в свой аккаунт
3. Откройте ваш проект
4. Перейдите в **Settings** → **Database**
5. Прокрутите вниз до секции **"Connection string"**
6. Выберите вкладку **"URI"**
7. Вы увидите строку вида:

```
postgresql://postgres:[YOUR-PASSWORD]@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

**PROJECT-REF** находится между `db.` и `.supabase.co`:
- `db.` ← начало
- `gykgvdssaaloinxkqwtz` ← **это PROJECT-REF**
- `.supabase.co` ← конец

В этом примере **PROJECT-REF = `gykgvdssaaloinxkqwtz`**

---

### Способ 2: Из URL проекта

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Посмотрите на URL в адресной строке браузера

URL будет выглядеть так:
```
https://supabase.com/dashboard/project/gykgvdssaaloinxkqwtz
```

**PROJECT-REF** — это последняя часть URL после `/project/`:
- `gykgvdssaaloinxkqwtz` ← **это PROJECT-REF**

---

### Способ 3: Из Settings → General

1. Зайдите на https://supabase.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **General**
4. Найдите секцию **"Reference ID"** или **"Project ID"**
5. Скопируйте значение

---

## Примеры

### Пример 1:
**Connection String:**
```
postgresql://postgres:password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**PROJECT-REF:** `abcdefghijklmnop`

### Пример 2:
**Connection String:**
```
postgresql://postgres:password@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

**PROJECT-REF:** `gykgvdssaaloinxkqwtz`

---

## Важно!

1. **PROJECT-REF уникален** для каждого проекта
2. **Не путайте с Project Name** — это разные вещи
3. **PROJECT-REF используется в URL базы данных** — это технический идентификатор

---

## Как использовать в DATABASE_URL?

Когда вы копируете Connection String из Supabase, **PROJECT-REF уже включен** в строку!

Вам НЕ нужно его отдельно искать или заменять — просто скопируйте всю строку из Supabase.

**Пример полного DATABASE_URL:**
```
postgresql://postgres:MyPassword123@db.gykgvdssaaloinxkqwtz.supabase.co:5432/postgres
```

Где:
- `postgres` — пользователь
- `MyPassword123` — пароль (может потребоваться URL-encode)
- `gykgvdssaaloinxkqwtz` — PROJECT-REF (уже включен)
- `5432` — порт
- `postgres` — имя базы данных

---

## Если у вас уже есть Connection String

Если Supabase уже дал вам Connection String, то **PROJECT-REF уже там есть** — просто скопируйте всю строку и используйте как `DATABASE_URL` в Railway.

**Вам не нужно ничего заменять!**

---

## Troubleshooting

### Проблема: Не могу найти PROJECT-REF

**Решение:**
1. Убедитесь, что вы в правильном проекте Supabase
2. Перейдите в **Settings** → **Database** → **Connection string** → **URI**
3. Скопируйте всю строку — PROJECT-REF уже там

### Проблема: Connection String не работает

**Решение:**
1. Проверьте, что пароль правильно URL-encoded (если есть специальные символы)
2. Убедитесь, что используете правильный Connection String из Supabase
3. Проверьте, что проект Supabase активен

---

## Готово! ✅

Теперь вы знаете, что такое PROJECT-REF и как его найти. Но на самом деле, **вам не нужно его искать отдельно** — просто скопируйте Connection String из Supabase, и всё готово!


