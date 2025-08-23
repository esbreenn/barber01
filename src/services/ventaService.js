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
import { db } from './firebase';

const getProductSalesCol = (uid) =>
  collection(db, 'users', uid, 'ventasProductos');

// Subscribe to product sales collection
export function subscribeProductSales(uid, callback) {
  const colRef = getProductSalesCol(uid);
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

// Add a product sale record
export async function addProductSale(uid, sale) {
  const docRef = await addDoc(getProductSalesCol(uid), sale);
  return { id: docRef.id, ...sale };
}

// Get a product sale by id
export async function getProductSale(uid, id) {
  const snap = await getDoc(doc(db, 'users', uid, 'ventasProductos', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update a product sale
export function updateProductSale(uid, id, data) {
  return updateDoc(doc(db, 'users', uid, 'ventasProductos', id), data);
}

// Delete a product sale
export function deleteProductSale(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'ventasProductos', id));
}

// Retrieve all product sales once
export async function getAllProductSales(uid) {
  const snapshot = await getDocs(getProductSalesCol(uid));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
