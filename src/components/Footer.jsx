import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">
            Política de Privacidad
          </Link>
          <span className="footer-separator">•</span>
          <Link to="/terms" className="footer-link">
            Términos de Servicio
          </Link>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} POS System. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

