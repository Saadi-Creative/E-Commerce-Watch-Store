// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, browserSessionPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
  console.warn(
    "🔥 Firebase API Key is missing! Please set your VITE_FIREBASE_API_KEY in the .env.local file. " +
    "Database and Auth features will not work until this is configured."
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth (session-based)
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

// Firestore
const db = getFirestore(app);

export { auth, db };
