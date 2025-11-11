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
let currentAccessToken = null;
let currentUserProfile = null;

// Token Client de GIS (se inicializa una vez)
let tokenClient = null;
let isTokenClientInitialized = false;
let isClicking = false; // Debounce para evitar múltiples clicks

// Claves para localStorage
const STORAGE_KEY_TOKEN = 'pos_gdrive_token';
const STORAGE_KEY_PROFILE = 'pos_gdrive_profile';

/**
 * Guardar token y perfil en localStorage
 */
const saveAuthState = (token, profile) => {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    }
    if (profile) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    }
  } catch (error) {
    console.warn('Error guardando estado de autenticación:', error);
  }
};

/**
 * Cargar token y perfil desde localStorage
 */
const loadAuthState = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const profileStr = localStorage.getItem(STORAGE_KEY_PROFILE);
    
    if (token && profileStr) {
      currentAccessToken = token;
      currentUserProfile = JSON.parse(profileStr);
      isSignedIn = true;
      return { token, profile: currentUserProfile };
    }
  } catch (error) {
    console.warn('Error cargando estado de autenticación:', error);
  }
  return null;
};

/**
 * Limpiar estado de autenticación de localStorage
 */
const clearAuthState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
  } catch (error) {
    console.warn('Error limpiando estado de autenticación:', error);
  }
};

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
      return new Promise(async (resolveInit, rejectInit) => {
        // Solo cargar el cliente de Drive API, NO auth2 (usamos GIS para autenticación)
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              discoveryDocs: DISCOVERY_DOCS,
              // NO incluir clientId ni scope aquí - GIS maneja la autenticación
            });
            
            isGapiInitialized = true;
            
            // Intentar restaurar estado guardado
            const savedState = loadAuthState();
            if (savedState && savedState.token) {
              try {
                // Configurar el token en gapi.client
                window.gapi.client.setToken({ access_token: savedState.token });
                currentAccessToken = savedState.token;
                currentUserProfile = savedState.profile;
                
                // Esperar un momento para que gapi.client procese el token
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Verificar que el token sigue siendo válido haciendo una petición simple
                try {
                  await window.gapi.client.request({
                    path: 'https://www.googleapis.com/oauth2/v2/userinfo',
                    method: 'GET'
                  });
                  
                  // Token válido, restaurar estado
                  console.log('✅ Sesión de Google Drive restaurada');
                  isSignedIn = true;
                } catch (tokenError) {
                  // Token inválido o expirado, limpiar estado
                  console.warn('Token expirado o inválido, limpiando estado');
                  clearAuthState();
                  currentAccessToken = null;
                  currentUserProfile = null;
                  isSignedIn = false;
                }
              } catch (restoreError) {
                console.warn('Error restaurando sesión:', restoreError);
                clearAuthState();
                currentAccessToken = null;
                currentUserProfile = null;
                isSignedIn = false;
              }
            }
            
            resolveInit(true);
          } catch (error) {
            console.debug('⚠️ Error inicializando gapi.client (esto es normal). El popup funcionará correctamente cuando hagas clic en "Conectar Google Drive".');
            // Marcar como inicializado de todas formas para permitir que el popup funcione
            isGapiInitialized = true;
            
            // Intentar restaurar estado guardado incluso si falla
            const savedState = loadAuthState();
            if (savedState && savedState.token) {
              try {
                if (window.gapi && window.gapi.client) {
                  window.gapi.client.setToken({ access_token: savedState.token });
                  currentAccessToken = savedState.token;
                  currentUserProfile = savedState.profile;
                  await new Promise(resolve => setTimeout(resolve, 100));
                  console.log('✅ Sesión de Google Drive restaurada');
                  isSignedIn = true;
                }
              } catch (restoreError) {
                console.warn('Error restaurando sesión:', restoreError);
              }
            }
            
            resolveInit(true);
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
 * Cargar Google Identity Services (nueva API)
 */
const loadGoogleIdentityServices = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        resolve();
      } else {
        reject(new Error('Google Identity Services no se cargó correctamente'));
      }
    };
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services'));
    document.head.appendChild(script);
  });
};

/**
 * Inicializar Token Client de GIS (síncrono, se llama una vez)
 */
