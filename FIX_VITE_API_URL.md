# Исправление VITE_API_URL

## Проблема
В `VITE_API_URL` отсутствует протокол `https://`

**Текущее значение (неправильно):**
```
delivery-production-1860.up.railway.app/api
```

**Правильное значение:**
```
https://delivery-production-1860.up.railway.app/api
```

---

## Как исправить

### В Vercel:

1. Зайдите на https://vercel.com
2. Откройте ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите переменную `VITE_API_URL`
5. Нажмите на нее для редактирования
6. Измените значение на:
   ```
   https://delivery-production-1860.up.railway.app/api
   ```
7. Нажмите **Save**
8. Vercel автоматически пересоберет проект

---

## Важно

- ✅ Обязательно добавьте `https://` в начало
- ✅ URL должен быть полным: `https://domain.com/api`
- ✅ Без слеша в конце после `/api`

---

## После исправления

1. Дождитесь пересборки проекта в Vercel (1-2 минуты)
2. Обновите страницу в браузере (Ctrl+F5 или Cmd+Shift+R)
3. Попробуйте войти снова

---

## Проверка

После исправления откройте DevTools (F12) → Console и введите:

```javascript
console.log(import.meta.env.VITE_API_URL)
```

Должно показать:
```
https://delivery-production-1860.up.railway.app/api
```

Если показывает без `https://` - значит переменная еще не обновилась, подождите пересборки.


