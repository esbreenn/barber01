import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

const getTurnosCol = (uid) => collection(db, 'users', uid, 'turnos');

// Subscribe to turnos collection
export function subscribeTurnos(uid, callback) {
  const colRef = getTurnosCol(uid);
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

// Add new turno
export async function addTurno(uid, turno) {
  const docRef = await addDoc(getTurnosCol(uid), turno);
  return { id: docRef.id, ...turno };
}

// Get turno by id
export async function getTurno(uid, id) {
  const snap = await getDoc(doc(db, 'users', uid, 'turnos', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update turno
export function updateTurno(uid, id, data) {
  return updateDoc(doc(db, 'users', uid, 'turnos', id), data);
}

// Delete turno
export function deleteTurno(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'turnos', id));
}

// Find turno by date and time
export async function findTurnoByDate(uid, fecha, hora) {
  const q = query(
    getTurnosCol(uid),
    where('fecha', '==', fecha),
    where('hora', '==', hora)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.length ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
}

// Retrieve all turnos once
export async function getAllTurnos(uid) {
  const snapshot = await getDocs(getTurnosCol(uid));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
