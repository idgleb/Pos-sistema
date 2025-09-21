import React, { useState } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './Keypad.css';

const Keypad = () => {
  const { actions } = useStore();
  const [manualAmount, setManualAmount] = useState('');

  const handleKeyPress = (key) => {
    if (key === 'C') {
      setManualAmount('');
    } else if (key === '←') {
      setManualAmount(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!manualAmount.includes('.')) {
        setManualAmount(prev => prev + '.');
      }
    } else if (key >= '0' && key <= '9') {
      setManualAmount(prev => prev + key);
    }
  };

  const handleAddManualService = () => {
    const amount = parseFloat(manualAmount);
    if (amount > 0) {
      // Convertir a centavos
      const amountInCents = Math.round(amount * 100);
      
      // Agregar como servicio manual al carrito
      actions.addToCart('manual-service', amountInCents);
      
      // Limpiar el input
      setManualAmount('');
    }
  };

  const formatDisplayAmount = () => {
    if (!manualAmount) return '0.00';
    
    const num = parseFloat(manualAmount);
    if (isNaN(num)) return '0.00';
    
    return num.toFixed(2);
  };

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '←'],
    ['.', '', '']
  ];

  return (
    <div className="keypad">
      <div className="keypad-header">
        <h3>Monto Manual</h3>
        <p>Ingresa un monto para agregar como servicio</p>
      </div>

      <div className="keypad-display">
        <Input
          label="Monto"
          value={manualAmount}
          onChange={(e) => setManualAmount(e.target.value)}
          placeholder="0.00"
          className="amount-input"
          type="text"
          inputMode="decimal"
        />
        <div className="display-amount">
          ${formatDisplayAmount()}
        </div>
      </div>

      <div className="keypad-buttons">
        {keypadButtons.map((row, rowIndex) => (
          <div key={rowIndex} className="keypad-row">
            {row.map((key, keyIndex) => (
              <Button
                key={keyIndex}
                variant={key === 'C' ? 'error' : key === '←' ? 'warning' : 'outline'}
                size="lg"
                onClick={() => handleKeyPress(key)}
                className={`keypad-btn ${key === '' ? 'keypad-btn--empty' : ''}`}
                disabled={key === ''}
              >
                {key === '←' ? '⌫' : key}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="keypad-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddManualService}
          disabled={!manualAmount || parseFloat(manualAmount) <= 0}
          className="add-service-btn"
        >
          Agregar Servicio
        </Button>
      </div>
    </div>
  );
};

export default Keypad;






