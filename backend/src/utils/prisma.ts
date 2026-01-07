import { PrismaClient } from '@prisma/client';

// Prisma is being phased out in favor of Firebase
// This is kept for backward compatibility during migration
let prisma: PrismaClient | null = null;

if (process.env.DATABASE_URL) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Lazy connection - connect on first query instead of immediately
  let connectionTested = false;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  async function testConnection() {
    if (connectionTested || !prisma) return;
    
    try {
      await prisma.$connect();
      console.log('✅ Prisma connected to database');
      connectionTested = true;
    } catch (error: any) {
      retryCount++;
      
      if (retryCount <= MAX_RETRIES) {
        console.error(`❌ Prisma connection error (attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
        
        if (retryCount < MAX_RETRIES) {
          console.log('⏳ Retrying connection in 5 seconds...');
          setTimeout(() => {
            testConnection();
          }, 5000);
        } else {
          console.error('❌ Max retries reached. Prisma will not be available.');
          console.warn('💡 Migrating to Firebase. DATABASE_URL is optional now.');
        }
      }
    }
  }

  // Test connection after a short delay to allow Railway to initialize
  setTimeout(() => {
    testConnection();
  }, 2000);
} else {
  console.log('ℹ️ DATABASE_URL not set. Using Firebase instead of Prisma.');
}

export default prisma;


