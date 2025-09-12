import React from 'react';
import Button from '../../components/ui/Button';

const ProductsPage = () => {
  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Gestión de Productos</h1>
        <p className="products-subtitle">Catálogo e inventario de productos</p>
      </div>
      
      <div className="products-content">
        <div className="products-placeholder">
          <div className="placeholder-icon">📦</div>
          <h2>Catálogo de Productos</h2>
          <p>Aquí se implementará la gestión de productos</p>
          <div className="placeholder-features">
            <div className="feature-item">
              <span className="feature-icon">➕</span>
              <span>Agregar productos</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✏️</span>
              <span>Editar información</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Control de stock</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏷️</span>
              <span>Categorías y precios</span>
            </div>
          </div>
          <Button variant="primary" size="lg">
            Agregar Producto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
