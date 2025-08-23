// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import {
  FaHome,
  FaPlusCircle,
  FaChartLine,
  FaShoppingBag,
  FaSignOutAlt,
  FaCut,
} from 'react-icons/fa';

function Navbar({ currentUser }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="app-navbar">
      <div className="nav-buttons">
        <Link to="/" className="btn btn-nav nav-home">
          <FaHome className="me-1" /> Inicio
        </Link>
        <Link to="/nuevo" className="btn btn-nav nav-new">
          <FaPlusCircle className="me-1" /> Agregar Turno
        </Link>
        {/* ¡NUEVO ENLACE para Finanzas! */}
        <Link to="/finanzas" className="btn btn-nav nav-finances">
          <FaChartLine className="me-1" /> Finanzas
        </Link>
        <Link to="/venta-producto" className="btn btn-nav nav-products">
          <FaShoppingBag className="me-1" /> Venta de Producto
        </Link>
        <Link to="/servicios" className="btn btn-nav nav-services">
          <FaCut className="me-1" /> Servicios
        </Link>
      </div>
      <div className="user-actions">
        {/* Aquí mostramos el email del usuario logueado */}
        <span className="welcome-text">
          Bienvenido {currentUser && currentUser.email ? currentUser.email.split('@')[0] : 'Usuario'}
        </span>
        <button onClick={handleLogout} className="btn btn-nav nav-logout">
          <FaSignOutAlt className="me-1" /> Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
