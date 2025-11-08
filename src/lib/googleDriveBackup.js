/**
 * Sistema de backup en Google Drive
 * Usa Google Drive API v3
 */

// ⚠️ CONFIGURACIÓN: Reemplaza esto con tu Client ID de Google Cloud Console
const CLIENT_ID = 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com';

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
    
    // Cargar el script de GAPI
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
          });
          
          isGapiInitialized = true;
          
          // Verificar estado inicial
          const authInstance = window.gapi.auth2.getAuthInstance();
          isSignedIn = authInstance.isSignedIn.get();
          
          // Escuchar cambios en el estado de autenticación
          authInstance.isSignedIn.listen((signedIn) => {
            isSignedIn = signedIn;
          });
          
          resolve(true);
        } catch (error) {
          console.error('Error inicializando Google API:', error);
          reject(error);
        }
      });
    };
    script.onerror = () => {
      reject(new Error('Error cargando Google API'));
    };
    document.body.appendChild(script);
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
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    
    const user = authInstance.currentUser.get();
    const profile = user.getBasicProfile();
    
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
    
    if (error.error === 'popup_closed_by_user') {
      return {
        success: false,
        cancelled: true
      };
    }
    
    return {
      success: false,
      error: error.error || error.message
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

