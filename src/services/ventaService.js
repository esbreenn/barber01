import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from './firebase';

function getUidOrThrow() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('No authenticated user');
  }
  return uid;
}

const getProductSalesCol = () =>
  collection(db, 'users', getUidOrThrow(), 'ventasProductos');

// Subscribe to product sales collection
export function subscribeProductSales(callback) {
  const colRef = getProductSalesCol();
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

// Add a product sale record
export async function addProductSale(sale) {
  const docRef = await addDoc(getProductSalesCol(), sale);
  return { id: docRef.id, ...sale };
}

// Get a product sale by id
export async function getProductSale(id) {
  const uid = getUidOrThrow();
  const snap = await getDoc(
    doc(db, 'users', uid, 'ventasProductos', id)
  );
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update a product sale
export function updateProductSale(id, data) {
  const uid = getUidOrThrow();
  return updateDoc(
    doc(db, 'users', uid, 'ventasProductos', id),
    data
  );
}

// Delete a product sale
export function deleteProductSale(id) {
  const uid = getUidOrThrow();
  return deleteDoc(
    doc(db, 'users', uid, 'ventasProductos', id)
  );
}

// Retrieve all product sales once
export async function getAllProductSales() {
  const snapshot = await getDocs(getProductSalesCol());
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
