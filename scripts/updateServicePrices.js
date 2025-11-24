/* eslint-env node */
import process from 'node:process';
import { initializeApp } from 'firebase/app';
import { collectionGroup, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

// Firebase configuration using environment variables
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

const priceUpdates = [
  { names: ['corte', 'corte de cabello'], price: 10000 },
  { names: ['corte con barba', 'corte de cabello y barba'], price: 13000 },
];

function normalizeName(name = '') {
  return name.toLowerCase().trim();
}

async function updateServicePrices() {
  const snapshot = await getDocs(collectionGroup(db, 'services'));
  let updatedCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const normalizedName = normalizeName(data.nombre);
    const match = priceUpdates.find((entry) => entry.names.includes(normalizedName));

    if (match && data.precio !== match.price) {
      await updateDoc(docSnap.ref, { precio: match.price });
      updatedCount += 1;
      console.log(`Actualizado: ${data.nombre} -> ${match.price}`);
    }
  }

  console.log(`Proceso completado. Servicios actualizados: ${updatedCount}`);
}

updateServicePrices().catch((err) => {
  console.error('Error al actualizar precios de servicios:', err);
  process.exit(1);
});
