// In-memory data service replacing Firebase Firestore
let turnos = [];
let productSales = [];

export function subscribeTurnos(callback) {
  callback([...turnos]);
  return () => {};
}

export function addTurno(turno) {
  return new Promise((resolve) => {
    const newTurno = { ...turno, id: Date.now().toString() };
    turnos.push(newTurno);
    resolve(newTurno);
  });
}

export function getTurno(id) {
  return Promise.resolve(turnos.find(t => t.id === id) || null);
}

export function updateTurno(id, data) {
  return new Promise((resolve) => {
    const idx = turnos.findIndex(t => t.id === id);
    if (idx !== -1) {
      turnos[idx] = { ...turnos[idx], ...data };
    }
    resolve();
  });
}

export function deleteTurno(id) {
  return new Promise((resolve) => {
    turnos = turnos.filter(t => t.id !== id);
    resolve();
  });
}

export function findTurnoByDate(fecha, hora) {
  return Promise.resolve(turnos.find(t => t.fecha === fecha && t.hora === hora) || null);
}

export function subscribeProductSales(callback) {
  callback([...productSales]);
  return () => {};
}

export function addProductSale(sale) {
  return new Promise((resolve) => {
    const newSale = { ...sale, id: Date.now().toString() };
    productSales.push(newSale);
    resolve(newSale);
  });
}

export function getAllTurnos() {
  return turnos;
}