const initTokenClient = () => {
  if (isTokenClientInitialized && tokenClient) {
    return;
  }
  
  if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    console.error('Google Identity Services no está cargado');
    return;
  }
  
  const requestedScopes = 'https://www.googleapis.com/auth/drive.file openid email profile';
  
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: requestedScopes,
    prompt: 'select_account consent', // Fuerza selección de cuenta y pantalla de consentimiento
    include_granted_scopes: false, // CRÍTICO: NO mezclar con grants viejos
    callback: async (response) => {
      isClicking = false; // Liberar debounce
      
      console.log('Callback de Google OAuth recibido:', response);
      
      if (response.error) {
        console.error('Error en callback:', response.error);
        const errorMsg = response.error === 'popup_closed_by_user' || response.error === 'popup_blocked' 
          ? 'El popup fue bloqueado o cerrado. Por favor, permite popups para este sitio e intenta de nuevo.'
          : `Error al conectar con Google Drive: ${response.error}`;
        window.dispatchEvent(new CustomEvent('googleDriveError', { detail: { error: errorMsg } }));
        return;
      }
      
      const grantedScopes = response.scope || '';
      console.log('🔵 Verificando scopes recibidos:', grantedScopes);
      
      // Verificación robusta del scope de Drive
      const hasDriveScope = grantedScopes.includes('drive.file') || 
                            grantedScopes.includes('https://www.googleapis.com/auth/drive.file') ||
                            grantedScopes.includes('drive');
      
      if (!hasDriveScope) {
        // Limpiar estado guardado para forzar nueva autenticación
        clearAuthState();
        currentAccessToken = null;
        currentUserProfile = null;
        isSignedIn = false;
        
        const errorMsg = `🚫 SCOPE DE DRIVE NO OTORGADO\n\nGoogle no otorgó el scope "drive.file".\n\n📌 VERIFICAR EN GOOGLE CLOUD CONSOLE:\n\n1. Ve a: https://console.cloud.google.com/apis/credentials/consent\n2. Asegúrate de que "Google Drive API" esté HABILITADO en:\n   - APIs & Services > Library > Google Drive API (debe estar "Enabled")\n\n3. En "OAuth consent screen" > "Scopes":\n   - Debe aparecer: "https://www.googleapis.com/auth/drive.file"\n   - Si NO aparece, haz clic en "ADD OR REMOVE SCOPES"\n   - Busca "Google Drive API"\n   - Marca: "https://www.googleapis.com/auth/drive.file"\n   - Guarda los cambios\n\n4. Si la app está en "Testing", asegúrate de que tu cuenta esté en "Test users"\n\n5. Si la app está en "Production", puede tomar hasta 7 días para que los cambios se aprueben\n\n📌 DESPUÉS DE VERIFICAR:\n1. Revoca permisos anteriores: https://myaccount.google.com/permissions\n2. Limpia localStorage: localStorage.clear()\n3. Espera 10-15 minutos para que Google actualice su caché\n4. Recarga la página completamente (Ctrl+F5)\n5. Haz clic en "Conectar Google Drive" NUEVAMENTE\n\n📋 Scopes solicitados: ${requestedScopes}\n📋 Scopes recibidos: ${grantedScopes}`;
        console.error('❌', errorMsg);
        
        // Disparar evento de error para notificar al componente React
        window.dispatchEvent(new CustomEvent('googleDriveError', { detail: { error: errorMsg } }));
        return;
      }
      
      console.log('✅ Token incluye scope de Google Drive:', grantedScopes);
      
      // Verificación adicional usando google.accounts.oauth2.getToken()
      try {
        const tokenCheck = window.google?.accounts?.oauth2?.getToken?.();
        if (tokenCheck && tokenCheck.scope) {
          const tokenScopes = tokenCheck.scope;
          const hasDriveInToken = tokenScopes.includes('drive.file') || 
                                 tokenScopes.includes('https://www.googleapis.com/auth/drive.file') ||
                                 tokenScopes.includes('drive');
          if (!hasDriveInToken) {
            throw new Error('El token obtenido no incluye el scope de Drive');
          }
          console.log('✅ Verificación adicional del token exitosa:', tokenScopes);
        }
      } catch (tokenCheckError) {
        console.warn('Advertencia al verificar token:', tokenCheckError);
      }
      
      const accessToken = response.access_token;
      
      // Guardar token
      currentAccessToken = accessToken;
      
      // Inicializar gapi.client para operaciones de Drive (asíncrono, pero después del token)
      initGoogleDrive().then(async () => {
        // Usar el token para inicializar gapi.client
        window.gapi.client.setToken({ access_token: accessToken });
        
        // Esperar un momento para que gapi.client procese el token completamente
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Obtener información del perfil usando el token
        try {
          const profileResponse = await window.gapi.client.request({
            path: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'GET'
          });
          
          const userProfile = {
            id: profileResponse.result.id,
            name: profileResponse.result.name,
            email: profileResponse.result.email,
            imageUrl: profileResponse.result.picture
          };
          
          // Guardar perfil
          currentUserProfile = userProfile;
          isSignedIn = true;
          
          // Guardar en localStorage
          saveAuthState(accessToken, userProfile);
          
          console.log('✅ Conexión exitosa:', userProfile);
          
          // Disparar evento personalizado para notificar al componente React
          window.dispatchEvent(new CustomEvent('googleDriveConnected', { detail: { user: userProfile } }));
        } catch (profileError) {
          console.warn('No se pudo obtener el perfil completo, usando información básica');
          // Si falla obtener el perfil, al menos tenemos el token
          currentUserProfile = {
            id: 'unknown',
            name: 'Usuario de Google',
            email: 'usuario@google.com',
            imageUrl: null
          };
          isSignedIn = true;
          
          // Guardar en localStorage
          saveAuthState(accessToken, currentUserProfile);
          
          window.dispatchEvent(new CustomEvent('googleDriveConnected', { detail: { user: currentUserProfile } }));
        }
      }).catch(error => {
        console.error('Error inicializando gapi.client:', error);
      });
    },
    error_callback: (error) => {
      isClicking = false; // Liberar debounce
      console.error('Error callback de Google OAuth:', error);
      
      // Disparar evento de error para notificar al componente React
      const errorMessage = error.message || error.error || 'Error desconocido al conectar con Google Drive';
      window.dispatchEvent(new CustomEvent('googleDriveError', { detail: { error: errorMessage } }));
    }
  });
  
  isTokenClientInitialized = true;
};

