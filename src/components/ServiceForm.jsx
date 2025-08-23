import React from 'react';

function ServiceForm({ serviceData, onFormChange, onSubmit, isSaving, submitText }) {
  const { nombre, precio } = serviceData;

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
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
      <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
        {isSaving ? 'Guardando...' : submitText}
      </button>
    </form>
  );
}

export default ServiceForm;

