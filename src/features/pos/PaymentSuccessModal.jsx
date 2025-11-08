import React from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import './PaymentSuccessModal.css';

const PaymentSuccessModal = ({ isOpen, onClose, paymentData }) => {
  if (!paymentData) return null;

  const { method, total } = paymentData;
  const methodText = method === 'cash' ? 'Efectivo' : 'Tarjeta';
  const formattedTotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(total / 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="payment-success-modal">
        <div className="payment-success-icon">
          ✅
        </div>
        
        <h2 className="payment-success-title">
          Pago procesado exitosamente
        </h2>
        
        <div className="payment-success-details">
          <div className="payment-detail-row">
            <span className="payment-detail-label">Método:</span>
            <span className="payment-detail-value">{methodText}</span>
          </div>
          
          <div className="payment-detail-row">
            <span className="payment-detail-label">Total:</span>
            <span className="payment-detail-value payment-detail-total">
              {formattedTotal}
            </span>
          </div>
        </div>
        
        <div className="payment-success-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="payment-success-btn"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentSuccessModal;

