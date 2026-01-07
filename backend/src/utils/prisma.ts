import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma connected to database');
  })
  .catch((error) => {
    console.error('❌ Prisma connection error:', error);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
  });

export default prisma;


