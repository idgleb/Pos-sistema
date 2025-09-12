import React from 'react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import PaymentButtons from './PaymentButtons';
import './POSPage.css';

const POSPage = () => {
  return (
    <div className="pos-page">
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
