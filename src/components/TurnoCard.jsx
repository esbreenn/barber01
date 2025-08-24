// src/components/TurnoCard.jsx

import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function TurnoCard({ turno, onDelete, onEdit }) {
  const { id, nombre, hora, servicio } = turno; // Mantenemos servicio aquí por si lo usamos en el 'title'

  return (
    <div className="turno-row">
      <div className="col-hora">{hora}</div>
      {/* Añadimos un 'title' para poder ver el servicio al pasar el ratón */}
      <div className="col-nombre" title={`Servicio: ${servicio || 'N/A'}`}>
        {nombre}
      </div>
      <div className="col-acciones">
        <button
          type="button"
          aria-label="Editar turno"
          onClick={() => onEdit(id)}
          className="btn btn-sm btn-edit"
        >
          <FaEdit />
        </button>
        <button
          type="button"
          aria-label="Eliminar turno"
          onClick={() => onDelete(id)}
          className="btn btn-sm btn-delete"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}

export default TurnoCard;