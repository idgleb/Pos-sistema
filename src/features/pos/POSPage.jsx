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
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: '1.6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ fontSize: '16px' }}>POS Sistema</strong> - Sistema de Punto de Venta gratuito
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Funcionalidad:</strong> Gestiona productos, ventas, gastos y movimientos de tu negocio. 
            Funciona completamente en tu navegador, todos los datos se almacenan localmente en tu dispositivo.
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Uso de Google Drive:</strong> La aplicación solicita acceso a Google Drive únicamente para 
            permitirte crear backups de tus datos de negocio en tu propia cuenta de Google Drive. 
            Esto te permite proteger y restaurar tus datos cuando lo necesites. 
            Los datos se almacenan en una carpeta privada "POS Backups" en tu Google Drive.
          </div>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <a 
              href="https://idgleb.github.io/privacy.html" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#6dd5ed', 
                textDecoration: 'underline',
                fontWeight: 'bold',
                marginRight: '16px'
              }}
            >
              📄 Política de Privacidad
            </a>
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
              📋 Términos de Servicio
            </a>
          </div>
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
