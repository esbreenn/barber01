// src/components/LoadingSpinner.jsx

import React from 'react';

function LoadingSpinner({ color = 'primary', size, className = '', style = {} }) {
  const spinnerStyle = size ? { width: size, height: size } : {};
  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`} style={style}>
      <div className={`spinner-border text-${color}`} role="status" style={spinnerStyle}>
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