/**
 * Inicializar GIS al cargar la aplicación (se llama una vez al inicio)
 */
export const initializeGoogleIdentityServices = async () => {
  try {
    // Cargar Google Identity Services si no está cargado
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      await loadGoogleIdentityServices();
    }
    
    // Inicializar tokenClient (síncrono, se hace una vez)
    initTokenClient();
    
    console.log('✅ Google Identity Services inicializado');
    return true;
  } catch (error) {
    console.error('Error inicializando Google Identity Services:', error);
    return false;
  }
};

/**
 * Iniciar sesión con Google usando Google Identity Services
 * IMPORTANTE: Esta función debe llamarse directamente desde el handler del click
 * NO debe tener awaits antes de requestAccessToken()
 * 
 * Esta función retorna una Promise que se resuelve cuando se completa la conexión
 */
export const signInGoogle = () => {
  return new Promise((resolve, reject) => {
    // Debounce: evitar múltiples clicks
    if (isClicking) {
      console.warn('Ya hay una solicitud de conexión en proceso');
      reject({
        success: false,
        error: 'Ya hay una solicitud de conexión en proceso'
      });
      return;
    }
    
    // Verificar que GIS esté cargado
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      reject({
        success: false,
        error: 'Google Identity Services no está cargado. Por favor, recarga la página.'
      });
      return;
    }
    
    // Verificar que tokenClient esté inicializado
    if (!tokenClient) {
      initTokenClient();
      if (!tokenClient) {
        reject({
          success: false,
          error: 'No se pudo inicializar el cliente de token'
        });
        return;
      }
    }
    
    // Configurar listener para el evento de conexión exitosa
    const handleConnection = (event) => {
      window.removeEventListener('googleDriveConnected', handleConnection);
      window.removeEventListener('googleDriveError', handleError);
      resolve({
        success: true,
        user: event.detail.user
      });
    };
    
    const handleError = (event) => {
      window.removeEventListener('googleDriveConnected', handleConnection);
      window.removeEventListener('googleDriveError', handleError);
      reject({
        success: false,
        error: event.detail.error
      });
    };
    
    window.addEventListener('googleDriveConnected', handleConnection);
    window.addEventListener('googleDriveError', handleError);
    
    // Marcar que estamos haciendo click (debounce)
    isClicking = true;
    
    // Revocar token anterior si existe (para forzar nuevo consentimiento)
    try {
      const existingToken = window.google?.accounts?.oauth2?.getToken?.();
      if (existingToken && existingToken.access_token) {
        console.log('🔵 Revocando token anterior para forzar nuevo consentimiento...');
        window.google.accounts.oauth2.revoke(existingToken.access_token, () => {
          console.log('✅ Token anterior revocado');
        });
      }
    } catch (revokeError) {
      console.warn('No se pudo revocar token anterior (puede que no exista):', revokeError);
    }
    
    // Generar un valor aleatorio para el parámetro state (protección CSRF)
    const stateValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // CRÍTICO: requestAccessToken() debe llamarse DIRECTAMENTE en respuesta al gesto del usuario
    // NO usar setTimeout ni promesas antes de esta llamada
    console.log('🔵 Solicitando token con prompt: select_account consent');
    
    // Llamar directamente sin ningún await antes
    tokenClient.requestAccessToken({ 
      prompt: 'select_account consent', // Fuerza selección de cuenta y pantalla de consentimiento
      state: stateValue,
      // CRÍTICO: No incluir scopes anteriores para evitar mezclar con permisos viejos
      include_granted_scopes: false
    });
  });
};

