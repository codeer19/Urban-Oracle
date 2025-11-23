import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// REPLACE WITH YOUR ACTUAL CONFIG FROM STEP 3!
const firebaseConfig = {
  apiKey: "AIzaSyCEFHhuvCg2ZTqFpI1nHe3pA4QbuL3PP3Y",
  authDomain: "urbanoracle-56863.firebaseapp.com",
  projectId: "urbanoracle-56863",
  storageBucket: "urbanoracle-56863.firebasestorage.app",
  messagingSenderId: "118195587749",
  appId: "1:118195587749:web:922f7353981b040d8a9b4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Storage, and Auth
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

console.log('🔥 Firebase initialized successfully!');