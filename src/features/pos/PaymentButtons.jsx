import React, { useState } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import Button from '../../components/ui/Button';
import './PaymentButtons.css';

const PaymentButtons = () => {
  const { state, actions } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      if (item.productId === 'manual-service') {
        return total + item.qty; // Para servicios manuales, qty es el precio
      }
      // Si tiene precio personalizado, usarlo
      if (item.customPrice) {
        return total + (item.customPrice * item.qty);
      }
      const product = state.products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.qty : 0);
    }, 0);
  };

  const handlePayment = async (method) => {
    if (state.cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const total = getCartTotal();
    if (total <= 0) {
      alert('El total debe ser mayor a 0');
      return;
    }

    setIsProcessing(true);

    try {
      // Crear el movimiento de venta
      const saleItems = state.cart.map(item => {
        if (item.productId === 'manual-service') {
          return {
            productId: 'manual-service',
            name: 'Servicio/Monto manual',
            price: item.qty,
            qty: 1
          };
        }
        const product = state.products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          name: product ? product.name : 'Producto no encontrado',
          price: item.customPrice || (product ? product.price : 0),
          qty: item.qty,
          customPrice: item.customPrice || null
        };
      });

      actions.addMovement('sale', total, {
        method: method,
        items: saleItems,
        timestamp: new Date().toISOString()
      });

      // Limpiar el carrito
      actions.clearCart();

      // Mostrar mensaje de éxito
      const methodText = method === 'cash' ? 'Efectivo' : 'Tarjeta';
      alert(`✅ Pago procesado exitosamente\nMétodo: ${methodText}\nTotal: ${new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
      }).format(total / 100)}`);

    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('❌ Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = getCartTotal();
  const hasItems = state.cart.length > 0;

  return (
    <div className="payment-buttons">
      <div className="payment-actions">
        <Button
          variant="success"
          size="lg"
          onClick={() => handlePayment('cash')}
          disabled={!hasItems || isProcessing}
          loading={isProcessing}
          className="payment-btn payment-btn--cash"
        >
          <span className="payment-icon">💵</span>
          <span className="payment-text">Pagar Efectivo</span>
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={() => handlePayment('card')}
          disabled={!hasItems || isProcessing}
          loading={isProcessing}
          className="payment-btn payment-btn--card"
        >
          <span className="payment-icon">💳</span>
          <span className="payment-text">Pagar Tarjeta</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentButtons;
