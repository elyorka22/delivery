import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Credentials can be provided via:
// 1. Service account JSON file (for local development)
// 2. Environment variables (for Railway deployment)

let firebaseApp: admin.app.App;

try {
  // Try to initialize with service account from environment variable (Railway)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } 
  // Try to initialize with service account file (local development)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH),
    });
  }
  // Try to initialize with individual environment variables
  else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    throw new Error('Firebase credentials not found. Please set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH');
  }

  console.log('✅ Firebase Admin initialized');
} catch (error: any) {
  console.error('❌ Firebase initialization error:', error.message);
  throw error;
}

export const db = admin.firestore();
export default firebaseApp;

