// src/firebase/config.ts (FINAL)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp as firestoreServerTimestamp } from 'firebase/firestore'; 
import { getStorage } from 'firebase/storage'; 
import { getAnalytics } from "firebase/analytics";

// --- 1. Firebase Configuration Object ---
// Values are loaded from Vite environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/* 
// Previous Env Var Configuration (Kept for reference)
const firebaseConfigEnv = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
*/

// --- 2. Initialize the Firebase App ---
// This should only be called once.
const firebaseApp = initializeApp(firebaseConfig);

// --- 3. Initialize Firebase Services ---

// Export the Auth instance
export const auth = getAuth(firebaseApp);

// Export the Firestore instance
export const db = getFirestore(firebaseApp);

// Export the Storage instance
export const storage = getStorage(firebaseApp); 

// Export the Analytics instance
// Initialize conditionally to avoid SSR issues and ad-blocker errors in dev
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD 
  ? getAnalytics(firebaseApp) 
  : null;

// Export serverTimestamp utility for document creation/updates
export const serverTimestamp = firestoreServerTimestamp; 

export default firebaseApp;
