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

const TURNOS_COLLECTION = 'turnos';

// Subscribe to turnos collection
export function subscribeTurnos(callback) {
  const colRef = collection(db, TURNOS_COLLECTION);
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

// Add new turno
export async function addTurno(turno) {
  const docRef = await addDoc(collection(db, TURNOS_COLLECTION), turno);
  return { id: docRef.id, ...turno };
}

// Get turno by id
export async function getTurno(id) {
  const snap = await getDoc(doc(db, TURNOS_COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update turno
export function updateTurno(id, data) {
  return updateDoc(doc(db, TURNOS_COLLECTION, id), data);
}

// Delete turno
export function deleteTurno(id) {
  return deleteDoc(doc(db, TURNOS_COLLECTION, id));
}

// Find turno by date and time
export async function findTurnoByDate(fecha, hora) {
  const q = query(
    collection(db, TURNOS_COLLECTION),
    where('fecha', '==', fecha),
    where('hora', '==', hora)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.length ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
}

// Retrieve all turnos once
export async function getAllTurnos() {
  const snapshot = await getDocs(collection(db, TURNOS_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
