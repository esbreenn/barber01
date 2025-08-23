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

const getProductSalesCol = () =>
  collection(db, 'users', auth.currentUser.uid, 'ventasProductos');

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
  const snap = await getDoc(
    doc(db, 'users', auth.currentUser.uid, 'ventasProductos', id)
  );
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update a product sale
export function updateProductSale(id, data) {
  return updateDoc(
    doc(db, 'users', auth.currentUser.uid, 'ventasProductos', id),
    data
  );
}

// Delete a product sale
export function deleteProductSale(id) {
  return deleteDoc(
    doc(db, 'users', auth.currentUser.uid, 'ventasProductos', id)
  );
}

// Retrieve all product sales once
export async function getAllProductSales() {
  const snapshot = await getDocs(getProductSalesCol());
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
