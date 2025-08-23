import React, { useEffect, useState } from 'react';
import { subscribeTurnos } from '../services/turnoService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

function Clients() {
  const [clients, setClients] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const unsubscribe = subscribeTurnos((data) => {
        const grouped = data.reduce((acc, turno) => {
          const key = turno.nombre || 'Sin nombre';
          if (!acc[key]) acc[key] = [];
          acc[key].push(turno);
          return acc;
        }, {});
        Object.values(grouped).forEach((arr) =>
          arr.sort((a, b) => {
            const dateCompare = a.fecha.localeCompare(b.fecha);
            if (dateCompare !== 0) return dateCompare;
            return a.hora.localeCompare(b.hora);
          })
        );
        setClients(grouped);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      if (err.message === 'No authenticated user') {
        navigate('/login');
      } else {
        toast.error('Error al cargar clientes.');
      }
    }
  }, [navigate]);

  const clientEntries = Object.entries(clients);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Clientes</h2>
      {clientEntries.length === 0 && <p className="text-secondary">No hay turnos registrados.</p>}
      {clientEntries.map(([nombre, turnos]) => {
        const telefono = turnos[0].telefono;
        return (
          <div className="card mb-4" key={nombre}>
            <div className="card-header">
              <strong>{nombre}</strong>
              {telefono && <span className="ms-2">- {telefono}</span>}
            </div>
            <ul className="list-group list-group-flush">
              {turnos.map((t) => (
                <li key={t.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>{t.fecha} {t.hora}</span>
                    <span>{t.servicio} - {formatCurrency(t.precio)}</span>
                  </div>
                  {t.notas && <small className="text-muted d-block">{t.notas}</small>}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default Clients;
