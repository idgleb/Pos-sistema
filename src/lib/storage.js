/**
 * Helpers para localStorage con manejo de JSON
 */

/**
 * Obtiene un valor del localStorage y lo parsea como JSON
 * @param {string} key - Clave del localStorage
 * @param {*} defaultValue - Valor por defecto si no existe o hay error
 * @returns {*} Valor parseado o valor por defecto
 */
export const getJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error al obtener ${key} del localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Guarda un valor en localStorage como JSON
 * @param {string} key - Clave del localStorage
 * @param {*} value - Valor a guardar
 * @returns {boolean} true si se guardó correctamente, false si hubo error
 */
export const setJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage:`, error);
    return false;
  }
};

/**
 * Elimina un valor del localStorage
 * @param {string} key - Clave del localStorage
 * @returns {boolean} true si se eliminó correctamente, false si hubo error
 */
export const removeJSON = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error al eliminar ${key} del localStorage:`, error);
    return false;
  }
};

/**
 * Limpia todo el localStorage
 * @returns {boolean} true si se limpió correctamente, false si hubo error
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    return false;
  }
};


