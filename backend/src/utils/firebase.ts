// Firebase Admin SDK - will be used after migration from Prisma
// Using type-safe import with error handling
import type { App as FirebaseApp } from 'firebase-admin/app';
import type { Firestore } from 'firebase-admin/firestore';

let firebaseAppInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

function initializeFirebase() {
  if (firebaseAppInstance) {
    return { firebaseApp: firebaseAppInstance, db: firestoreInstance! };
  }

  try {
    // Dynamic import to handle cases where firebase-admin might not be available during build
    const admin = require('firebase-admin') as typeof import('firebase-admin');
    
    // Try to initialize with service account from environment variable (Railway)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseAppInstance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } 
    // Try to initialize with service account file (local development)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      firebaseAppInstance = admin.initializeApp({
        credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH),
      });
    }
    // Try to initialize with individual environment variables
    else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      firebaseAppInstance = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn('⚠️ Firebase credentials not found. Firebase features will be disabled.');
      return { firebaseApp: null, db: null };
    }

    firestoreInstance = admin.firestore();
    console.log('✅ Firebase Admin initialized');
    return { firebaseApp: firebaseAppInstance, db: firestoreInstance };
  } catch (error: any) {
    // During build, firebase-admin might not be available - this is OK
    if (error.code === 'MODULE_NOT_FOUND' && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ Firebase Admin SDK not found. This is OK during development.');
    } else {
      console.warn('⚠️ Firebase initialization error:', error.message);
    }
    return { firebaseApp: null, db: null };
  }
}

const { firebaseApp: app, db: firestoreDb } = initializeFirebase();

export const db = firestoreDb;
export default app;

