/**
 * Sistema de backup en Google Drive
 * Usa Google Drive API v3
 */

// ✅ CONFIGURACIÓN: Client ID de Google Cloud Console
const CLIENT_ID = '642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Estado de autenticación
let isGapiInitialized = false;
let isSignedIn = false;
let gapiInitPromise = null;

/**
 * Cargar y inicializar la API de Google
 */
export const initGoogleDrive = () => {
  // Si ya está inicializado, devolver promesa existente
  if (gapiInitPromise) {
    return gapiInitPromise;
  }
  
  gapiInitPromise = new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.gapi && window.gapi.client) {
      if (isGapiInitialized) {
        resolve(true);
        return;
      }
    }
    
    // Verificar si el script ya está cargado
    const existingScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    
    const initGapi = async () => {
      return new Promise((resolveInit, rejectInit) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES,
              fetch_basic_profile: true,
              ux_mode: 'popup' // Forzar uso de popup en lugar de iframe
            });
            
            isGapiInitialized = true;
            
            try {
              // Intentar obtener la instancia de auth (puede fallar en algunos entornos)
              const authInstance = window.gapi.auth2.getAuthInstance();
              isSignedIn = authInstance.isSignedIn.get();
              
              // Escuchar cambios en el estado de autenticación
              authInstance.isSignedIn.listen((signedIn) => {
                isSignedIn = signedIn;
              });
            } catch (authError) {
              // Si falla la inicialización de auth2 (por ejemplo, iframe bloqueado),
              // no es crítico, solo significa que no podemos verificar el estado inicial
              console.warn('No se pudo inicializar auth2 (esto es normal en algunos entornos):', authError);
              isSignedIn = false;
            }
            
            resolveInit(true);
          } catch (error) {
            // Si el error es por iframe, continuar de todas formas (el popup funcionará)
            if (error.error === 'idpiframe_initialization_failed' || 
                error.message?.includes('idpiframe') ||
                error.details?.includes('idpiframe') ||
                error.details?.includes('Not a valid origin')) {
              console.warn('⚠️ Google API iframe falló (esto es normal). El popup funcionará correctamente cuando hagas clic en "Conectar Google Drive".');
              // Marcar como inicializado de todas formas para permitir que el popup funcione
              isGapiInitialized = true;
              isSignedIn = false;
              resolveInit(true);
            } else {
              console.error('Error inicializando Google API:', error);
              // Para otros errores, también intentamos continuar (el popup puede funcionar)
              isGapiInitialized = true;
              isSignedIn = false;
              resolveInit(true);
            }
          }
        });
      });
    };
    
    if (existingScript) {
      // Script ya existe, solo inicializar
      if (window.gapi) {
        initGapi().then(resolve).catch(reject);
      } else {
        // Esperar a que el script se cargue
        existingScript.onload = () => {
          initGapi().then(resolve).catch(reject);
        };
      }
      return;
    }
    
    // Cargar el script de GAPI
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGapi().then(resolve).catch(reject);
    };
    script.onerror = () => {
      reject(new Error('Error cargando Google API. Verifica tu conexión a internet.'));
    };
    document.head.appendChild(script);
  });
  
  return gapiInitPromise;
};

/**
 * Verificar si está inicializado
 */
export const isGoogleDriveReady = () => {
  return isGapiInitialized;
};

/**
 * Iniciar sesión con Google
 */
