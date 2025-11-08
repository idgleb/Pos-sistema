import React, { useState, useEffect } from 'react';
import { listGoogleDriveBackups, downloadBackupFromGoogleDrive } from '../../lib/googleDriveBackup';
import './GoogleDriveBackupsModal.css';

const GoogleDriveBackupsModal = ({ 
  isOpen, 
  onClose,
  onSelectBackup
}) => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadBackups();
    } else {
      // Limpiar estado al cerrar
      setBackups([]);
      setError(null);
    }
  }, [isOpen]);

  const loadBackups = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await listGoogleDriveBackups();
      
      if (result.success) {
        setBackups(result.backups || []);
      } else {
        setError(result.error || 'Error al cargar backups');
      }
    } catch (err) {
      setError(err.message || 'Error inesperado al cargar backups');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async (fileId) => {
    setDownloadingId(fileId);
    setError(null);
    
    try {
      const result = await downloadBackupFromGoogleDrive(fileId);
      
      if (result.success) {
        // Pasar los datos al componente padre
        onSelectBackup({
          backupInfo: result.backupInfo,
          data: result.data
        });
        onClose();
      } else {
        setError(result.error || 'Error al descargar backup');
      }
    } catch (err) {
      setError(err.message || 'Error inesperado al descargar backup');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="gdrive-backups-modal-overlay" onClick={onClose}></div>
      <div className="gdrive-backups-modal">
        <div className="gdrive-backups-modal-header">
          <h2 className="gdrive-backups-modal-title">📁 Backups en Google Drive</h2>
          <button 
            className="gdrive-backups-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        
        <div className="gdrive-backups-modal-body">
          {loading && (
            <div className="gdrive-backups-loading">
              <div className="gdrive-backups-spinner"></div>
              <p>Cargando backups...</p>
            </div>
          )}

          {error && (
            <div className="gdrive-backups-error">
              <span className="gdrive-backups-error-icon">⚠️</span>
              <p>{error}</p>
              <button 
                className="gdrive-backups-retry-btn"
                onClick={loadBackups}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && backups.length === 0 && (
            <div className="gdrive-backups-empty">
              <span className="gdrive-backups-empty-icon">📭</span>
              <p>No hay backups guardados en Google Drive</p>
              <p className="gdrive-backups-empty-hint">
                Guarda un backup desde el menú de Backup para verlo aquí
              </p>
            </div>
          )}

          {!loading && !error && backups.length > 0 && (
            <div className="gdrive-backups-list">
              {backups.map((backup) => (
                <div 
                  key={backup.id} 
                  className={`gdrive-backup-item ${downloadingId === backup.id ? 'gdrive-backup-item--loading' : ''}`}
                >
                  <div className="gdrive-backup-info">
                    <div className="gdrive-backup-name">
                      <span className="gdrive-backup-icon">💾</span>
                      {backup.name}
                    </div>
                    <div className="gdrive-backup-details">
                      <span className="gdrive-backup-date">
                        📅 {formatDate(backup.modifiedTime)}
                      </span>
                      <span className="gdrive-backup-size">
                        📦 {formatSize(backup.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="gdrive-backup-restore-btn"
                    onClick={() => handleDownloadBackup(backup.id)}
                    disabled={downloadingId !== null}
                  >
                    {downloadingId === backup.id ? (
                      <>
                        <span className="gdrive-backup-spinner-small"></span>
                        Descargando...
                      </>
                    ) : (
                      <>
                        <span>📥</span>
                        Restaurar
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="gdrive-backups-modal-footer">
          <button 
            className="gdrive-backups-modal-btn gdrive-backups-modal-btn-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>
          {!loading && backups.length > 0 && (
            <button 
              className="gdrive-backups-modal-btn gdrive-backups-modal-btn-primary"
              onClick={loadBackups}
            >
              🔄 Actualizar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GoogleDriveBackupsModal;

