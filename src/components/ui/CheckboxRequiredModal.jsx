import React from 'react';
import './CheckboxRequiredModal.css';

const CheckboxRequiredModal = ({ 
  isOpen, 
  onClose, 
  onReconnect 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="checkbox-required-modal-overlay" 
        onClick={onClose}
      ></div>
      <div className="checkbox-required-modal">
        <div className="checkbox-required-modal-icon-container">
          <span className="checkbox-required-modal-icon">⚠️</span>
        </div>
        
        <div className="checkbox-required-modal-header">
          <h2 className="checkbox-required-modal-title">Permiso de Google Drive Requerido</h2>
        </div>
        
        <div className="checkbox-required-modal-body">
          <div className="checkbox-required-modal-message">
            <p><strong>El permiso de Google Drive es obligatorio</strong> para guardar backups.</p>
            
            <p>En la pantalla de consentimiento de Google, debes <strong>marcar manualmente</strong> el checkbox que dice:</p>
            
            <div className="checkbox-required-modal-highlight">
              <span className="checkbox-required-modal-drive-icon">📁</span>
              <span>"Visualiza, crea, edita y elimina solo los archivos de Google Drive que uses con esta aplicación"</span>
            </div>
            
            <p className="checkbox-required-modal-instructions">
              <strong>Importante:</strong> Si no marcas este checkbox, Google NO otorgará el permiso de Drive y no podrás guardar backups.
            </p>
          </div>
        </div>
        
        <div className="checkbox-required-modal-footer">
          <button 
            className="checkbox-required-modal-btn checkbox-required-modal-btn--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="checkbox-required-modal-btn checkbox-required-modal-btn--primary"
            onClick={onReconnect}
          >
            Conectarse Nuevamente
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckboxRequiredModal;

