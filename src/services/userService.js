import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

// Add a new user document
export async function addUser(user) {
  const docRef = await addDoc(collection(db, USERS_COLLECTION), user);
  return { id: docRef.id, ...user };
}

// Get a user by id
export async function getUser(id) {
  const snap = await getDoc(doc(db, USERS_COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update a user document
export function updateUser(id, data) {
  return updateDoc(doc(db, USERS_COLLECTION, id), data);
}

// Delete a user document
export function deleteUser(id) {
  return deleteDoc(doc(db, USERS_COLLECTION, id));
}

