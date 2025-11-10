import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'idgleb.github.io dice',
  message = '¿Deseas continuar con esta acción?',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  variant = 'danger' // danger, warning, info
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <div className="confirm-modal-overlay" onClick={handleCancel}></div>
      <div className={`confirm-modal confirm-modal--${variant}`}>
        <div className="confirm-modal-header">
          <h2 className="confirm-modal-title">{title}</h2>
        </div>
        
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            className="confirm-btn confirm-btn-confirm"
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
          <button 
            className="confirm-btn confirm-btn-cancel"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;

