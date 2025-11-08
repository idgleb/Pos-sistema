import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { exportBackup, importBackup } from '../lib/backup';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBackupDropdownOpen, setIsBackupDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { path: '/', label: 'POS', icon: '🛒' },
    { path: '/gastos', label: 'Gastos', icon: '💰' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/movimientos', label: 'Movimientos', icon: '📋' },
    { path: '/productos', label: 'Productos', icon: '📦' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleBackupDropdown = () => {
    setIsBackupDropdownOpen(!isBackupDropdownOpen);
  };

  const closeBackupDropdown = () => {
    setIsBackupDropdownOpen(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeBackupDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar exportación de backup
  const handleExportBackup = async () => {
    closeBackupDropdown();
    
    const result = await exportBackup();
    
    if (result.success) {
      alert(`✅ Backup creado exitosamente!\n\nArchivo: ${result.filename}\n\nEl archivo se ha guardado en tu carpeta de Descargas.`);
    } else {
      alert(`❌ Error al crear backup:\n\n${result.error}`);
    }
  };

  // Manejar importación de backup
  const handleImportBackup = async () => {
    closeBackupDropdown();
    
    const result = await importBackup();
    
    if (result.success) {
      alert('✅ Backup restaurado exitosamente!\n\nLa página se recargará para aplicar los cambios.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (result.error && !result.error.includes('cancelada')) {
      alert(`❌ Error al restaurar backup:\n\n${result.error}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">POS System</h1>
        </div>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu--open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </Link>
          ))}
          
          {/* Botón de Backup con Dropdown */}
          <div className="navbar-backup-container" ref={dropdownRef}>
            <button
              className={`navbar-backup-btn ${isBackupDropdownOpen ? 'navbar-backup-btn--open' : ''}`}
              onClick={toggleBackupDropdown}
              aria-label="Backup"
            >
              <span className="navbar-icon">💾</span>
              <span className="navbar-label">Backup</span>
              <span className="navbar-dropdown-arrow">{isBackupDropdownOpen ? '▲' : '▼'}</span>
            </button>
            
            {isBackupDropdownOpen && (
              <div className="navbar-backup-dropdown">
                <button
                  className="navbar-backup-dropdown-item"
                  onClick={handleExportBackup}
                >
                  <span className="navbar-dropdown-icon">💾</span>
                  <span className="navbar-dropdown-text">Crear Backup</span>
                </button>
                <button
                  className="navbar-backup-dropdown-item"
                  onClick={handleImportBackup}
                >
                  <span className="navbar-dropdown-icon">📥</span>
                  <span className="navbar-dropdown-text">Restaurar Backup</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="navbar-mobile-toggle">
          <button 
            className={`navbar-toggle-btn ${isMobileMenuOpen ? 'navbar-toggle-btn--open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="navbar-toggle-icon">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
