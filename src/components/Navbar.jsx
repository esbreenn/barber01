// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import {
  FaHome,
  FaPlusCircle,
  FaChartLine,
  FaShoppingBag,
  FaSignOutAlt,
  FaCut,
  FaUsers,
  FaBars,
} from 'react-icons/fa';

function Navbar({ currentUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="app-navbar">
      <button
        className="menu-toggle"
        aria-label="Abrir menú de navegación"
        aria-expanded={menuOpen}
        aria-controls="navbar-menu"
        onClick={toggleMenu}
      >
        <FaBars />
      </button>
      <div id="navbar-menu" className={`nav-buttons ${menuOpen ? 'show' : ''}`}>
        <Link to="/" className="btn btn-nav nav-home" onClick={closeMenu}>
          <FaHome className="me-1" /> Inicio
        </Link>
        <Link to="/nuevo" className="btn btn-nav nav-new" onClick={closeMenu}>
          <FaPlusCircle className="me-1" /> Agregar Turno
        </Link>
        {/* ¡NUEVO ENLACE para Finanzas! */}
        <Link to="/finanzas" className="btn btn-nav nav-finances" onClick={closeMenu}>
          <FaChartLine className="me-1" /> Finanzas
        </Link>
        <Link to="/venta-producto" className="btn btn-nav nav-products" onClick={closeMenu}>
          <FaShoppingBag className="me-1" /> Venta de Producto
        </Link>
        <Link to="/servicios" className="btn btn-nav nav-services" onClick={closeMenu}>
          <FaCut className="me-1" /> Servicios
        </Link>
        <Link to="/clientes" className="btn btn-nav nav-clients" onClick={closeMenu}>
          <FaUsers className="me-1" /> Clientes
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
