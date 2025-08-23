import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth } from './firebase';

const USERS_COLLECTION = 'users';

// Add a new user document for the authenticated user
export async function addUser(data) {
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, USERS_COLLECTION, uid), data);
  return { id: uid, ...data };
}

// Get the authenticated user's document
export async function getUser() {
  const uid = auth.currentUser.uid;
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update the authenticated user's document
export function updateUser(data) {
  const uid = auth.currentUser.uid;
  return updateDoc(doc(db, USERS_COLLECTION, uid), data);
}

// Delete the authenticated user's document
export function deleteUser() {
  const uid = auth.currentUser.uid;
  return deleteDoc(doc(db, USERS_COLLECTION, uid));
}

