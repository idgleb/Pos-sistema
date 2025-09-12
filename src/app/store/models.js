/**
 * Modelos de datos del sistema POS
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Identificador único del producto
 * @property {string} name - Nombre del producto
 * @property {number} price - Precio del producto en centavos (0 si es precio libre)
 * @property {boolean} isFreePrice - Si el producto tiene precio libre
 * @property {string} [imageDataUrl] - URL de datos de la imagen (opcional)
 */

/**
 * @typedef {Object} CartItem
 * @property {string} productId - ID del producto
 * @property {number} qty - Cantidad en el carrito
 * @property {number} [customPrice] - Precio personalizado en centavos (opcional)
 */


/**
 * @typedef {Object} Movement
 * @property {string} id - Identificador único del movimiento
 * @property {'sale'|'expense'|'adjustment'} type - Tipo de movimiento
 * @property {number} amount - Monto del movimiento en centavos
 * @property {string} dateISO - Fecha en formato ISO string
 * @property {Object} [meta] - Metadatos adicionales (opcional)
 */

/**
 * @typedef {Object} AppState
 * @property {Product[]} products - Lista de productos
 * @property {CartItem[]} cart - Carrito de compras
 * @property {Movement[]} movements - Lista de movimientos
 */

/**
 * Tipos de acciones del reducer
 */
export const ACTION_TYPES = {
  // Productos
  PRODUCTS_SET: 'PRODUCTS/SET',
  PRODUCTS_ADD: 'PRODUCTS/ADD',
  PRODUCTS_UPDATE: 'PRODUCTS/UPDATE',
  PRODUCTS_DELETE: 'PRODUCTS/DELETE',
  
  // Carrito
  CART_ADD_ITEM: 'CART/ADD_ITEM',
  CART_INC_QTY: 'CART/INC_QTY',
  CART_DEC_QTY: 'CART/DEC_QTY',
  CART_REMOVE_ITEM: 'CART/REMOVE_ITEM',
  CART_CLEAR: 'CART/CLEAR',
  
  
  // Movimientos
  MOVEMENTS_ADD: 'MOVEMENTS/ADD',
  MOVEMENTS_UPDATE: 'MOVEMENTS/UPDATE',
  MOVEMENTS_DELETE: 'MOVEMENTS/DELETE',
};

/**
 * Productos de ejemplo para inicializar el store
 */
export const SEED_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Café Americano',
    price: 2500, // $25.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-2',
    name: 'Café Latte',
    price: 3500, // $35.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-3',
    name: 'Café Cappuccino',
    price: 3200, // $32.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-4',
    name: 'Sandwich de Jamón',
    price: 4500, // $45.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-5',
    name: 'Ensalada César',
    price: 5500, // $55.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-6',
    name: 'Agua Mineral',
    price: 1500, // $15.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-7',
    name: 'Jugo de Naranja',
    price: 2800, // $28.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-8',
    name: 'Pastel de Chocolate',
    price: 4200, // $42.00 ARS
    isFreePrice: false,
    imageDataUrl: null
  },
  {
    id: 'prod-9',
    name: 'Servicio Personalizado',
    price: 0, // Precio libre
    isFreePrice: true,
    imageDataUrl: null
  },
  {
    id: 'prod-10',
    name: 'Reparación',
    price: 0, // Precio libre
    isFreePrice: true,
    imageDataUrl: null
  },
  {
    id: 'prod-11',
    name: 'Consultoría',
    price: 0, // Precio libre
    isFreePrice: true,
    imageDataUrl: null
  }
];
