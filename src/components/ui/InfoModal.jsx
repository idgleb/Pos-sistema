import React from 'react';
import './InfoModal.css';

const InfoModal = ({ 
  isOpen, 
  onClose, 
  title = 'Información',
  message = '',
  variant = 'success', // success, error, warning, info
  buttonText = 'Aceptar',
  icon = null,
  isLoading = false // Nueva propiedad para estado de carga
}) => {
  if (!isOpen) return null;

  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <>
      <div 
        className="info-modal-overlay" 
        onClick={isLoading ? undefined : onClose}
        style={{ cursor: isLoading ? 'default' : 'pointer' }}
      ></div>
      <div className={`info-modal info-modal--${variant}`}>
        <div className="info-modal-icon-container">
          {isLoading ? (
            <div className="info-modal-spinner-container">
              <div className="info-modal-spinner"></div>
            </div>
          ) : (
            <span className="info-modal-icon">{displayIcon}</span>
          )}
        </div>
        
        <div className="info-modal-header">
          <h2 className="info-modal-title">{title}</h2>
        </div>
        
        <div className="info-modal-body">
          <div className="info-modal-message">{message}</div>
        </div>
        
        <div className="info-modal-footer">
          <button 
            className="info-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : buttonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default InfoModal;

