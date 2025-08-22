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

const PRODUCT_SALES_COLLECTION = 'productSales';

// Subscribe to product sales collection
export function subscribeProductSales(callback) {
  const colRef = collection(db, PRODUCT_SALES_COLLECTION);
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

// Add a product sale record
export async function addProductSale(sale) {
  const docRef = await addDoc(collection(db, PRODUCT_SALES_COLLECTION), sale);
  return { id: docRef.id, ...sale };
}

// Get a product sale by id
export async function getProductSale(id) {
  const snap = await getDoc(doc(db, PRODUCT_SALES_COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update a product sale
export function updateProductSale(id, data) {
  return updateDoc(doc(db, PRODUCT_SALES_COLLECTION, id), data);
}

// Delete a product sale
export function deleteProductSale(id) {
  return deleteDoc(doc(db, PRODUCT_SALES_COLLECTION, id));
}

// Retrieve all product sales once
export async function getAllProductSales() {
  const snapshot = await getDocs(collection(db, PRODUCT_SALES_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
