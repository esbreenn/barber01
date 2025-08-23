/* eslint-env node */
import process from 'node:process';
import { getAllTurnos, updateTurno } from '../src/services/turnoService.js';

const [uid] = process.argv.slice(2);
if (!uid) {
  console.error('Usage: node removeCompletado.js <uid>');
  process.exit(1);
}

async function removeCompletado() {
  const turnos = await getAllTurnos(uid);
  const updates = turnos.map(t => updateTurno(uid, t.id, { completado: undefined }));
  await Promise.all(updates);
  console.log('Propiedad "completado" eliminada de todos los turnos.');
}

removeCompletado().catch(err => {
  console.error('Error en la migración:', err);
});