export const signInGoogle = async () => {
  try {
    if (!isGapiInitialized) {
      await initGoogleDrive();
    }
    
    // Verificar que gapi esté disponible
    if (!window.gapi) {
      throw new Error('Google API no está disponible. Recarga la página e intenta de nuevo.');
    }
    
    // Intentar obtener la instancia de auth2
    let authInstance;
    try {
      authInstance = window.gapi.auth2.getAuthInstance();
    } catch (authError) {
      console.warn('Auth2 no disponible inicialmente, intentando inicializar...', authError);
      authInstance = null;
    }
    
    // Si no hay instancia, intentar inicializar
    if (!authInstance) {
      try {
        // Esperar a que gapi.client esté listo
        if (!window.gapi.client) {
          await new Promise((resolve) => {
            if (window.gapi.client) {
              resolve();
            } else {
              window.gapi.load('client', resolve);
            }
          });
        }
        
        // Inicializar auth2 con popup mode
        await window.gapi.auth2.init({
          client_id: CLIENT_ID,
          scope: SCOPES,
          fetch_basic_profile: true
        });
        
        authInstance = window.gapi.auth2.getAuthInstance();
      } catch (initError) {
        console.warn('Error inicializando auth2, intentando método directo...', initError);
        // Último intento: crear instancia directamente
        try {
          if (window.gapi.auth2 && !window.gapi.auth2.getAuthInstance()) {
            await window.gapi.auth2.init({
              client_id: CLIENT_ID,
              scope: SCOPES
            });
          }
          authInstance = window.gapi.auth2.getAuthInstance();
        } catch (finalError) {
          console.error('No se pudo inicializar auth2 después de múltiples intentos:', finalError);
          // Continuar de todas formas, el popup puede funcionar con window.open
        }
      }
    }
    
    if (!authInstance) {
      return {
        success: false,
        error: 'No se pudo inicializar Google Auth. Por favor, verifica que https://idgleb.github.io esté registrado en Google Cloud Console y espera 15-30 minutos después de guardar los cambios. Luego recarga la página.'
      };
    }
    
    // Usar signIn (esto abrirá un popup automáticamente)
    const googleUser = await authInstance.signIn({
      prompt: 'select_account'
    });
    
    const profile = googleUser.getBasicProfile();
    isSignedIn = true;
    
    return {
      success: true,
      user: {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl()
      }
    };
  } catch (error) {
    console.error('Error en login:', error);
    
    // Manejar diferentes tipos de errores
    if (error.error === 'popup_closed_by_user' || error.error === 'popup_blocked') {
      return {
        success: false,
        cancelled: true,
        error: 'El popup fue bloqueado o cerrado. Por favor, permite popups para este sitio e intenta de nuevo.'
      };
    }
    
    if (error.error === 'access_denied' || error.status === 403) {
      return {
        success: false,
        error: 'Acceso denegado (403). Esto puede deberse a:\n\n1. La app está en modo "Testing" y tu email no está en la lista de testers\n2. La app no está publicada (debe estar "In production")\n3. Las URLs no están correctamente configuradas en Google Cloud Console\n\nSolución:\n- Ve a Google Cloud Console → OAuth consent screen\n- Agrega tu email como "Test user" (si está en Testing)\n- O publica la app cambiando el estado a "In production"\n- Verifica que https://idgleb.github.io esté en "Authorized JavaScript origins"'
      };
    }
    
    if (error.error === 'idpiframe_initialization_failed' || error.message?.includes('idpiframe')) {
      // Este error no debería impedir el login con popup
      return {
        success: false,
        error: 'Error de inicialización. Por favor, verifica que las URLs estén correctamente configuradas en Google Cloud Console e intenta de nuevo.'
      };
    }
    
    // Manejar errores 403 específicos
    if (error.status === 403 || error.error === 403 || error.message?.includes('403')) {
      return {
        success: false,
        error: 'Error 403: Acceso denegado. Verifica:\n\n1. Google Cloud Console → OAuth consent screen → Tu email está en "Test users"?\n2. La app está publicada ("In production")?\n3. Las URLs están correctas en "Authorized JavaScript origins"?\n\nEspera 15-30 minutos después de hacer cambios y recarga la página.'
      };
    }
    
    return {
      success: false,
      error: error.error || error.message || 'Error desconocido al iniciar sesión. Por favor, recarga la página e intenta de nuevo.'
    };
  }
};

/**
 * Cerrar sesión
 */
