import { hashPassword } from '../utils/password';
import { getUserByEmail, createUser, updateUser } from '../utils/firestore-helpers';

/**
 * Скрипт для создания супер-админа в Firestore
 * 
 * Использование:
 * 1. Локально: npx ts-node src/scripts/createSuperAdmin.ts
 * 2. Или через npm: npm run create-admin
 * 
 * Можно передать параметры через переменные окружения:
 * - ADMIN_EMAIL (по умолчанию: admin@demo.com)
 * - ADMIN_PASSWORD (по умолчанию: admin123)
 * - ADMIN_NAME (по умолчанию: Demo Super Admin)
 * - ADMIN_PHONE (по умолчанию: +7 (999) 000-00-00)
 */

async function createSuperAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@demo.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Demo Super Admin';
    const phone = process.env.ADMIN_PHONE || '+7 (999) 000-00-00';

    console.log('🔐 Создание супер-админа в Firestore...');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Имя: ${name}`);
    console.log(`📱 Телефон: ${phone}`);

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      if (existingUser.role === 'SUPER_ADMIN') {
        console.log('⚠️  Супер-админ с таким email уже существует!');
        console.log(`   Email: ${existingUser.email}`);
        console.log(`   Имя: ${existingUser.name}`);
        console.log(`   Роль: ${existingUser.role}`);
        console.log(`   ID: ${existingUser.id}`);
        return;
      } else {
        // Обновляем роль существующего пользователя
        const hashedPassword = await hashPassword(password);
        const updatedUser = await updateUser(existingUser.id, {
          role: 'SUPER_ADMIN',
          password: hashedPassword,
          name,
          phone,
        });
        console.log('✅ Существующий пользователь обновлен до супер-админа!');
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Пароль: ${password}`);
        console.log(`   ID: ${updatedUser.id}`);
        return;
      }
    }

    // Создаем нового супер-админа
    const hashedPassword = await hashPassword(password);
    const superAdmin = await createUser({
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'SUPER_ADMIN',
    });

    console.log('\n✅ Супер-админ успешно создан в Firestore!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${superAdmin.email}`);
    console.log(`🔑 Пароль:   ${password}`);
    console.log(`👤 Имя:      ${superAdmin.name}`);
    console.log(`📱 Телефон:  ${superAdmin.phone}`);
    console.log(`🎭 Роль:     ${superAdmin.role}`);
    console.log(`🆔 ID:       ${superAdmin.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Теперь вы можете войти в админ-панель:');
    console.log(`   URL: /admin`);
    console.log(`   Email: ${email}`);
    console.log(`   Пароль: ${password}`);
  } catch (error: any) {
    console.error('❌ Ошибка при создании супер-админа:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
    });
    process.exit(1);
  }
}

createSuperAdmin();


