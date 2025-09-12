import React, { useState } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import PriceModal from './PriceModal';
import './ProductGrid.css';

const ProductGrid = () => {
  const { state, actions } = useStore();
  const [priceModal, setPriceModal] = useState({ isOpen: false, product: null });


  const handleAddToCart = (product) => {
    if (product.isFreePrice) {
      // Abrir modal para precio libre
      setPriceModal({ isOpen: true, product });
    } else {
      // Agregar directamente al carrito
      actions.addToCart(product.id, 1);
    }
  };

  const formatPrice = (priceInCents) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(priceInCents / 100);
  };

  const getDisplayPrice = (product) => {
    if (product.isFreePrice) {
      return 'Precio libre';
    }
    return formatPrice(product.price);
  };

  return (
    <div className="product-grid">
      <div className="product-grid-container">
        {state.products?.map(product => (
          <div 
            key={product.id} 
            className={`product-card ${product.isFreePrice ? 'product-card--free-price' : ''}`}
            onClick={() => handleAddToCart(product)}
          >
            <div className="product-image">
              {product.imageDataUrl ? (
                <img src={product.imageDataUrl} alt={product.name} />
              ) : (
                <div className="product-placeholder">
                  <span className="product-icon">📦</span>
                </div>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className={`product-price ${product.isFreePrice ? 'product-price--free' : ''}`}>
                {getDisplayPrice(product)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <PriceModal
        isOpen={priceModal.isOpen}
        onClose={() => setPriceModal({ isOpen: false, product: null })}
        product={priceModal.product}
      />
    </div>
  );
};

export default ProductGrid;
