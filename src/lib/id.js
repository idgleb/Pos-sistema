/**
 * Helper para generar IDs únicos simples
 */

/**
 * Genera un ID único basado en timestamp y número aleatorio
 * @returns {string} ID único
 */
export const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${randomPart}`;
};

/**
 * Genera un ID numérico simple
 * @returns {number} ID numérico único
 */
export const generateNumericId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Genera un UUID v4 (más complejo pero estándar)
 * @returns {string} UUID v4
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Genera un ID corto para uso en URLs o códigos
 * @param {number} length - Longitud del ID (por defecto 8)
 * @returns {string} ID corto
 */
export const generateShortId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


