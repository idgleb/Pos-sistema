import React from 'react';
import { useStore } from '../../app/store/StoreProvider';
import Button from '../../components/ui/Button';
import './Cart.css';

const Cart = () => {
  const { state, actions } = useStore();

  const formatPrice = (priceInCents) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(priceInCents / 100);
  };

  const getProductById = (productId) => {
    return state.products.find(product => product.id === productId);
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      if (isManualService(item.productId)) {
        return total + item.qty; // Para servicios manuales, qty contiene el precio
      }
      // Usar precio personalizado si está presente
      if (item.customPrice) {
        return total + (item.customPrice * item.qty);
      }
      const product = getProductById(item.productId);
      if (product) {
        return total + (product.price * item.qty);
      }
      return total;
    }, 0);
  };

  const handleIncrementQty = (productId) => {
    if (isManualService(productId)) {
      // Para servicios manuales, no permitir incrementar cantidad
      return;
    }
    actions.incrementCartItem(productId);
  };

  const handleDecrementQty = (productId) => {
    if (isManualService(productId)) {
      // Para servicios manuales, no permitir decrementar cantidad
      return;
    }
    actions.decrementCartItem(productId);
  };

  const handleRemoveItem = (productId) => {
    actions.removeFromCart(productId);
  };

  const handleClearCart = () => {
    actions.clearCart();
  };

  const isManualService = (productId) => {
    return productId === 'manual-service';
  };

  const getItemName = (item) => {
    if (isManualService(item.productId)) {
      return 'Servicio/Monto manual';
    }
    const product = getProductById(item.productId);
    return product ? product.name : 'Producto no encontrado';
  };

  const getItemPrice = (item) => {
    if (isManualService(item.productId)) {
      return item.qty; // En este caso, qty contiene el precio
    }
    // Si tiene precio personalizado, usarlo
    if (item.customPrice) {
      return item.customPrice;
    }
    const product = getProductById(item.productId);
    return product ? product.price : 0;
  };

  const getItemSubtotal = (item) => {
    if (isManualService(item.productId)) {
      return item.qty; // Para servicios manuales, qty es el precio total
    }
    // Si tiene precio personalizado, usarlo
    if (item.customPrice) {
      return item.customPrice * item.qty;
    }
    const product = getProductById(item.productId);
    return product ? product.price * item.qty : 0;
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Carrito</h2>
        {state.cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            className="clear-cart-btn"
          >
            🗑️ Limpiar
          </Button>
        )}
      </div>

      <div className="cart-content">
        {state.cart.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <p>El carrito está vacío</p>
            <span>Agrega productos para comenzar</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {state.cart.map(item => {
                const product = getProductById(item.productId);
                return (
                <div key={item.productId} className="cart-item">
                  {/* Imagen del producto */}
                  <div className="item-image">
                    {product?.imageDataUrl ? (
                      <img src={product.imageDataUrl} alt={getItemName(item)} />
                    ) : (
                      <div className="item-image-placeholder">
                        <span>📦</span>
                      </div>
                    )}
                  </div>

                  <div className="item-info">
                    <h4 className="item-name">{getItemName(item)}</h4>
                    <p className="item-price">
                      {formatPrice(getItemPrice(item))} {!isManualService(item.productId) && 'c/u'}
                    </p>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecrementQty(item.productId)}
                        className="qty-btn"
                        disabled={isManualService(item.productId)}
                      >
                        -
                      </Button>
                      <span className="quantity">
                        {isManualService(item.productId) ? '1' : item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIncrementQty(item.productId)}
                        className="qty-btn"
                        disabled={isManualService(item.productId)}
                      >
                        +
                      </Button>
                    </div>

                    <div className="item-subtotal">
                      {formatPrice(getItemSubtotal(item))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="remove-btn"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="cart-total">
              <div className="total-line">
                <span className="total-label">Total:</span>
                <span className="total-amount">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