export const signOutGoogle = async () => {
  try {
    if (!isGapiInitialized) return { success: true };
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtener información del usuario
 */
export const getUserInfo = () => {
  if (!isSignedIn || !isGapiInitialized) return null;
  
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const profile = user.getBasicProfile();
    
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
  } catch (error) {
    return null;
  }
};

/**
 * Verificar si está conectado
 */
export const isConnectedToGoogleDrive = () => {
  return isSignedIn && isGapiInitialized;
};

/**
 * Crear o obtener carpeta de backups en Google Drive
 */
const getOrCreateBackupFolder = async () => {
  try {
    // Buscar carpeta existente
    const response = await window.gapi.client.drive.files.list({
      q: "name='POS Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name)',
      spaces: 'drive'
    });
    
    if (response.result.files.length > 0) {
      return response.result.files[0].id;
    }
    
    // Crear nueva carpeta
    const folderMetadata = {
      name: 'POS Backups',
      mimeType: 'application/vnd.google-apps.folder'
    };
    
    const folder = await window.gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });
    
    console.log('✅ Carpeta "POS Backups" creada en Google Drive');
    return folder.result.id;
    
  } catch (error) {
    console.error('Error obteniendo/creando carpeta:', error);
    throw error;
  }
};

/**
 * Subir backup a Google Drive
 */
export const uploadBackupToGoogleDrive = async (data) => {
  if (!isConnectedToGoogleDrive()) {
    return {
      success: false,
      error: 'No estás conectado a Google Drive'
    };
  }
  
  try {
    const folderId = await getOrCreateBackupFolder();
    
    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `pos-backup-${fecha}-${hora}.json`;
    
    const backupData = {
      ...data,
      _metadata: {
        backupDate: new Date().toISOString(),
        version: '1.0',
        appName: 'POS System',
        source: 'Google Drive'
      }
    };
    
    const fileContent = JSON.stringify(backupData, null, 2);
    const file = new Blob([fileContent], { type: 'application/json' });
    
    const metadata = {
      name: filename,
      mimeType: 'application/json',
      parents: [folderId]
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    const token = window.gapi.auth.getToken().access_token;
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body: form
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Backup subido a Google Drive:', filename);
      return {
        success: true,
        filename: filename,
        fileId: result.id
      };
    } else {
      throw new Error(result.error?.message || 'Error al subir archivo');
    }
    
  } catch (error) {
    console.error('Error subiendo backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Listar backups en Google Drive
 */
export const listGoogleDriveBackups = async () => {
  if (!isConnectedToGoogleDrive()) {
    return {
      success: false,
      error: 'No estás conectado a Google Drive'
    };
  }
  
  try {
    const folderId = await getOrCreateBackupFolder();
    
    const response = await window.gapi.client.drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/json' and trashed=false`,
      fields: 'files(id, name, createdTime, modifiedTime, size)',
      orderBy: 'modifiedTime desc',
      pageSize: 50
    });
    
    const backups = response.result.files.map(file => ({
      id: file.id,
      name: file.name,
      createdTime: new Date(file.createdTime),
      modifiedTime: new Date(file.modifiedTime),
      size: parseInt(file.size)
    }));
    
    return {
      success: true,
      backups: backups
    };
    
  } catch (error) {
    console.error('Error listando backups:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Descargar backup de Google Drive
 */
export const downloadBackupFromGoogleDrive = async (fileId) => {
  if (!isConnectedToGoogleDrive()) {
    return {
      success: false,
      error: 'No estás conectado a Google Drive'
    };
  }
  
  try {
    const response = await window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    
    const data = JSON.parse(response.body);
    
    const datosLimpios = { ...data };
    delete datosLimpios._metadata;
    
    return {
      success: true,
      data: datosLimpios,
      backupInfo: {
        fechaBackup: data._metadata?.backupDate 
          ? new Date(data._metadata.backupDate).toLocaleString('es-ES')
          : 'Desconocida',
        numProductos: data.products?.length || 0,
        numVentas: data.movements?.filter(m => m.type === 'sale').length || 0,
        numGastos: data.movements?.filter(m => m.type === 'expense').length || 0
      }
    };
    
  } catch (error) {
    console.error('Error descargando backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

