import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getJSON, setJSON } from '../../lib/storage';
import { generateId } from '../../lib/id';
import { ACTION_TYPES, SEED_PRODUCTS } from './models';

/**
 * Migrar datos existentes para agregar nuevos campos
 */
const migrateState = (state) => {
  if (!state) return null;
  
  // Migrar productos para agregar isFreePrice si no existe
  const migratedProducts = state.products?.map(product => ({
    ...product,
    isFreePrice: product.isFreePrice !== undefined ? product.isFreePrice : false
  })) || SEED_PRODUCTS;
  
  return {
    ...state,
    products: migratedProducts
  };
};

/**
 * Estado inicial de la aplicación
 */
const getInitialState = () => {
  // Intentar cargar desde localStorage
  const savedState = getJSON('pos_state', null);
  
  if (savedState) {
    const migratedState = migrateState(savedState);
    // Guardar el estado migrado
    setJSON('pos_state', migratedState);
    return migratedState;
  }
  
  // Si no hay estado guardado, crear estado inicial con productos de ejemplo
  return {
    products: SEED_PRODUCTS,
    cart: [],
    movements: []
  };
};

/**
 * Reducer principal de la aplicación
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción a ejecutar
 * @returns {Object} Nuevo estado
 */
const appReducer = (state, action) => {
  switch (action.type) {
    // === PRODUCTOS ===
    case ACTION_TYPES.PRODUCTS_SET:
      return {
        ...state,
        products: action.payload
      };
      
    case ACTION_TYPES.PRODUCTS_ADD:
      return {
        ...state,
        products: [...state.products, action.payload]
      };
      
    case ACTION_TYPES.PRODUCTS_UPDATE:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
      
    case ACTION_TYPES.PRODUCTS_DELETE:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
      
    // === CARRITO ===
    case ACTION_TYPES.CART_ADD_ITEM:
      const existingItem = state.cart.find(item => 
        item.productId === action.payload.productId && 
        item.customPrice === action.payload.customPrice
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId && 
            item.customPrice === action.payload.customPrice
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          )
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
      
    case ACTION_TYPES.CART_INC_QTY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      };
      
    case ACTION_TYPES.CART_DEC_QTY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload
            ? { ...item, qty: Math.max(0, item.qty - 1) }
            : item
        ).filter(item => item.qty > 0)
      };
      
    case ACTION_TYPES.CART_REMOVE_ITEM:
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload)
      };
      
    case ACTION_TYPES.CART_CLEAR:
      return {
        ...state,
        cart: []
      };
      
    // === MOVIMIENTOS ===
    case ACTION_TYPES.MOVEMENTS_ADD:
      return {
        ...state,
        movements: [...state.movements, action.payload]
      };
      
    case ACTION_TYPES.MOVEMENTS_UPDATE:
      return {
        ...state,
        movements: state.movements.map(movement =>
          movement.id === action.payload.id ? action.payload : movement
        )
      };
      
    case ACTION_TYPES.MOVEMENTS_DELETE:
      return {
        ...state,
        movements: state.movements.filter(movement => movement.id !== action.payload)
      };
      
    default:
      return state;
  }
};

// Crear el contexto
const StoreContext = createContext();

/**
 * Hook personalizado para usar el store
 * @returns {Object} { state, dispatch }
 */
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe ser usado dentro de StoreProvider');
  }
  return context;
};

/**
 * Provider del store global
 */
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());
  
  // Persistir el estado en localStorage cada vez que cambie
  useEffect(() => {
    setJSON('pos_state', state);
  }, [state]);
  
  // Crear acciones helper para facilitar el uso
  const actions = {
    // Productos
    setProducts: (products) => dispatch({ type: ACTION_TYPES.PRODUCTS_SET, payload: products }),
    addProduct: (product) => dispatch({ type: ACTION_TYPES.PRODUCTS_ADD, payload: product }),
    updateProduct: (product) => dispatch({ type: ACTION_TYPES.PRODUCTS_UPDATE, payload: product }),
    deleteProduct: (productId) => dispatch({ type: ACTION_TYPES.PRODUCTS_DELETE, payload: productId }),
    
    // Carrito
    addToCart: (productId, qty = 1, customPrice = null) => dispatch({ 
      type: ACTION_TYPES.CART_ADD_ITEM, 
      payload: { productId, qty, customPrice } 
    }),
    incrementCartItem: (productId) => dispatch({ 
      type: ACTION_TYPES.CART_INC_QTY, 
      payload: productId 
    }),
    decrementCartItem: (productId) => dispatch({ 
      type: ACTION_TYPES.CART_DEC_QTY, 
      payload: productId 
    }),
    removeFromCart: (productId) => dispatch({ 
      type: ACTION_TYPES.CART_REMOVE_ITEM, 
      payload: productId 
    }),
    clearCart: () => dispatch({ type: ACTION_TYPES.CART_CLEAR }),
    
    // Gastos (ahora solo como movimientos)
    addExpense: (amount, comment) => {
      const now = new Date().toISOString();
      
      // Solo agregar movimiento de gasto
      dispatch({
        type: ACTION_TYPES.MOVEMENTS_ADD,
        payload: {
          id: generateId(),
          type: 'expense',
          amount,
          dateISO: now,
          meta: { note: comment }
        }
      });
    },
    
    // Movimientos
    addMovement: (type, amount, meta = {}) => dispatch({
      type: ACTION_TYPES.MOVEMENTS_ADD,
      payload: {
        id: generateId(),
        type,
        amount,
        dateISO: new Date().toISOString(),
        meta
      }
    }),
    updateMovement: (movement) => dispatch({ 
      type: ACTION_TYPES.MOVEMENTS_UPDATE, 
      payload: movement 
    }),
    deleteMovement: (movementId) => dispatch({ 
      type: ACTION_TYPES.MOVEMENTS_DELETE, 
      payload: movementId 
    })
  };
  
  const value = {
    state,
    dispatch,
    actions
  };
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
