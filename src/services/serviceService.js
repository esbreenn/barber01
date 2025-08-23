import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './firebase';

function getUidOrThrow() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('No authenticated user');
  }
  return uid;
}

const getServicesCol = () => collection(db, 'users', getUidOrThrow(), 'services');

export function subscribeServices(callback) {
  const colRef = getServicesCol();
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

export async function addService(service) {
  const docRef = await addDoc(getServicesCol(), service);
  return { id: docRef.id, ...service };
}

export async function getService(id) {
  const uid = getUidOrThrow();
  const snap = await getDoc(doc(db, 'users', uid, 'services', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function updateService(id, data) {
  const uid = getUidOrThrow();
  return updateDoc(doc(db, 'users', uid, 'services', id), data);
}

export function deleteService(id) {
  const uid = getUidOrThrow();
  return deleteDoc(doc(db, 'users', uid, 'services', id));
}

export async function getAllServices() {
  const snapshot = await getDocs(getServicesCol());
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

