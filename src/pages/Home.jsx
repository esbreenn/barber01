// src/pages/Home.jsx

import React, { useEffect, useState, useMemo } from "react";
import { subscribeTurnos, deleteTurno } from "../services/dataService";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/CalendarView";
import TurnoList from "../components/TurnoList";
import toast from 'react-hot-toast';
import { formatCurrency } from "../utils/formatCurrency";

function Home() {
  const [allTurnos, setAllTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // selectedDate por defecto es la fecha actual
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCurrentUser()) {
      setError("Debes iniciar sesión para ver los turnos.");
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeTurnos((data) => {
      setAllTurnos(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredTurnos = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return allTurnos.filter(turno => turno.fecha === dateString);
  }, [selectedDate, allTurnos]);

  const cortesCompletados = useMemo(() => {
    const completados = filteredTurnos.filter(t => t.completado);
    return completados.length ? completados : filteredTurnos;
  }, [filteredTurnos]);
  const gananciaDiaria = useMemo(
    () => cortesCompletados.reduce((s, t) => s + (parseFloat(t.precio) || 0), 0),
    [cortesCompletados]
  );

  // NUEVO: Lógica para identificar turnos próximos (para el día de hoy)
  const todayTurnos = useMemo(() => {
    // Obtener la fecha actual en formato 'YYYY-MM-DD'
    const todayStr = new Date().toISOString().split('T')[0];
    // Obtener la hora actual en formato 'HH:MM' (sin segundos)
    const now = new Date();
    const nowTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Filtramos los turnos de HOY que aún no han pasado
    return allTurnos.filter(turno => 
      turno.fecha === todayStr && turno.hora >= nowTime
    ).sort((a, b) => a.hora.localeCompare(b.hora)); // Ordenamos por hora para el "próximo turno"
  }, [allTurnos]);

  // NUEVO: Mensaje de cortes para hoy
  const cortesHoyMessage = useMemo(() => {
    // Solo mostramos el mensaje si la fecha seleccionada es HOY
    const isTodaySelected = selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

    if (!isTodaySelected) {
      return null; // No mostrar mensaje si no es el día actual
    }

    if (todayTurnos.length === 0) {
      return "No tienes cortes pendientes para hoy.";
    } else if (todayTurnos.length === 1) {
      const nextTurno = todayTurnos[0];
      return `¡Atención! Tienes 1 corte pendiente para hoy: ${nextTurno.nombre} a las ${nextTurno.hora}.`;
    } else {
      const nextTurno = todayTurnos[0];
      return `Tienes ${todayTurnos.length} cortes pendientes para hoy. El próximo es a las ${nextTurno.hora} con ${nextTurno.nombre}.`;
    }
  }, [todayTurnos, selectedDate]);


  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este turno?")) {
      const promise = deleteTurno(id);

      toast.promise(promise, {
        loading: 'Eliminando turno...',
        success: 'Turno eliminado con éxito',
        error: (err) => {
          console.error("Error al eliminar:", err);
          return 'No se pudo eliminar el turno.';
        }
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-turno/${id}`);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      {/* NUEVO: Mensaje de alerta para los cortes de hoy */}
      {/* Solo mostramos el banner si cortesHoyMessage no es null (es decir, si es el día actual) */}
      {cortesHoyMessage && (
        <div className={`alert ${todayTurnos.length > 0 ? 'alert-warning' : 'alert-light'} text-center fade show`} role="alert">
          <strong>{cortesHoyMessage}</strong>
        </div>
      )}
      {/* FIN NUEVO */}

      <h2 className="mb-3 text-white">Tu Agenda</h2>
      <div className="text-white mb-3">
        Cortes completados: {cortesCompletados.length} — Ganancia: {formatCurrency(gananciaDiaria)}
      </div>
      <CalendarView
        onDateChange={handleDateChange}
        selectedDate={selectedDate}
        turnos={allTurnos}
      />
      <h3 className="mb-3 mt-4 text-white">
        {selectedDate && `Turnos para el ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      </h3>
      <TurnoList 
        turnos={filteredTurnos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Home;
