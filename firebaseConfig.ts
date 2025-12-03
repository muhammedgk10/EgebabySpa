
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ---------------------------------------------------------------------------
// 🔥 FIREBASE BAĞLANTISI
// ---------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyDyh5VcEzcSVR_4xcHWd4kS_7QnYfUmeYw",
  authDomain: "egebabyspa-c7eb6.firebaseapp.com",
  projectId: "egebabyspa-c7eb6",
  storageBucket: "egebabyspa-c7eb6.firebasestorage.app",
  messagingSenderId: "403490646774",
  appId: "1:403490646774:web:f1166cc211bc5870d1dad7"
};

let app = null;
let db = null;
let auth = null;
let isFirebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  
  // Use initializeFirestore to configure settings for better stability
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Helps with connection issues in some environments
  });
  
  auth = getAuth(app);
  isFirebaseReady = true;
  console.log('✅ Firebase bağlantısı başlatıldı.');
} catch (error) {
  console.error('❌ Firebase başlatma hatası:', error);
  isFirebaseReady = false;
}

export { app, db, auth, isFirebaseReady };
