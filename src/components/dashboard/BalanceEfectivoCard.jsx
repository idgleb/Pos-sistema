import React from 'react';
import { formatCurrency } from '../../lib/dateHelpers';
import './BalanceEfectivoCard.css';

const BalanceEfectivoCard = ({ 
  cashBalance
}) => {
  const isBalancePositive = cashBalance >= 0;

  return (
    <div className={`balance-efectivo-card ${isBalancePositive ? 'positive' : 'negative'}`}>
      <div className="metric-header">
        <div className={`metric-icon-wrapper balance ${isBalancePositive ? 'positive' : 'negative'}`}>
          <span className="metric-icon">{isBalancePositive ? '💵' : '💸'}</span>
        </div>
      </div>
      
      <div className="metric-body">
        <h3 className="metric-title">Balance Efectivo</h3>
        <div className="metric-value">
          {formatCurrency(cashBalance)}
        </div>
        <div className="metric-subtitle">
          Efectivo - Gastos
        </div>
      </div>
      
      <div className="metric-footer">
        <div className="balance-indicator">
          <span className="indicator-dot"></span>
          <span className="indicator-text">
            {isBalancePositive ? 'Balance positivo' : 'Balance negativo'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceEfectivoCard;