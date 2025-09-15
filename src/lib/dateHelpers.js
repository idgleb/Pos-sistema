import { startOfDay, endOfDay, isWithinInterval, parseISO, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, getHours } from 'date-fns';

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

/**
 * Obtiene el inicio y final del día anterior
 * @returns {Object} Objeto con start y end del día anterior
 */
export const getYesterdayRange = () => {
  const yesterday = subDays(new Date(), 1);
  return {
    start: startOfDay(yesterday),
    end: endOfDay(yesterday)
  };
};

/**
 * Obtiene el inicio y final de la semana pasada
 * @returns {Object} Objeto con start y end de la semana pasada
 */
export const getLastWeekRange = () => {
  const lastWeek = subWeeks(new Date(), 1);
  return {
    start: startOfWeek(lastWeek, { weekStartsOn: 1 }), // Lunes como inicio
    end: endOfWeek(lastWeek, { weekStartsOn: 1 })
  };
};

/**
 * Obtiene el inicio y final del mes pasado
 * @returns {Object} Objeto con start y end del mes pasado
 */
export const getLastMonthRange = () => {
  const lastMonth = subMonths(new Date(), 1);
  return {
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth)
  };
};

/**
 * Verifica si una fecha ISO está dentro de un rango específico
 * @param {string} dateISO - Fecha en formato ISO string
 * @param {Object} range - Objeto con start y end
 * @returns {boolean} True si la fecha está en el rango
 */
export const isWithinRange = (dateISO, range) => {
  const date = parseISO(dateISO);
  return isWithinInterval(date, range);
};

/**
 * Filtra movimientos por tipo y rango de fechas
 * @param {Array} movements - Array de movimientos
 * @param {string} type - Tipo de movimiento
 * @param {Object} range - Rango de fechas {start, end}
 * @returns {Array} Array filtrado de movimientos
 */
export const filterMovementsByTypeAndRange = (movements, type, range) => {
  return movements.filter(movement => 
    movement.type === type && isWithinRange(movement.dateISO, range)
  );
};

/**
 * Calcula el ticket promedio de las ventas
 * @param {Array} salesMovements - Array de movimientos de venta
 * @returns {number} Ticket promedio en centavos
 */
export const calculateAverageTicket = (salesMovements) => {
  if (salesMovements.length === 0) return 0;
  const totalAmount = sumMovementsAmount(salesMovements);
  return Math.round(totalAmount / salesMovements.length);
};

/**
 * Obtiene el ranking de productos más vendidos
 * @param {Array} salesMovements - Array de movimientos de venta
 * @param {Array} products - Array de productos
 * @param {number} limit - Límite de productos a retornar
 * @returns {Array} Array de productos ordenados por ventas
 */
export const getTopSellingProducts = (salesMovements, products, limit = 5) => {
  const productSales = {};
  
  salesMovements.forEach(movement => {
    if (movement.meta && movement.meta.items) {
      movement.meta.items.forEach(item => {
        const productId = item.productId;
        const quantity = item.qty;
        const revenue = item.qty * (item.customPrice || item.price || 0);
        
        if (productSales[productId]) {
          productSales[productId].quantity += quantity;
          productSales[productId].revenue += revenue;
        } else {
          productSales[productId] = {
            productId,
            quantity,
            revenue
          };
        }
      });
    }
  });

  return Object.values(productSales)
    .map(sale => {
      const product = products.find(p => p.id === sale.productId);
      return {
        ...sale,
        productName: product ? product.name : `Producto ${sale.productId}`,
        product
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};

/**
 * Calcula las ventas por hora del día actual
 * @param {Array} salesMovements - Array de movimientos de venta del día
 * @returns {Array} Array con ventas por hora [0-23]
 */
export const getSalesByHour = (salesMovements) => {
  const hourlyData = Array(24).fill(0).map((_, hour) => ({
    hour,
    sales: 0,
    amount: 0
  }));

  salesMovements.forEach(movement => {
    const hour = getHours(parseISO(movement.dateISO));
    hourlyData[hour].sales += 1;
    hourlyData[hour].amount += movement.amount;
  });

  return hourlyData;
};

/**
 * Calcula la velocidad de ventas (ventas por hora promedio)
 * @param {Array} salesMovements - Array de movimientos de venta
 * @param {number} hoursOpen - Horas que el negocio estuvo abierto
 * @returns {number} Ventas por hora
 */
export const calculateSalesVelocity = (salesMovements, hoursOpen = 8) => {
  if (hoursOpen === 0) return 0;
  return Math.round((salesMovements.length / hoursOpen) * 100) / 100;
};

/**
 * Calcula el porcentaje de cambio entre dos valores
 * @param {number} current - Valor actual
 * @param {number} previous - Valor anterior
 * @returns {number} Porcentaje de cambio
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
};

/**
 * Filtra movimientos de venta por método de pago
 * @param {Array} salesMovements - Array de movimientos de venta
 * @param {string} method - Método de pago ('cash' o 'card')
 * @returns {Array} Array filtrado de movimientos de venta
 */
export const filterSalesByPaymentMethod = (salesMovements, method) => {
  return salesMovements.filter(movement => 
    movement.meta && movement.meta.method === method
  );
};

/**
 * Calcula el balance efectivo (ventas en efectivo - gastos)
 * @param {Array} salesMovements - Array de movimientos de venta
 * @param {Array} expenseMovements - Array de movimientos de gastos
 * @returns {number} Balance efectivo en centavos
 */
export const calculateCashBalance = (salesMovements, expenseMovements) => {
  const cashSales = filterSalesByPaymentMethod(salesMovements, 'cash');
  const cashSalesAmount = sumMovementsAmount(cashSales);
  const expensesAmount = sumMovementsAmount(expenseMovements);
  return cashSalesAmount - expensesAmount;
};
