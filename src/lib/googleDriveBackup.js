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
 * Iniciar sesión con Google usando Google Identity Services
 */
export const signInGoogle = async () => {
  try {
    // Cargar Google Identity Services
    await loadGoogleIdentityServices();
    
    // Inicializar gapi.client para operaciones de Drive
    if (!isGapiInitialized) {
      await initGoogleDrive();
    }
    
    // Verificar que gapi.client esté disponible para Drive API
    if (!window.gapi || !window.gapi.client) {
      await new Promise((resolve) => {
        if (window.gapi && window.gapi.client) {
          resolve();
        } else {
          window.gapi.load('client', resolve);
        }
      });
    }
    
    // Construir scopes explícitamente usando URLs completos (no abreviados)
    // IMPORTANTE: Usar URLs completos para evitar que Google ignore scopes
    const requestedScopes = 'https://www.googleapis.com/auth/drive.file openid email profile';
    
    console.log('🔵 Solicitando scopes:', requestedScopes);
    console.log('🔵 Client ID:', CLIENT_ID);
    
    // Verificar si hay estado guardado para determinar si es primera conexión
    const savedState = loadAuthState();
    const isFirstConnection = !savedState || !savedState.token;
    
    // Si es primera conexión, usar select_account consent para forzar consentimiento completo
    // Esto asegura que Google muestre todos los scopes solicitados desde la primera vez
    const useSelectAccount = isFirstConnection;
    const promptValue = useSelectAccount ? 'select_account consent' : 'consent';
    
    console.log(`🔵 Primera conexión: ${isFirstConnection}, usando prompt: ${promptValue}`);
    
    return new Promise((resolve, reject) => {
      let tokenClient = null;
      let accessToken = null;
      let userProfile = null;
      
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: requestedScopes,
        // CRÍTICO: include_granted_scopes: false evita mezclar con permisos viejos
        include_granted_scopes: false,
        callback: async (response) => {
          console.log('Callback de Google OAuth recibido:', response);
          
          if (response.error) {
            reject(new Error(response.error));
            return;
          }
          
          accessToken = response.access_token;
          
          // Verificar que el token incluya el scope de Drive
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
            
            // NO hacer retry automático porque el popup se bloqueará
            // El usuario debe hacer clic nuevamente después de revocar permisos
            const errorMsg = `🚫 SCOPE DE DRIVE NO OTORGADO\n\nEl scope de Google Drive está configurado correctamente en Google Cloud Console,\npero Google NO lo está otorgando porque está usando permisos anteriores en caché.\n\n✅ VERIFICACIÓN:\nEl scope "drive.file" YA está en "Data Access" de tu consola de OAuth.\nEl problema es que Google está usando permisos anteriores que no incluyen Drive.\n\n📌 SOLUCIÓN: Revocar permisos anteriores y hacer clic nuevamente\n\n1. Revoca permisos anteriores en tu cuenta de Google:\n   👉 https://myaccount.google.com/permissions\n   - Busca tu app "POS Sistema" o el Client ID\n   - Haz clic en "Remove access" o "Eliminar acceso"\n\n2. Limpia el localStorage de esta aplicación:\n   - Abre la consola del navegador (F12)\n   - Ejecuta: localStorage.clear()\n   - O usa una ventana de incógnito\n\n3. Espera 5-10 minutos para que Google actualice su caché\n\n4. Recarga la página completamente (Ctrl+F5)\n\n5. Haz clic en "Conectar Google Drive" NUEVAMENTE\n   (El popup debe abrirse en respuesta a tu clic, no automáticamente)\n\n📋 Scopes solicitados: ${requestedScopes}\n📋 Scopes recibidos: ${grantedScopes}\n\n💡 El scope está configurado correctamente. Necesitas revocar los permisos anteriores y hacer clic nuevamente para que Google otorgue el scope de Drive.`;
            console.error('❌', errorMsg);
            reject(new Error(errorMsg));
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
          
          // Guardar token y perfil
          currentAccessToken = accessToken;
          
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
            
            userProfile = {
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
            
            resolve({
              success: true,
              user: userProfile
            });
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
            
            resolve({
              success: true,
              user: currentUserProfile
            });
          }
        },
        error_callback: (error) => {
          console.error('Error callback de Google OAuth:', error);
          reject(error);
        }
      });
      
      // Generar un valor aleatorio para el parámetro state (protección CSRF)
      const stateValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Solicitar token con popup usando el prompt apropiado
      // IMPORTANTE: requestAccessToken() debe llamarse directamente en respuesta al gesto del usuario
      // NO usar setTimeout ni promesas antes de esta llamada
      console.log(`🔵 Solicitando token con prompt: ${promptValue}`);
      
      tokenClient.requestAccessToken({ 
        prompt: promptValue,
        state: stateValue,
        // CRÍTICO: No incluir scopes anteriores para evitar mezclar con permisos viejos
        include_granted_scopes: false
      });
    });
  } catch (error) {
    console.error('Error en login:', error);
    console.error('Error details:', {
      error: error.error,
      message: error.message,
      type: error.type,
      status: error.status,
      code: error.code,
      details: error.details,
      fullError: error
    });
    
    // Manejar diferentes tipos de errores
    if (error.error === 'popup_closed_by_user' || error.error === 'popup_blocked') {
      return {
        success: false,
        cancelled: true,
        error: 'El popup fue bloqueado o cerrado. Por favor, permite popups para este sitio e intenta de nuevo.'
      };
    }
    
    // Manejar error "server_error" - ocurre después de aceptar el consentimiento
    // Este error específicamente ocurre cuando el token falla después de aceptar el consentimiento
    if (error.error === 'server_error' || error.type === 'tokenFailed' || error.idpId === 'google') {
      return {
        success: false,
        error: '❌ Error: server_error (tokenFailed)\n\nEste error ocurre DESPUÉS de que aceptas el consentimiento. El token de autenticación falla.\n\n🔴 POSIBLES CAUSAS:\n\n1. Las URLs no están correctamente configuradas en "Authorized JavaScript origins"\n2. El Client ID no es correcto o no coincide\n3. La app no está verificada y Google está bloqueando el acceso\n4. Hay un problema con los scopes solicitados\n\n✅ SOLUCIÓN PASO A PASO:\n\n1. Verifica "Authorized JavaScript origins":\n   👉 https://console.cloud.google.com/apis/credentials\n   - Abre tu OAuth 2.0 Client ID\n   - Verifica que esté EXACTAMENTE:\n     • http://localhost:3000\n     • https://idgleb.github.io\n   - NO debe tener "/Pos-sistema" al final\n   - Guarda los cambios\n\n2. Verifica el Client ID:\n   - Debe ser: 642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com\n   - Verifica en: src/lib/googleDriveBackup.js línea 7\n\n3. Verifica que Google Drive API esté habilitada:\n   👉 https://console.cloud.google.com/apis/library/drive.googleapis.com\n\n4. Si la app no está verificada:\n   - Ve a: https://console.cloud.google.com/apis/credentials/consent\n   - Completa todos los campos requeridos\n   - Considera verificar la app si planeas usarla en producción\n\n5. Espera 15-30 minutos después de hacer cambios\n\n6. Limpia la caché del navegador (Ctrl+Shift+Delete)\n\n7. Recarga la página completamente (Ctrl+F5)\n\n8. Intenta conectar de nuevo'
      };
    }
    
    // Manejar errores 400 (Bad Request)
    if (error.status === 400 || error.error === 400 || error.code === 400) {
      return {
        success: false,
        error: 'Error 400: Solicitud incorrecta. Esto puede deberse a:\n\n1. El Client ID no es correcto o no existe\n2. Las URLs no están correctamente configuradas en Google Cloud Console\n3. El scope solicitado no está habilitado\n\nSolución:\n1. Verifica el Client ID en: https://console.cloud.google.com/apis/credentials\n2. Verifica que las URLs estén en "Authorized JavaScript origins":\n   - http://localhost:3000\n   - https://idgleb.github.io\n3. Verifica que Google Drive API esté habilitada\n4. Espera 15-30 minutos después de hacer cambios'
      };
    }
    
    // Manejar errores 403 (Forbidden)
    if (error.error === 'access_denied' || error.status === 403 || error.error === 403 || error.code === 403) {
      return {
        success: false,
        error: 'Error 403: Acceso denegado. Esto puede deberse a:\n\n1. La app está en modo "Testing" y tu email NO está en la lista de testers\n2. La app no está publicada (debe estar "In production")\n3. Las URLs no están correctamente configuradas en Google Cloud Console\n\nSolución:\n1. Ve a: https://console.cloud.google.com/apis/credentials/consent\n2. Si está en "Testing", agrega tu email como "Test user"\n3. O publica la app cambiando el estado a "In production"\n4. Verifica que estas URLs estén en "Authorized JavaScript origins":\n   - http://localhost:3000\n   - https://idgleb.github.io\n5. Espera 15-30 minutos después de hacer cambios\n6. Recarga la página completamente (Ctrl+F5)'
      };
    }
    
    if (error.error === 'idpiframe_initialization_failed' || error.message?.includes('idpiframe')) {
      // Este error no debería impedir el login con popup, pero si el popup también falla, mostramos el error
      return {
        success: false,
        error: 'Error de inicialización del iframe. El popup debería funcionar, pero si no aparece:\n\n1. Verifica que los popups no estén bloqueados\n2. Verifica que las URLs estén correctamente configuradas en Google Cloud Console\n3. Intenta en una ventana de incógnito'
      };
    }
    
    // Manejar errores de red
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      return {
        success: false,
        error: 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.'
      };
    }
    
    // Error genérico con detalles
    const errorMessage = error.error || error.message || error.type || 'Error desconocido';
    const errorDetails = error.details || error.code || '';
    
    return {
      success: false,
      error: `Error al iniciar sesión: ${errorMessage}${errorDetails ? `\n\nCódigo: ${errorDetails}` : ''}\n\nPosibles soluciones:\n1. Verifica que estés usando la URL correcta (http://localhost:3000 o https://idgleb.github.io)\n2. Verifica la configuración en Google Cloud Console\n3. Espera 15-30 minutos después de hacer cambios\n4. Recarga la página completamente (Ctrl+F5)\n5. Limpia la caché del navegador\n\nDetalles técnicos: ${JSON.stringify(error, null, 2)}`
    };
  }
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

