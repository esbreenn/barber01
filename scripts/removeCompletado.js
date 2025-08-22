import { getAllTurnos, updateTurno } from '../src/services/turnoService.js';

async function removeCompletado() {
  const turnos = await getAllTurnos();
  const updates = turnos.map(t => updateTurno(t.id, { completado: undefined }));
  await Promise.all(updates);
  console.log('Propiedad "completado" eliminada de todos los turnos.');
}

removeCompletado().catch(err => {
  console.error('Error en la migración:', err);
});
