import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import Button from '../../components/ui/Button';
import './PriceModal.css';

const PriceModal = ({ isOpen, onClose, product }) => {
  const { actions } = useStore();
  const [price, setPrice] = useState('');
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Focus en el input cuando se abre el modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (isOpen && e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyPress = (key) => {
    if (key === 'C') {
      setPrice('');
    } else if (key === '←') {
      setPrice(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!price.includes('.')) {
        setPrice(prev => prev + '.');
      }
    } else if (key >= '0' && key <= '9') {
      // Limitar a dos decimales
      const parts = price.split('.');
      if (parts.length > 1 && parts[1].length >= 2) {
        return;
      }
      setPrice(prev => prev + key);
    }
  };

  const handleConfirm = () => {
    const priceValue = parseFloat(price);
    if (priceValue > 0) {
      // Convertir a centavos
      const priceInCents = Math.round(priceValue * 100);
      
      // Agregar al carrito con el precio personalizado
      actions.addToCart(product.id, 1, priceInCents);
      
      // Cerrar modal y limpiar
      setPrice('');
      onClose();
    }
  };

  const handleCancel = () => {
    setPrice('');
    onClose();
  };

  const formatDisplayPrice = () => {
    if (!price) return '$0,00';
    
    const num = parseFloat(price);
    if (isNaN(num)) return '$0,00';
    
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(num);
  };

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '←']
  ];

  if (!isOpen || !product) return null;

  return (
    <div 
      className="price-modal-overlay" 
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-modal-title"
    >
      <div 
        className="price-modal" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="price-modal-header">
          <p id="price-modal-title">Ingresar Precio de {product.name}</p>
          <button 
            className="price-modal-close" 
            onClick={handleCancel}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="price-modal-content">
          <div className="price-display">
            <div className="price-input">
              <input
                type="text"
                value={formatDisplayPrice()}
                onChange={(e) => {
                  // Solo permitir números y un punto decimal
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  if (/^[0-9]*\.?[0-9]{0,2}$/.test(value) || value === '') {
                    setPrice(value);
                  }
                }}
                placeholder="0.00"
                className="price-input-field"
                ref={inputRef}
                aria-label="Precio"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="price-keypad">
            {keypadButtons.map((row, rowIndex) => (
              <div key={rowIndex} className="keypad-row">
                {row.map((key, keyIndex) => (
                  <Button
                    key={keyIndex}
                    variant={key === 'C' ? 'error' : key === '←' ? 'warning' : 'outline'}
                    onClick={() => handleKeyPress(key)}
                    className={`keypad-btn ${key === '' ? 'keypad-btn--empty' : ''}`}
                    disabled={key === ''}
                    aria-label={
                      key === 'C' ? 'Borrar todo' : 
                      key === '←' ? 'Borrar último dígito' : 
                      `Número ${key}`
                    }
                  >
                    {key === '←' ? '⌫' : key}
                  </Button>
                ))}
              </div>
            ))}
            <div className="keypad-row keypad-row--special">
              <Button
                variant="outline"
                onClick={() => handleKeyPress('.')}
                className="keypad-btn keypad-btn--decimal"
                aria-label="Punto decimal"
              >
                .
              </Button>
            </div>
          </div>
        </div>

        <div className="price-modal-actions">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="cancel-btn"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!price || parseFloat(price) <= 0}
            className="confirm-btn"
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceModal;