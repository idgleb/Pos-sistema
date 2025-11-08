import React from 'react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import PaymentButtons from './PaymentButtons';
import './POSPage.css';

const POSPage = () => {
  return (
    <div className="pos-page">
      {/* Banner informativo para Google OAuth - Visible en la parte superior */}
      <div style={{
        background: 'linear-gradient(135deg, #082a9a 0%, #1d4ed8 100%)',
        color: 'white',
        padding: '12px 16px',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: '1.5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <strong>POS Sistema</strong> - Sistema de Punto de Venta gratuito que funciona completamente en tu navegador. 
          Gestiona productos, ventas, gastos y movimientos de tu negocio. 
          Incluye funcionalidad de backup en Google Drive para proteger tus datos.
          {' '}
          <a 
            href="https://idgleb.github.io/privacy.html" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#6dd5ed', 
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            Política de Privacidad
          </a>
          {' • '}
          <a 
            href="https://idgleb.github.io/terms.html" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#6dd5ed', 
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            Términos de Servicio
          </a>
        </div>
      </div>
      
      <div className="pos-content">
        <div className="pos-layout">
          {/* Columna izquierda: Productos */}
          <div className="pos-left">
            <ProductGrid />
          </div>
          
          {/* Columna derecha: Carrito y Pagos */}
          <div className="pos-right">
            <div className="pos-right-content">
              <Cart />
              <PaymentButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
