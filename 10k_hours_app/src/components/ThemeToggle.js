import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: darkMode ? '#4a5568' : '#61dafb',
        color: darkMode ? 'white' : '#282c34',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: 'bold'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      {darkMode ? '浅色模式' : '深色模式'}
    </button>
  );
}

export default ThemeToggle;