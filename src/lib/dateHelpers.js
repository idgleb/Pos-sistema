import { startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';

/**
 * Obtiene el inicio del día actual en la zona horaria local
 * @returns {Date} Fecha de inicio del día actual
 */
export const getStartOfToday = () => {
  return startOfDay(new Date());
};

/**
 * Obtiene el final del día actual en la zona horaria local
 * @returns {Date} Fecha de final del día actual
 */
export const getEndOfToday = () => {
  return endOfDay(new Date());
};

/**
 * Verifica si una fecha ISO está dentro del día actual
 * @param {string} dateISO - Fecha en formato ISO string
 * @returns {boolean} True si la fecha está en el día actual
 */
export const isToday = (dateISO) => {
  const date = parseISO(dateISO);
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  
  return isWithinInterval(date, {
    start: startOfToday,
    end: endOfToday
  });
};

/**
 * Filtra un array de elementos por fecha del día actual
 * @param {Array} items - Array de elementos con propiedad dateISO
 * @returns {Array} Array filtrado con elementos del día actual
 */
export const filterByToday = (items) => {
  return items.filter(item => isToday(item.dateISO));
};

/**
 * Filtra movimientos por tipo y fecha del día actual
 * @param {Array} movements - Array de movimientos
 * @param {string} type - Tipo de movimiento ('sale', 'expense', etc.)
 * @returns {Array} Array filtrado de movimientos del día actual
 */
export const filterMovementsByTypeAndToday = (movements, type) => {
  return movements.filter(movement => 
    movement.type === type && isToday(movement.dateISO)
  );
};

/**
 * Suma el amount de un array de movimientos
 * @param {Array} movements - Array de movimientos
 * @returns {number} Suma total en centavos
 */
export const sumMovementsAmount = (movements) => {
  return movements.reduce((total, movement) => total + movement.amount, 0);
};

/**
 * Formatea un monto en centavos a formato de moneda argentina
 * @param {number} amountInCents - Monto en centavos
 * @returns {string} Monto formateado como moneda argentina
 */
export const formatCurrency = (amountInCents) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amountInCents / 100);
};
