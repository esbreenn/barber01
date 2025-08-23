// src/pages/Home.jsx

import React, { useEffect, useState, useMemo, useRef } from "react";
import { subscribeTurnos, deleteTurno } from "../services/turnoService";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/CalendarView";
import TurnoList from "../components/TurnoList";
import toast from 'react-hot-toast';
import { formatCurrency } from "../utils/formatCurrency";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";

function Home() {
  const [allTurnos, setAllTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date()); // selectedDate por defecto es la fecha actual
  const [confirmState, setConfirmState] = useState({ show: false, id: null });
  const navigate = useNavigate();
  const notificationTimeouts = useRef({});

  useEffect(() => {
    try {
      const unsubscribe = subscribeTurnos((data) => {
        setAllTurnos(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Error al suscribirse a turnos:', err);
      if (err.message === 'No authenticated user') {
        navigate('/login');
      }
    }
  }, [navigate]);

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

  useEffect(() => {
    if (!('Notification' in window)) return;
    navigator.serviceWorker.ready.then((reg) => {
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
      notificationTimeouts.current = {};

      todayTurnos.forEach((turno) => {
        const turnoTime = new Date(`${turno.fecha}T${turno.hora}`);
        const delay = turnoTime.getTime() - Date.now();
        if (delay > 0) {
          const timeoutId = setTimeout(() => {
            if (Notification.permission === 'granted') {
              reg.showNotification(`Turno con ${turno.nombre}`, {
                body: `A las ${turno.hora}`,
                tag: `turno-${turno.id}`,
              });
            }
          }, delay);
          notificationTimeouts.current[turno.id] = timeoutId;
        }
      });
    });

    return () => {
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
      notificationTimeouts.current = {};
    };
  }, [todayTurnos]);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDelete = (id) => {
    setConfirmState({ show: true, id });
  };

  const confirmDelete = () => {
    const { id } = confirmState;
    if (notificationTimeouts.current[id]) {
      clearTimeout(notificationTimeouts.current[id]);
      delete notificationTimeouts.current[id];
    }
    setConfirmState({ show: false, id: null });
    toast.promise(deleteTurno(id), {
      loading: 'Eliminando turno...',
      success: 'Turno eliminado con éxito',
      error: (err) => {
        console.error("Error al eliminar:", err);
        if (err.message === 'No authenticated user') {
          navigate('/login');
          return 'Sesión expirada';
        }
        return 'No se pudo eliminar el turno.';
      }
    });
  };

  const cancelDelete = () => {
    setConfirmState({ show: false, id: null });
  };

  const handleEdit = (id) => {
    navigate(`/edit-turno/${id}`);
  };

  if (loading) return <LoadingSpinner className="mt-5" />;

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
      <ConfirmDialog
        show={confirmState.show}
        message="¿Estás seguro de que quieres eliminar este turno?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default Home;
