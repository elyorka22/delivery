import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './utils/socket';
import authRoutes from './routes/authRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import managerRoutes from './routes/managerRoutes';
import cookRoutes from './routes/cookRoutes';
import courierRoutes from './routes/courierRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Initialize Firebase (will log status on import)
import './utils/firebase';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

setIO(io);

const PORT = process.env.PORT || 5000;

// CORS configuration
// Support multiple frontend URLs (production, preview, etc.)
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
      return;
    }
    
    // Allow all Vercel domains (*.vercel.app)
    if (origin.includes('.vercel.app')) {
      callback(null, true);
      return;
    }
    
    // Allow exact match with FRONTEND_URL
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
      return;
    }
    
    // Default: allow if no FRONTEND_URL is set (development)
    if (!process.env.FRONTEND_URL) {
      callback(null, true);
      return;
    }
    
    // Otherwise reject
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы для загруженных изображений
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/cook', cookRoutes);
app.use('/api/courier', courierRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Diagnostic endpoint to test database connection
app.get('/api/diagnose', async (req, res) => {
  const diagnostics: any = {
    server: 'running',
    database_url_set: !!process.env.DATABASE_URL,
    database_url_length: process.env.DATABASE_URL?.length || 0,
    database_url_preview: process.env.DATABASE_URL?.substring(0, 50) + '...' || 'not set',
    prisma_connection: 'testing...',
    firebase_configured: !!process.env.FIREBASE_SERVICE_ACCOUNT || !!process.env.FIREBASE_PROJECT_ID,
    firebase_status: 'checking...',
  };

  try {
    // Try to connect with Prisma
    const prisma = (await import('./utils/prisma')).default;
    if (process.env.DATABASE_URL) {
      await prisma.$connect();
      diagnostics.prisma_connection = '✅ Connected';
      
      // Try a simple query
      await prisma.$queryRaw`SELECT 1 as test`;
      diagnostics.prisma_query = '✅ Query successful';
      
      await prisma.$disconnect();
    } else {
      diagnostics.prisma_connection = '⚠️ DATABASE_URL not set (migrating to Firebase)';
    }
  } catch (error: any) {
    diagnostics.prisma_connection = `❌ Error: ${error.message}`;
    diagnostics.prisma_error_code = error.code;
  }

  // Check Firebase
  try {
    const { db } = await import('./utils/firebase');
    if (db) {
      diagnostics.firebase_status = '✅ Initialized';
      // Try a simple read to test connection
      const testRef = db.collection('_test').limit(1);
      await testRef.get();
      diagnostics.firebase_connection = '✅ Connected';
    } else {
      diagnostics.firebase_status = '❌ Not initialized';
      // Check which method is configured
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        diagnostics.firebase_method = 'JSON (FIREBASE_SERVICE_ACCOUNT)';
        diagnostics.firebase_json_length = process.env.FIREBASE_SERVICE_ACCOUNT.length;
      } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        diagnostics.firebase_method = 'Separate variables';
        diagnostics.firebase_private_key_length = process.env.FIREBASE_PRIVATE_KEY.length;
        diagnostics.firebase_error = 'Check FIREBASE_PRIVATE_KEY length (should be 1600+)';
      } else {
        diagnostics.firebase_error = 'No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY';
      }
    }
  } catch (error: any) {
    diagnostics.firebase_status = `❌ Error: ${error.message}`;
    if (process.env.FIREBASE_PRIVATE_KEY) {
      diagnostics.firebase_private_key_length = process.env.FIREBASE_PRIVATE_KEY.length;
    }
  }

  res.json(diagnostics);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

