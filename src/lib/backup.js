/**
 * Sistema de Backup y Restauración
 * Permite exportar e importar datos de localStorage
 */

/**
 * Exportar backup de localStorage a archivo JSON
 * @returns {Promise<{success: boolean, filename?: string, error?: string}>}
 */
export const exportBackup = async () => {
  try {
    // Obtener datos de localStorage
    const datosString = localStorage.getItem('pos_state');
    
    if (!datosString) {
      return {
        success: false,
        error: 'No hay datos para exportar'
      };
    }
    
    const datos = JSON.parse(datosString);
    
    // Agregar metadatos al backup
    const backup = {
      ...datos,
      _metadata: {
        backupDate: new Date().toISOString(),
        version: '1.0',
        appName: 'POS System'
      }
    };
    
    // Crear nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `pos-backup-${fecha}-${hora}.json`;
    
    // Crear blob y descargar
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      filename
    };
    
  } catch (error) {
    console.error('Error exportando backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Seleccionar y validar archivo de backup
 * @returns {Promise<{success: boolean, backupInfo?: object, data?: object, error?: string}>}
 */
export const selectBackupFile = async () => {
  return new Promise((resolve) => {
    try {
      // Crear input file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        
        if (!file) {
          resolve({
            success: false,
            cancelled: true
          });
          return;
        }
        
        try {
          // Leer archivo
          const texto = await file.text();
          const datos = JSON.parse(texto);
          
          // Validar estructura básica
          if (!datos.products || !Array.isArray(datos.products)) {
            throw new Error('El archivo no es un backup válido del sistema POS');
          }
          
          // Preparar información para mostrar al usuario
          const metadata = datos._metadata || {};
          const fechaBackup = metadata.backupDate 
            ? new Date(metadata.backupDate).toLocaleString('es-ES')
            : 'Desconocida';
          
          const numProductos = datos.products?.length || 0;
          const numVentas = datos.movements?.filter(m => m.type === 'sale').length || 0;
          const numGastos = datos.movements?.filter(m => m.type === 'expense').length || 0;
          
          // Limpiar metadatos antes de guardar
          const datosLimpios = { ...datos };
          delete datosLimpios._metadata;
          
          resolve({
            success: true,
            backupInfo: {
              fechaBackup,
              numProductos,
              numVentas,
              numGastos
            },
            data: datosLimpios
          });
          
        } catch (error) {
          console.error('Error leyendo archivo:', error);
          resolve({
            success: false,
            error: 'Error al leer el archivo: ' + error.message
          });
        }
      };
      
      input.onerror = () => {
        resolve({
          success: false,
          error: 'Error al abrir el selector de archivos'
        });
      };
      
      // Abrir selector de archivos
      input.click();
      
    } catch (error) {
      console.error('Error en selectBackupFile:', error);
      resolve({
        success: false,
        error: error.message
      });
    }
  });
};

/**
 * Aplicar el backup restaurado
 * @param {object} data - Datos del backup
 * @returns {{success: boolean}}
 */
export const applyBackup = (data) => {
  try {
    localStorage.setItem('pos_state', JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.error('Error aplicando backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtener información sobre los datos actuales
 * @returns {object} Información de los datos
 */
export const getBackupInfo = () => {
  try {
    const datosString = localStorage.getItem('pos_state');
    
    if (!datosString) {
      return {
        hasData: false,
        message: 'No hay datos en el sistema'
      };
    }
    
    const datos = JSON.parse(datosString);
    
    return {
      hasData: true,
      products: datos.products?.length || 0,
      sales: datos.movements?.filter(m => m.type === 'sale').length || 0,
      expenses: datos.movements?.filter(m => m.type === 'expense').length || 0,
      totalMovements: datos.movements?.length || 0,
      sizeKB: Math.round(datosString.length / 1024)
    };
  } catch (error) {
    console.error('Error obteniendo info:', error);
    return {
      hasData: false,
      message: 'Error al leer los datos'
    };
  }
};

