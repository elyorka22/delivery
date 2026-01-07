import { PrismaClient } from '@prisma/client';

// Prisma is still required until all controllers are migrated to Firebase
// After migration, this file can be removed
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
let retryCount = 0;
const MAX_RETRIES = 3;

async function testConnection() {
  if (connectionTested) return;
  
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to database');
    connectionTested = true;
  } catch (error: any) {
    retryCount++;
    
    if (retryCount <= MAX_RETRIES) {
      console.error(`❌ Prisma connection error (attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
      console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET');
      
      if (retryCount < MAX_RETRIES) {
        console.log('⏳ Retrying connection in 5 seconds...');
        setTimeout(() => {
          testConnection();
        }, 5000);
      } else {
        console.error('❌ Max retries reached. Please check DATABASE_URL.');
        console.warn('💡 Note: Migrating to Firebase. DATABASE_URL will be optional after migration.');
      }
    }
  }
}

// Test connection after a short delay to allow Railway to initialize
setTimeout(() => {
  testConnection();
}, 2000);

export default prisma;


