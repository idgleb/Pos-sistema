import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
