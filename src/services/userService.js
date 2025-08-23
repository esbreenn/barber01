import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth } from './firebase';

const USERS_COLLECTION = 'users';

function getUidOrThrow() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('No authenticated user');
  }
  return uid;
}

// Add a new user document for the authenticated user
export async function addUser(data) {
  const uid = getUidOrThrow();
  await setDoc(doc(db, USERS_COLLECTION, uid), data);
  return { id: uid, ...data };
}

// Get the authenticated user's document
export async function getUser() {
  const uid = getUidOrThrow();
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update the authenticated user's document
export function updateUser(data) {
  const uid = getUidOrThrow();
  return updateDoc(doc(db, USERS_COLLECTION, uid), data);
}

// Delete the authenticated user's document
export function deleteUser() {
  const uid = getUidOrThrow();
  return deleteDoc(doc(db, USERS_COLLECTION, uid));
}

