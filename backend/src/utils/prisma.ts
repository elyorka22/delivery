import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Lazy connection - connect on first query instead of immediately
// This helps with Railway's network initialization timing
let connectionTested = false;

async function testConnection() {
  if (connectionTested) return;
  
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to database');
    connectionTested = true;
  } catch (error: any) {
    console.error('❌ Prisma connection error:', error.message);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET');
    
    // Retry after 5 seconds
    if (!connectionTested) {
      console.log('⏳ Retrying connection in 5 seconds...');
      setTimeout(() => {
        testConnection();
      }, 5000);
    }
  }
}

// Test connection after a short delay to allow Railway to initialize
setTimeout(() => {
  testConnection();
}, 2000);

export default prisma;


