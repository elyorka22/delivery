import prisma from '../utils/prisma';
import { hashPassword } from '../utils/password';

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    // Создаем супер-админа
    const superAdmin = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: await hashPassword('admin123'),
        name: 'Супер Админ',
        phone: '+7 (999) 111-11-11',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ Super Admin created:', superAdmin.email, 'Password: admin123');

    // Создаем менеджера
    const manager = await prisma.user.upsert({
      where: { email: 'manager@test.com' },
      update: {},
      create: {
        email: 'manager@test.com',
        password: await hashPassword('manager123'),
        name: 'Менеджер Ресторана',
        phone: '+7 (999) 222-22-22',
        role: 'MANAGER',
      },
    });
    console.log('✅ Manager created:', manager.email, 'Password: manager123');

    // Создаем ресторан для менеджера
    const restaurant = await prisma.restaurant.upsert({
      where: { managerId: manager.id },
      update: {},
      create: {
        name: 'Тестовый Ресторан',
        description: 'Лучший ресторан в городе',
        address: 'ул. Тестовая, 1',
        phone: '+7 (999) 333-33-33',
        managerId: manager.id,
        isActive: true,
      },
    });
    console.log('✅ Restaurant created:', restaurant.name);

    // Создаем повара
    const cook = await prisma.user.upsert({
      where: { email: 'cook@test.com' },
      update: {},
      create: {
        email: 'cook@test.com',
        password: await hashPassword('cook123'),
        name: 'Повар Иван',
        phone: '+7 (999) 444-44-44',
        role: 'COOK',
      },
    });
    console.log('✅ Cook created:', cook.email, 'Password: cook123');

    // Создаем курьера
    const courier = await prisma.user.upsert({
      where: { email: 'courier@test.com' },
      update: {},
      create: {
        email: 'courier@test.com',
        password: await hashPassword('courier123'),
        name: 'Курьер Петр',
        phone: '+7 (999) 555-55-55',
        role: 'COURIER',
      },
    });
    console.log('✅ Courier created:', courier.email, 'Password: courier123');

    // Создаем обычного пользователя
    const customer = await prisma.user.upsert({
      where: { email: 'customer@test.com' },
      update: {},
      create: {
        email: 'customer@test.com',
        password: await hashPassword('customer123'),
        name: 'Обычный Клиент',
        phone: '+7 (999) 666-66-66',
        role: 'CUSTOMER',
      },
    });
    console.log('✅ Customer created:', customer.email, 'Password: customer123');

    // Добавляем несколько блюд в ресторан
    const menuItems = [
      {
        name: 'Пицца Маргарита',
        description: 'Классическая пицца с томатами и моцареллой',
        price: 599,
        category: 'Пицца',
        restaurantId: restaurant.id,
        isAvailable: true,
      },
      {
        name: 'Бургер Классик',
        description: 'Сочный бургер с говядиной',
        price: 499,
        category: 'Бургеры',
        restaurantId: restaurant.id,
        isAvailable: true,
      },
      {
        name: 'Салат Цезарь',
        description: 'Свежий салат с курицей',
        price: 349,
        category: 'Салаты',
        restaurantId: restaurant.id,
        isAvailable: true,
      },
    ];

    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: item,
      });
    }
    console.log('✅ Menu items created');

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin: admin@test.com / admin123');
    console.log('Manager:    manager@test.com / manager123');
    console.log('Cook:       cook@test.com / cook123');
    console.log('Courier:    courier@test.com / courier123');
    console.log('Customer:   customer@test.com / customer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();

