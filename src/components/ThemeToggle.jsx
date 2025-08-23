import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button onClick={toggleTheme} className="btn btn-nav nav-theme" aria-label="Cambiar tema">
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