/**
 * Cerrar sesión
 */
export const signOutGoogle = async () => {
  try {
    // Revocar token usando Google Identity Services
    if (currentAccessToken && window.google && window.google.accounts) {
      try {
        window.google.accounts.oauth2.revoke(currentAccessToken);
      } catch (revokeError) {
        console.warn('Error revocando token:', revokeError);
      }
    }
    
    // Limpiar estado
    currentAccessToken = null;
    currentUserProfile = null;
    isSignedIn = false;
    
    // Limpiar de localStorage
    clearAuthState();
    
    // Limpiar token de gapi.client
    if (window.gapi && window.gapi.client) {
      window.gapi.client.setToken(null);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    // Limpiar estado de todas formas
    currentAccessToken = null;
    currentUserProfile = null;
    isSignedIn = false;
    clearAuthState();
    return {
      success: true, // Consideramos exitoso aunque haya error al revocar
      error: error.message
    };
  }
};

/**
 * Obtener información del usuario
 */
export const getUserInfo = () => {
  if (!isSignedIn || !currentUserProfile) return null;
  return currentUserProfile;
};

/**
 * Verificar si está conectado
 */
export const isConnectedToGoogleDrive = () => {
  return isSignedIn && isGapiInitialized;
};

/**
 * Verificar que el token actual incluye el scope de Drive
 */
const verifyDriveScope = () => {
  try {
    // Obtener token actual de Google Identity Services
    const tokenResponse = window.google?.accounts?.oauth2?.getToken?.();
    if (!tokenResponse || !tokenResponse.access_token) {
      throw new Error('No hay token de acceso disponible');
    }
    
    // Verificar scope
    const grantedScopes = tokenResponse.scope || '';
    const hasDriveScope = grantedScopes.includes('drive.file') || 
                          grantedScopes.includes('https://www.googleapis.com/auth/drive.file') ||
                          grantedScopes.includes('drive');
    
    if (!hasDriveScope) {
      throw new Error('El token actual no incluye el scope de Google Drive. Por favor, reconecta tu cuenta.');
    }
    
    return true;
  } catch (error) {
    console.error('Error verificando scope de Drive:', error);
    throw error;
  }
};

/**
 * Crear o obtener carpeta de backups en Google Drive
 */
const getOrCreateBackupFolder = async () => {
  try {
    // Verificar que el token incluye el scope de Drive antes de usar la API
    verifyDriveScope();
    
    // Asegurarse de que el token esté configurado en gapi.client
    const token = currentAccessToken || (window.gapi.client.getToken()?.access_token);
    if (token && !window.gapi.client.getToken()) {
      window.gapi.client.setToken({ access_token: token });
      // Esperar un momento para que gapi.client procese el token
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verificar que tenemos un token válido
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }
    
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
    
    // Verificar si el error es por falta de scope
    const errorMessage = error.body || error.message || JSON.stringify(error);
    const isInsufficientScope = error.status === 403 && (
      errorMessage.includes('insufficient authentication scopes') ||
      errorMessage.includes('insufficient_scope') ||
      errorMessage.includes('Request had insufficient authentication scopes')
    );
    
    if (isInsufficientScope) {
      console.error('❌ Error: El token no tiene el scope de Google Drive necesario.');
      console.error('❌ Por favor, desconecta y vuelve a conectar para solicitar los permisos correctos.');
      throw new Error('El token no tiene permisos de Google Drive. Por favor, desconecta y vuelve a conectar.');
    }
    
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
    
    const token = currentAccessToken || (window.gapi.client.getToken()?.access_token);
    
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }
    
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

