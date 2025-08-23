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
import { db, auth } from './firebase';

function getUidOrThrow() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('No authenticated user');
  }
  return uid;
}

const getTurnosCol = () => collection(db, 'users', getUidOrThrow(), 'turnos');

// Subscribe to turnos collection
export function subscribeTurnos(callback) {
  const colRef = getTurnosCol();
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
  return unsubscribe;
}

// Add new turno ensuring no duplicate schedule exists
export async function addTurno(turno) {
  const existing = await findTurnoByDate(turno.fecha, turno.hora);
  if (existing) {
    throw new Error('Turno duplicado');
  }
  // Solo almacenamos los campos esperados, incluyendo teléfono y notas.
  const data = {
    nombre: turno.nombre,
    telefono: turno.telefono || '',
    notas: turno.notas || '',
    fecha: turno.fecha,
    hora: turno.hora,
    servicio: turno.servicio,
    precio: turno.precio,
    ...(turno.creado && { creado: turno.creado }),
  };
  const docRef = await addDoc(getTurnosCol(), data);
  return { id: docRef.id, ...data };
}

// Get turno by id
export async function getTurno(id) {
  const uid = getUidOrThrow();
  const snap = await getDoc(doc(db, 'users', uid, 'turnos', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update turno
export function updateTurno(id, data) {
  const uid = getUidOrThrow();
  // Incluimos teléfono y notas en la actualización.
  const dataToUpdate = {
    nombre: data.nombre,
    telefono: data.telefono || '',
    notas: data.notas || '',
    fecha: data.fecha,
    hora: data.hora,
    servicio: data.servicio,
    precio: data.precio,
    ...(data.creado && { creado: data.creado }),
  };
  return updateDoc(doc(db, 'users', uid, 'turnos', id), dataToUpdate);
}

// Delete turno
export function deleteTurno(id) {
  const uid = getUidOrThrow();
  return deleteDoc(doc(db, 'users', uid, 'turnos', id));
}

// Find turno by date and time
export async function findTurnoByDate(fecha, hora) {
  const q = query(
    getTurnosCol(),
    where('fecha', '==', fecha),
    where('hora', '==', hora)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.length ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
}

// Retrieve all turnos once
export async function getAllTurnos() {
  const snapshot = await getDocs(getTurnosCol());
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
