/* eslint-env node */

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import process from 'node:process';

// Initialize Firebase app using same environment variables as the client
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);
const db = getFirestore();

// Mapping object for documents lacking a uid field
// Example: { externalId: uid }
const uidMapping = {
  // 'externalId1': 'uid1',
  // 'externalId2': 'uid2',
};

async function migrateProductSales() {
  const sourceCol = collection(db, 'productSales');
  const snapshot = await getDocs(sourceCol);

  for (const snap of snapshot.docs) {
    const data = snap.data();
    const uid = data.uid || uidMapping[data.externalId];

    if (!uid) {
      console.warn(`Skipping ${snap.id}, no uid found`);
      continue;
    }

    const targetRef = doc(db, 'users', uid, 'ventasProductos', snap.id);
    await setDoc(targetRef, data);
    await deleteDoc(snap.ref);
    console.log(`Migrated ${snap.id} to users/${uid}/ventasProductos`);
  }

  const remaining = await getDocs(sourceCol);
  if (remaining.size === 0) {
    console.log('Migration finished. productSales collection removed.');
  } else {
    console.warn(`Migration finished but ${remaining.size} documents remain in productSales.`);
  }
}

migrateProductSales().catch(err => {
  console.error('Error during migration:', err);
});
