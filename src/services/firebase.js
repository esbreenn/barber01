import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with provided parameters
const firebaseConfig = {
  apiKey: 'AIzaSyAC2Yx5V2N_or9gg9A5IhvtPcuLrGDsfWw',
  authDomain: 'barberia01-51ddf.firebaseapp.com',
  projectId: 'barberia01-51ddf',
  storageBucket: 'barberia01-51ddf.firebasestorage.app',
  messagingSenderId: '596073913214',
  appId: '1:596073913214:web:c9e15894292ac6a63f712f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
