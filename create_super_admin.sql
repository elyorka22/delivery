-- Создание супер-админа с демо данными
-- Email: admin@demo.com
-- Пароль: admin123
-- Имя: Demo Super Admin
-- Телефон: +7 (999) 000-00-00

-- Хеш пароля для 'admin123':
-- $2a$10$b/ZJ6Rt1FxTSzx8PJPJviuH4OFxejWrFd/X59wjtaRBAMhiRQBv8K

INSERT INTO "User" (email, password, name, phone, role, "createdAt", "updatedAt")
VALUES (
  'admin@demo.com',
  '$2a$10$b/ZJ6Rt1FxTSzx8PJPJviuH4OFxejWrFd/X59wjtaRBAMhiRQBv8K',
  'Demo Super Admin',
  '+7 (999) 000-00-00',
  'SUPER_ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
  role = 'SUPER_ADMIN',
  password = '$2a$10$b/ZJ6Rt1FxTSzx8PJPJviuH4OFxejWrFd/X59wjtaRBAMhiRQBv8K',
  name = 'Demo Super Admin',
  phone = '+7 (999) 000-00-00',
  "updatedAt" = NOW();

