import React, { useState } from 'react';
import useServices from '../hooks/useServices';
import ServiceForm from '../components/ServiceForm';
import { addService, updateService, deleteService } from '../services/serviceService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

const initialState = { nombre: '', precio: '' };

function ServicesPanel() {
  const { services } = useServices();
  const [service, setService] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service.nombre.trim() || !service.precio) {
      toast.error('Nombre y precio son obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const payload = { nombre: service.nombre, precio: Number(service.precio) };
      if (editingId) {
        await updateService(editingId, payload);
        toast.success('Servicio actualizado');
      } else {
        await addService(payload);
        toast.success('Servicio agregado');
      }
      setService(initialState);
      setEditingId(null);
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      toast.error('No se pudo guardar el servicio.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (svc) => {
    setService({ nombre: svc.nombre, precio: svc.precio });
    setEditingId(svc.id);
  };

  const handleCancel = () => {
    setService(initialState);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar servicio?')) {
      try {
        await deleteService(id);
        toast.success('Servicio eliminado');
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
        toast.error('No se pudo eliminar el servicio.');
      }
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">{editingId ? 'Editar Servicio' : 'Agregar Servicio'}</h2>
      <ServiceForm
        serviceData={service}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        isSaving={loading}
        submitText={editingId ? 'Actualizar Servicio' : 'Agregar Servicio'}
      />
      {editingId && (
        <button className="btn btn-secondary mt-2 w-100" onClick={handleCancel} disabled={loading}>
          Cancelar
        </button>
      )}

      <h3 className="mt-5 mb-3">Mis Servicios</h3>
      {services.length === 0 ? (
        <p>No hay servicios.</p>
      ) : (
        <ul className="theme-list">
          {services.map((svc) => (
            <li
              key={svc.id}
              className="theme-list-item d-flex justify-content-between align-items-center"
            >
              <span>{svc.nombre} - {formatCurrency(svc.precio)}</span>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(svc)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(svc.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServicesPanel;

