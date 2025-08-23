// src/components/TurnoForm.jsx

import React from 'react';

function TurnoForm({ turnoData, onFormChange, onSubmit, isSaving, submitText, services = [] }) {
  // Desestructuramos todos los campos, incluido "precio" para el input numérico.
  // NUEVO: añadimos teléfono y notas al formulario de turnos.
  const { nombre, telefono, notas, fecha, hora, servicio, precio } = turnoData;

  return (
    <>
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre del Cliente</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={onFormChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="telefono" className="form-label">Teléfono</label>
        <input
          type="tel"
          className="form-control"
          id="telefono"
          name="telefono"
          value={telefono}
          onChange={onFormChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="fecha" className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          id="fecha"
          name="fecha"
          value={fecha}
          onChange={onFormChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hora" className="form-label">Hora</label>
        <input
          type="time"
          className="form-control"
          id="hora"
          name="hora"
          value={hora}
          onChange={onFormChange}
          required
        />
      </div>
      
      <div className="mb-4"> {/* CAMPO SERVICIO AHORA ES UN SELECT */}
        <label htmlFor="servicio" className="form-label">Servicio</label>
        <select
          className="form-select"
          id="servicio"
          name="servicio"
          value={servicio}
          onChange={onFormChange}
          required
        >
          <option value="" disabled>Seleccione un servicio</option>
          {services.map((s) => (
            <option key={s.id} value={s.nombre}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="precio" className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          id="precio"
          name="precio"
          value={precio}
          onChange={onFormChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="notas" className="form-label">Notas</label>
        <textarea
          className="form-control"
          id="notas"
          name="notas"
          value={notas}
          onChange={onFormChange}
          rows={3}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
        {isSaving ? 'Guardando...' : submitText}
      </button>
    </form>
    </>
  );
}

export default TurnoForm;