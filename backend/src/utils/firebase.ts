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
      let serviceAccount: any;
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (parseError: any) {
        throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT JSON: ${parseError.message}`);
      }
      
      // Validate required fields
      if (!serviceAccount.private_key) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is missing "private_key" field');
      }
      if (!serviceAccount.project_id) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is missing "project_id" field');
      }
      if (!serviceAccount.client_email) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is missing "client_email" field');
      }
      
      // Diagnose private key
      const privateKeyLength = typeof serviceAccount.private_key === 'string' 
        ? serviceAccount.private_key.length 
        : 0;
      
      // Typical private key is 1600+ characters
      if (privateKeyLength < 500) {
        console.error('❌ Private key is too short:', privateKeyLength, 'characters (expected 1600+)');
        console.error('💡 The private_key field seems incomplete or truncated');
        if (typeof serviceAccount.private_key === 'string') {
          const preview = serviceAccount.private_key.substring(0, 100);
          console.error('💡 Private key preview:', preview);
          if (!serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
            console.error('❌ Private key does not start with "-----BEGIN PRIVATE KEY-----"');
          }
          if (!serviceAccount.private_key.includes('END PRIVATE KEY')) {
            console.error('❌ Private key does not end with "-----END PRIVATE KEY-----"');
          }
        }
        throw new Error(`Private key is too short (${privateKeyLength} chars, expected 1600+). Make sure you copied the ENTIRE private_key from the JSON file.`);
      }
      
      // Fix private key format - replace escaped newlines with actual newlines
      // Railway might escape \n as \\n, so we need to handle both
      if (typeof serviceAccount.private_key === 'string') {
        const originalKey = serviceAccount.private_key;
        serviceAccount.private_key = serviceAccount.private_key
          .replace(/\\n/g, '\n')
          .replace(/\\\\n/g, '\n');
        
        // Log if we made changes
        if (originalKey !== serviceAccount.private_key) {
          console.log('ℹ️ Fixed newline characters in private_key');
        }
        
        // Ensure private key starts and ends correctly
        if (!serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
          throw new Error('Private key format is invalid - missing BEGIN PRIVATE KEY');
        }
        if (!serviceAccount.private_key.includes('END PRIVATE KEY')) {
          throw new Error('Private key format is invalid - missing END PRIVATE KEY');
        }
        
        // Count newlines in the key (should be many)
        const newlineCount = (serviceAccount.private_key.match(/\n/g) || []).length;
        if (newlineCount < 20) {
          console.warn('⚠️ Private key has very few newlines (', newlineCount, '). Expected 30+');
          console.warn('💡 This might indicate the key was not copied correctly');
        }
      }
      
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
      // Validate and fix private key
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      const originalLength = privateKey.length;
      
      // Try multiple methods to fix newlines
      // Method 1: Replace escaped newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      privateKey = privateKey.replace(/\\\\n/g, '\n');
      privateKey = privateKey.replace(/\\\\\\n/g, '\n');
      
      // Method 2: If still contains literal \n, try replacing
      if (privateKey.includes('\\n') && !privateKey.includes('\n')) {
        privateKey = privateKey.split('\\n').join('\n');
      }
      
      // Method 3: If Railway escaped it differently, try this
      if (privateKey.includes('\\r\\n')) {
        privateKey = privateKey.replace(/\\r\\n/g, '\n');
      }
      
      // Log transformation
      if (originalLength !== privateKey.length) {
        console.log('ℹ️ Private key transformed: original length', originalLength, '-> new length', privateKey.length);
      }
      
      if (privateKey.length < 500) {
        console.error('❌ FIREBASE_PRIVATE_KEY is too short:', privateKey.length, 'characters (expected 1600+)');
        console.error('💡 Make sure you copied the ENTIRE private_key from the JSON file');
        console.error('💡 It should start with "-----BEGIN PRIVATE KEY-----" and end with "-----END PRIVATE KEY-----"');
        throw new Error(`FIREBASE_PRIVATE_KEY is too short (${privateKey.length} chars, expected 1600+). Copy the entire private_key from JSON.`);
      }
      
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        throw new Error('FIREBASE_PRIVATE_KEY is missing "-----BEGIN PRIVATE KEY-----"');
      }
      if (!privateKey.includes('END PRIVATE KEY')) {
        throw new Error('FIREBASE_PRIVATE_KEY is missing "-----END PRIVATE KEY-----"');
      }
      
      const newlineCount = (privateKey.match(/\n/g) || []).length;
      console.log('ℹ️ Using individual Firebase environment variables');
      console.log('ℹ️ Private key length:', privateKey.length, 'characters');
      console.log('ℹ️ Private key has', newlineCount, 'newlines');
      
      // Validate key format - should have proper PEM structure
      if (newlineCount < 20) {
        console.warn('⚠️ Private key has very few newlines (', newlineCount, '). Expected 30+. This might cause DECODER errors.');
        console.warn('💡 Try copying the private key with actual line breaks, not \\n literals');
      }
      
      // Try to initialize with the fixed key
      try {
        firebaseAppInstance = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
        });
      } catch (certError: any) {
        console.error('❌ Failed to create certificate from private key');
        console.error('💡 Error:', certError.message);
        console.error('💡 This usually means the private key format is incorrect');
        console.error('💡 Try using FIREBASE_SERVICE_ACCOUNT (JSON format) instead of separate variables');
        throw certError;
      }
    } else {
      console.warn('⚠️ Firebase credentials not found. Firebase features will be disabled.');
      return { firebaseApp: null, db: null };
    }

    firestoreInstance = admin.firestore();
    
    // Configure Firestore to ignore undefined properties
    firestoreInstance.settings({
      ignoreUndefinedProperties: true,
    });
    
    console.log('✅ Firebase Admin initialized');
    return { firebaseApp: firebaseAppInstance, db: firestoreInstance };
  } catch (error: any) {
    // During build, firebase-admin might not be available - this is OK
    if (error.code === 'MODULE_NOT_FOUND' && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ Firebase Admin SDK not found. This is OK during development.');
    } else {
      console.error('❌ Firebase initialization error:', error.message);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
      // Log what credentials are available
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const jsonLength = process.env.FIREBASE_SERVICE_ACCOUNT.length;
        console.log('ℹ️ FIREBASE_SERVICE_ACCOUNT is set (length:', jsonLength, ')');
        
        // Typical service account JSON is 2000+ characters
        if (jsonLength < 500) {
          console.error('❌ FIREBASE_SERVICE_ACCOUNT seems too short. Expected ~2000+ characters.');
          console.error('💡 Make sure you copied the ENTIRE JSON from serviceAccountKey.json');
          console.error('💡 The JSON should include: type, project_id, private_key, client_email, etc.');
        }
        
        // Try to show what fields are present
        try {
          const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          const fields = Object.keys(parsed);
          console.log('ℹ️ JSON fields found:', fields.join(', '));
          if (!fields.includes('private_key')) {
            console.error('❌ Missing "private_key" field in JSON');
          }
          if (!fields.includes('project_id')) {
            console.error('❌ Missing "project_id" field in JSON');
          }
        } catch (e) {
          console.error('❌ Cannot parse FIREBASE_SERVICE_ACCOUNT as JSON');
        }
      } else if (process.env.FIREBASE_PROJECT_ID) {
        console.log('ℹ️ FIREBASE_PROJECT_ID is set:', process.env.FIREBASE_PROJECT_ID);
      } else {
        console.warn('⚠️ No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT in Railway.');
      }
    }
    return { firebaseApp: null, db: null };
  }
}

const { firebaseApp: app, db: firestoreDb } = initializeFirebase();

export const db = firestoreDb;
export default app;

