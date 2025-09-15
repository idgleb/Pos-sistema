import React from 'react';
import { formatCurrency } from '../../lib/dateHelpers';
import './ProductosTopCard.css';

const ProductosTopCard = ({ topProducts, totalSales }) => {
  if (!topProducts || topProducts.length === 0) {
    return (
      <div className="productos-top-card">
        <div className="metric-header">
          <div className="metric-icon-wrapper top-products">
            <span className="metric-icon">🏆</span>
          </div>
        </div>
        
        <div className="metric-body">
          <h3 className="metric-title">Productos Más Vendidos</h3>
          <div className="no-data-message">
            <div className="no-data-icon">📦</div>
            <p>No hay ventas registradas hoy</p>
          </div>
        </div>
      </div>
    );
  }

  const maxQuantity = Math.max(...topProducts.map(p => p.quantity));

  return (
    <div className="productos-top-card">
      <div className="metric-header">
        <div className="metric-icon-wrapper top-products">
          <span className="metric-icon">🏆</span>
        </div>
        <div className="metric-badge">
          Top {topProducts.length}
        </div>
      </div>
      
      <div className="metric-body">
        <h3 className="metric-title">Productos Más Vendidos</h3>
        <div className="metric-subtitle">
          {totalSales} {totalSales === 1 ? 'producto vendido' : 'productos vendidos'} hoy
        </div>
      </div>
      
      <div className="products-list">
        {topProducts.map((product, index) => {
          const percentage = maxQuantity > 0 ? (product.quantity / maxQuantity) * 100 : 0;
          
          return (
            <div key={product.productId} className="product-item">
              <div className="product-rank">
                <span className={`rank-badge rank-${index + 1}`}>
                  {index + 1}
                </span>
              </div>
              
              <div className="product-info">
                <div className="product-name" title={product.productName}>
                  {product.productName}
                </div>
                <div className="product-stats">
                  <span className="product-quantity">
                    {product.quantity} {product.quantity === 1 ? 'unidad' : 'unidades'} - {formatCurrency(product.revenue)}
                  </span>
                </div>
              </div>
              
              <div className="product-progress">
                <div 
                  className={`progress-bar-fill rank-${index + 1}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="metric-footer">
        <div className="total-info">
          <span className="total-label">Total vendido:</span>
          <span className="total-value">
            {formatCurrency(topProducts.reduce((sum, p) => sum + p.revenue, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductosTopCard;
