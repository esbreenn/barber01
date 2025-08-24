// src/components/TurnoCard.jsx

import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function TurnoCard({ turno, onDelete, onEdit }) {
  const { id, nombre, hora, servicio } = turno;

  return (
    <div className="turno-row">
      <div className="col-hora">{hora}</div>
      <div className="col-nombre">
        <span className="turno-nombre">{nombre}</span>
        <small className="turno-servicio">{servicio || 'N/A'}</small>
      </div>
      <div className="col-acciones">
        <button
          type="button"
          aria-label="Editar turno"
          onClick={() => onEdit(id)}
          className="btn btn-action btn-edit"
        >
          <FaEdit />
        </button>
        <button
          type="button"
          aria-label="Eliminar turno"
          onClick={() => onDelete(id)}
          className="btn btn-action btn-delete"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}

export default TurnoCard;
