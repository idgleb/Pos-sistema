import React from 'react';
import './BackupRestoreModal.css';

const BackupRestoreModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  backupInfo = {}
}) => {
  if (!isOpen) return null;

  const {
    fechaBackup = 'Desconocida',
    numProductos = 0,
    numVentas = 0,
    numGastos = 0
  } = backupInfo;

  return (
    <>
      <div className="backup-restore-modal-overlay" onClick={onClose}></div>
      <div className="backup-restore-modal">
        <div className="backup-restore-modal-header">
          <h2 className="backup-restore-modal-title">¿Desea restaurar este backup?</h2>
        </div>
        
        <div className="backup-restore-modal-body">
          <div className="backup-info-grid">
            <div className="backup-info-item">
              <span className="backup-info-icon">📅</span>
              <div className="backup-info-content">
                <div className="backup-info-label">Fecha del backup:</div>
                <div className="backup-info-value">{fechaBackup}</div>
              </div>
            </div>
            
            <div className="backup-info-item">
              <span className="backup-info-icon">📦</span>
              <div className="backup-info-content">
                <div className="backup-info-label">Productos:</div>
                <div className="backup-info-value">{numProductos}</div>
              </div>
            </div>
            
            <div className="backup-info-item">
              <span className="backup-info-icon">💰</span>
              <div className="backup-info-content">
                <div className="backup-info-label">Ventas registradas:</div>
                <div className="backup-info-value">{numVentas}</div>
              </div>
            </div>
            
            <div className="backup-info-item">
              <span className="backup-info-icon">💸</span>
              <div className="backup-info-content">
                <div className="backup-info-label">Gastos registrados:</div>
                <div className="backup-info-value">{numGastos}</div>
              </div>
            </div>
          </div>
          
          <div className="backup-warning">
            <span className="backup-warning-icon">⚠️</span>
            <div className="backup-warning-text">
              <strong>ADVERTENCIA:</strong> Esto sobrescribirá todos los datos actuales.
            </div>
          </div>
        </div>
        
        <div className="backup-restore-modal-footer">
          <button 
            className="backup-restore-btn backup-restore-btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="backup-restore-btn backup-restore-btn-confirm"
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </>
  );
};

export default BackupRestoreModal;

