import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { exportBackup, selectBackupFile, applyBackup } from '../lib/backup';
import {
  initGoogleDrive,
  isConnectedToGoogleDrive,
  signInGoogle,
  signOutGoogle,
  getUserInfo,
  uploadBackupToGoogleDrive
} from '../lib/googleDriveBackup';
import InfoModal from './ui/InfoModal';
import BackupRestoreModal from './ui/BackupRestoreModal';
import GoogleDriveBackupsModal from './ui/GoogleDriveBackupsModal';
import CheckboxRequiredModal from './ui/CheckboxRequiredModal';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBackupDropdownOpen, setIsBackupDropdownOpen] = useState(false);
  const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const legalDropdownRef = useRef(null);
  
  // Estados para modales
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'success',
    isLoading: false
  });
  
  const [restoreModal, setRestoreModal] = useState({
    isOpen: false,
    backupInfo: {},
    backupData: null
  });
  
  const [googleDriveBackupsModal, setGoogleDriveBackupsModal] = useState({
    isOpen: false
  });
  
  // Estado de Google Drive
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [isLoadingGoogleDrive, setIsLoadingGoogleDrive] = useState(false);
  
  // Estado para modal de checkbox requerido
  const [checkboxRequiredModal, setCheckboxRequiredModal] = useState({
    isOpen: false
  });
  
  // Inicializar Google Drive API
  useEffect(() => {
    initGoogleDrive().then(() => {
      const connected = isConnectedToGoogleDrive();
      setIsGoogleDriveConnected(connected);
      if (connected) {
        setGoogleUser(getUserInfo());
      }
    }).catch(error => {
      console.error('Error inicializando Google Drive:', error);
    });
  }, []);
  
  // Escuchar evento de checkbox requerido
  useEffect(() => {
    const handleCheckboxRequired = (event) => {
      console.log('⚠️ Checkbox de Google Drive no marcado:', event.detail);
      setCheckboxRequiredModal({ isOpen: true });
    };
    
    window.addEventListener('googleDriveCheckboxRequired', handleCheckboxRequired);
    
    return () => {
      window.removeEventListener('googleDriveCheckboxRequired', handleCheckboxRequired);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'POS', icon: '🛒' },
    { path: '/gastos', label: 'Gastos', icon: '💰' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/movimientos', label: 'Movimientos', icon: '📋' },
    { path: '/productos', label: 'Productos', icon: '📦' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleBackupDropdown = () => {
    setIsBackupDropdownOpen(!isBackupDropdownOpen);
  };

  const closeBackupDropdown = () => {
    setIsBackupDropdownOpen(false);
  };

  const toggleLegalDropdown = () => {
    setIsLegalDropdownOpen(!isLegalDropdownOpen);
  };

  const closeLegalDropdown = () => {
    setIsLegalDropdownOpen(false);
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeBackupDropdown();
      }
      if (legalDropdownRef.current && !legalDropdownRef.current.contains(event.target)) {
        closeLegalDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cerrar modales
  const closeInfoModal = () => {
    setInfoModal({ ...infoModal, isOpen: false });
  };
  
  const closeRestoreModal = () => {
    setRestoreModal({ ...restoreModal, isOpen: false });
  };

  // Manejar exportación de backup
  const handleExportBackup = async () => {
    closeBackupDropdown();
    
    const result = await exportBackup();
    
    if (result.success) {
      setInfoModal({
        isOpen: true,
        title: 'Backup creado exitosamente!',
        message: `Archivo: ${result.filename}\n\nEl archivo se ha guardado en tu carpeta de Descargas.`,
        variant: 'success'
      });
    } else {
      setInfoModal({
        isOpen: true,
        title: 'Error al crear backup',
        message: result.error,
        variant: 'error'
      });
    }
  };

  // Manejar importación de backup
  const handleImportBackup = async () => {
    closeBackupDropdown();
    
    const result = await selectBackupFile();
    
    if (result.success) {
      // Mostrar modal de confirmación con info del backup
      setRestoreModal({
        isOpen: true,
        backupInfo: result.backupInfo,
        backupData: result.data
      });
    } else if (result.error && !result.cancelled) {
      setInfoModal({
        isOpen: true,
        title: 'Error al leer backup',
        message: result.error,
        variant: 'error'
      });
    }
  };
  
  // Confirmar restauración de backup
  const handleConfirmRestore = () => {
    const applyResult = applyBackup(restoreModal.backupData);
    closeRestoreModal();
    
    if (applyResult.success) {
      setInfoModal({
        isOpen: true,
        title: 'Backup restaurado exitosamente!',
        message: 'La página se recargará para aplicar los cambios.',
        variant: 'success'
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setInfoModal({
        isOpen: true,
        title: 'Error al aplicar backup',
        message: applyResult.error,
        variant: 'error'
      });
    }
  };
  
  // Conectar/Desconectar Google Drive
  const handleGoogleDriveConnect = async () => {
    closeBackupDropdown();
    
    if (isGoogleDriveConnected) {
      // Desconectar
      const result = await signOutGoogle();
      if (result.success) {
        setIsGoogleDriveConnected(false);
        setGoogleUser(null);
        setInfoModal({
          isOpen: true,
          title: 'Sesión cerrada',
          message: 'Te has desconectado de Google Drive',
          variant: 'info'
        });
      }
    } else {
      // Conectar
      const result = await signInGoogle();
      if (result.success) {
        setIsGoogleDriveConnected(true);
        setGoogleUser(result.user);
        setInfoModal({
          isOpen: true,
          title: 'Conectado a Google Drive',
          message: `Bienvenido, ${result.user.name}!\n\nAhora puedes guardar backups en la nube.`,
          variant: 'success'
        });
      } else if (!result.cancelled) {
        // Mostrar error detallado
        const errorMessage = result.error || 'No se pudo conectar a Google Drive';
        setInfoModal({
          isOpen: true,
          title: 'Error al conectar con Google Drive',
          message: errorMessage,
          variant: 'error'
        });
      }
    }
  };
  
  // Cerrar modal de checkbox requerido
  const closeCheckboxRequiredModal = () => {
    setCheckboxRequiredModal({ isOpen: false });
  };
  
  // Reconectar a Google Drive (después de que el usuario marque el checkbox)
  const handleReconnectGoogleDrive = async () => {
    closeCheckboxRequiredModal();
    
    // Limpiar localStorage para forzar nueva autenticación
    try {
      localStorage.removeItem('pos_gdrive_token');
      localStorage.removeItem('pos_gdrive_profile');
    } catch (error) {
      console.warn('Error limpiando localStorage:', error);
    }
    
    // Esperar un momento antes de reconectar
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Reconectar
    setIsLoadingGoogleDrive(true);
    try {
      const result = await signInGoogle();
      if (result.success) {
        setIsGoogleDriveConnected(true);
        setGoogleUser(result.user);
        setInfoModal({
          isOpen: true,
          title: '✅ Conectado correctamente',
          message: `Bienvenido, ${result.user.name}!\n\nAhora puedes guardar backups en Google Drive.`,
          variant: 'success',
          isLoading: false
        });
      } else if (!result.cancelled) {
        const errorMessage = result.error || 'No se pudo conectar a Google Drive';
        setInfoModal({
          isOpen: true,
          title: 'Error al conectar',
          message: errorMessage,
          variant: 'error',
          isLoading: false
        });
      }
    } catch (error) {
      setInfoModal({
        isOpen: true,
        title: 'Error al conectar',
        message: error.message || 'Ocurrió un error al conectar con Google Drive.',
        variant: 'error',
        isLoading: false
      });
    } finally {
      setIsLoadingGoogleDrive(false);
    }
  };
  
  // Guardar backup en Google Drive
  const handleSaveToGoogleDrive = async () => {
    closeBackupDropdown();
    
    if (!isGoogleDriveConnected) {
      setInfoModal({
        isOpen: true,
        title: 'No conectado',
        message: 'Primero debes conectarte a Google Drive',
        variant: 'warning'
      });
      return;
    }
    
    // MOSTRAR MODAL INMEDIATAMENTE con estado de carga
    setInfoModal({
      isOpen: true,
      title: 'Guardando backup',
      message: 'Guardando backup en Google Drive...\n\nPor favor, espera. Esto puede tardar unos momentos.',
      variant: 'info',
      isLoading: true
    });
    
    setIsLoadingGoogleDrive(true);
    
    try {
      const data = JSON.parse(localStorage.getItem('pos_state') || '{}');
      const result = await uploadBackupToGoogleDrive(data);
      
      // ACTUALIZAR MODAL con el resultado
      if (result.success) {
        setInfoModal({
          isOpen: true,
          title: '✅ Backup guardado',
          message: `El backup "${result.filename}" se guardó correctamente en la carpeta "POS Backups" de tu Google Drive.`,
          variant: 'success',
          isLoading: false
        });
      } else {
        setInfoModal({
          isOpen: true,
          title: '❌ Error al guardar',
          message: result.error || 'No se pudo guardar el backup en Google Drive.',
          variant: 'error',
          isLoading: false
        });
      }
    } catch (error) {
      setInfoModal({
        isOpen: true,
        title: '❌ Error al guardar',
        message: error.message || 'Ocurrió un error al guardar el backup en Google Drive.',
        variant: 'error',
        isLoading: false
      });
    } finally {
      setIsLoadingGoogleDrive(false);
    }
  };

  // Abrir modal de backups de Google Drive
  const handleRestoreFromGoogleDrive = () => {
    closeBackupDropdown();
    
    if (!isGoogleDriveConnected) {
      setInfoModal({
        isOpen: true,
        title: 'No conectado',
        message: 'Primero debes conectarte a Google Drive',
        variant: 'warning'
      });
      return;
    }
    
    setGoogleDriveBackupsModal({ isOpen: true });
  };

  // Cerrar modal de backups de Google Drive
  const closeGoogleDriveBackupsModal = () => {
    setGoogleDriveBackupsModal({ isOpen: false });
  };

  // Manejar selección de backup desde Google Drive
  const handleSelectGoogleDriveBackup = (backupData) => {
    // Mostrar modal de confirmación con info del backup
    setRestoreModal({
      isOpen: true,
      backupInfo: backupData.backupInfo,
      backupData: backupData.data
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">POS System</h1>
        </div>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu--open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </Link>
          ))}
          
          {/* Botón de Backup con Dropdown */}
          <div className="navbar-backup-container" ref={dropdownRef}>
            <button
              className={`navbar-backup-btn ${isBackupDropdownOpen ? 'navbar-backup-btn--open' : ''}`}
              onClick={toggleBackupDropdown}
              aria-label="Backup"
            >
              <span className="navbar-icon">💾</span>
              <span className="navbar-label">Backup</span>
              <span className="navbar-dropdown-arrow">{isBackupDropdownOpen ? '▲' : '▼'}</span>
            </button>
            
            {isBackupDropdownOpen && (
              <div className="navbar-backup-dropdown">
                <button
                  className="navbar-backup-dropdown-item"
                  onClick={handleExportBackup}
                >
                  <span className="navbar-dropdown-icon">💾</span>
                  <span className="navbar-dropdown-text">Crear Backup Local</span>
                </button>
                <button
                  className="navbar-backup-dropdown-item"
                  onClick={handleImportBackup}
                >
                  <span className="navbar-dropdown-icon">📥</span>
                  <span className="navbar-dropdown-text">Restaurar Backup</span>
                </button>
                
                <div className="navbar-backup-divider"></div>
                
                {isGoogleDriveConnected ? (
                  <>
                    <div className="navbar-backup-user-info">
                      {googleUser?.imageUrl && (
                        <img 
                          src={googleUser.imageUrl} 
                          alt={googleUser.name}
                          className="navbar-user-avatar"
                        />
                      )}
                      <div className="navbar-user-details">
                        <span className="navbar-user-name">{googleUser?.name}</span>
                        <span className="navbar-user-email">{googleUser?.email}</span>
                      </div>
                    </div>
                    
                    <button
                      className="navbar-backup-dropdown-item"
                      onClick={handleSaveToGoogleDrive}
                      disabled={isLoadingGoogleDrive}
                    >
                      <span className="navbar-dropdown-icon">
                        {isLoadingGoogleDrive ? '⏳' : '☁️'}
                      </span>
                      <span className="navbar-dropdown-text">
                        {isLoadingGoogleDrive ? 'Guardando...' : 'Guardar en Google Drive'}
                      </span>
                    </button>
                    
                    <button
                      className="navbar-backup-dropdown-item"
                      onClick={handleRestoreFromGoogleDrive}
                    >
                      <span className="navbar-dropdown-icon">📥</span>
                      <span className="navbar-dropdown-text">Restaurar desde Google Drive</span>
                    </button>
                    
                    <button
                      className="navbar-backup-dropdown-item"
                      onClick={handleGoogleDriveConnect}
                    >
                      <span className="navbar-dropdown-icon">🚪</span>
                      <span className="navbar-dropdown-text">Desconectar Google Drive</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="navbar-backup-dropdown-item navbar-backup-dropdown-item-google"
                    onClick={handleGoogleDriveConnect}
                  >
                    <span className="navbar-dropdown-icon">☁️</span>
                    <span className="navbar-dropdown-text">Conectar Google Drive</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Botón de Enlaces Legales con Dropdown */}
          <div className="navbar-legal-container" ref={legalDropdownRef}>
            <button
              className={`navbar-legal-btn ${isLegalDropdownOpen ? 'navbar-legal-btn--open' : ''}`}
              onClick={toggleLegalDropdown}
              aria-label="Enlaces legales"
            >
              <span className="navbar-icon">ℹ️</span>
              <span className="navbar-label">Info</span>
              <span className="navbar-dropdown-arrow">{isLegalDropdownOpen ? '▲' : '▼'}</span>
            </button>
            
            {isLegalDropdownOpen && (
              <div className="navbar-legal-dropdown">
                <a
                  href="https://idgleb.github.io/Pos-sistema/home.html"
                  className="navbar-legal-dropdown-item"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeLegalDropdown}
            >
                  <span className="navbar-dropdown-icon">🏠</span>
                  <span className="navbar-dropdown-text">Home</span>
                </a>
                <a
                  href="https://idgleb.github.io/privacy.html"
                  className="navbar-legal-dropdown-item"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeLegalDropdown}
                >
                  <span className="navbar-dropdown-icon">📄</span>
                  <span className="navbar-dropdown-text">Privacidad</span>
                </a>
                <a
                  href="https://idgleb.github.io/terms.html"
                  className="navbar-legal-dropdown-item"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeLegalDropdown}
                >
                  <span className="navbar-dropdown-icon">📋</span>
                  <span className="navbar-dropdown-text">Términos</span>
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="navbar-mobile-toggle">
          <button 
            className={`navbar-toggle-btn ${isMobileMenuOpen ? 'navbar-toggle-btn--open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="navbar-toggle-icon">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Modales */}
      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={closeInfoModal}
        title={infoModal.title}
        message={infoModal.message}
        variant={infoModal.variant}
        isLoading={infoModal.isLoading}
      />
      
      <BackupRestoreModal
        isOpen={restoreModal.isOpen}
        onClose={closeRestoreModal}
        onConfirm={handleConfirmRestore}
        backupInfo={restoreModal.backupInfo}
      />
      
      <GoogleDriveBackupsModal
        isOpen={googleDriveBackupsModal.isOpen}
        onClose={closeGoogleDriveBackupsModal}
        onSelectBackup={handleSelectGoogleDriveBackup}
      />
      
      <CheckboxRequiredModal
        isOpen={checkboxRequiredModal.isOpen}
        onClose={closeCheckboxRequiredModal}
        onReconnect={handleReconnectGoogleDrive}
      />
    </nav>
  );
};

export default Navbar;
