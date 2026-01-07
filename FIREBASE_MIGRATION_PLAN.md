# План миграции на Firebase Firestore

## Статус: ✅ Firebase подключен

Firebase Admin SDK успешно инициализирован. Начинаем миграцию контроллеров.

## Структура данных в Firestore

### Коллекции (Collections):

1. **users** - пользователи
2. **restaurants** - рестораны
3. **menuItems** - блюда меню
4. **orders** - заказы
5. **orderItems** - элементы заказа (подколлекция в orders)
6. **orderStatusHistory** - история статусов (подколлекция в orders)
7. **courierLocations** - местоположения курьеров

## Порядок миграции

### Этап 1: Базовые утилиты ✅
- [x] Firebase Admin SDK установлен
- [x] Firebase инициализирован
- [ ] Создать утилиты для работы с Firestore (helpers)

### Этап 2: Аутентификация (Приоритет 1)
- [ ] `authController.ts` - register, login, getMe
- [ ] `userController.ts` - updateProfile

### Этап 3: Рестораны (Приоритет 2)
- [ ] `restaurantController.ts` - getRestaurants, getRestaurant
- [ ] `adminController.ts` - getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant

### Этап 4: Меню (Приоритет 3)
- [ ] `managerController.ts` - работа с menuItems

### Этап 5: Заказы (Приоритет 4)
- [ ] `orderController.ts` - createOrder, getOrders, getOrder
- [ ] `courierController.ts` - getOrders, takeOrder, updateOrderStatus
- [ ] `cookController.ts` - getOrders, updateOrderStatus

### Этап 6: Админ панель (Приоритет 5)
- [ ] `adminController.ts` - getStats, getUsers, createManager

### Этап 7: Очистка
- [ ] Удалить Prisma зависимости
- [ ] Удалить `prisma/` директорию
- [ ] Удалить `DATABASE_URL` из Railway

## Важные отличия Firestore от SQL

1. **Нет JOIN** - нужно делать несколько запросов
2. **Нет транзакций для нескольких коллекций** - использовать batch writes
3. **Нет автоматических индексов** - нужно создавать вручную
4. **Типы данных** - Timestamp вместо DateTime
5. **ID генерация** - использовать `doc().id` или кастомные ID

## Следующий шаг

Начинаем с создания утилит для работы с Firestore и миграции `authController`.

