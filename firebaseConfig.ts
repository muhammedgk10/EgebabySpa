
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Helper to safely access environment variables
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // ignore
  }
  
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {
    // ignore
  }
  
  return undefined;
};

// Standard Vite environment variable access
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

let app = null;
let db = null;
let auth = null;
let isFirebaseReady = false;

// Check if API key exists to attempt connection
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseReady = true;
    console.log('Firebase connection established.');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    isFirebaseReady = false;
  }
} else {
  // Silent fallback to mock mode if no keys provided
  isFirebaseReady = false;
  console.log('Firebase config missing (Demo Mode)');
}

export { app, db, auth, isFirebaseReady };
