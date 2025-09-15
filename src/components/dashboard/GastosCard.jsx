import React from 'react';
import { formatCurrency } from '../../lib/dateHelpers';
import './GastosCard.css';

const GastosCard = ({ 
  expenses, 
  expensesCount, 
  yesterdayExpenses,
  trend 
}) => {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  const getTrendIcon = () => {
    if (isNeutral) return '→';
    return isPositive ? '↗' : '↘';
  };

  const getTrendClass = () => {
    if (isNeutral) return 'trend-neutral';
    return isPositive ? 'trend-positive' : 'trend-negative';
  };

  return (
    <div className="gastos-card">
      <div className="metric-header">
        <div className="metric-icon-wrapper expense">
          <span className="metric-icon">💸</span>
        </div>
        <div className={`metric-trend ${getTrendClass()}`}>
          <span className="trend-icon">{getTrendIcon()}</span>
          <span className="trend-text">{Math.abs(trend).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="metric-body">
        <h3 className="metric-title">Gastos del día</h3>
        <div className="metric-value">
          {formatCurrency(expenses)}
        </div>
        <div className="metric-subtitle">
          {expensesCount} {expensesCount === 1 ? 'registro' : 'registros'}
        </div>
      </div>
      
      <div className="metric-footer">
        <div className="comparison-info">
          <span className="comparison-label">vs ayer:</span>
          <span className="comparison-value">
            {formatCurrency(yesterdayExpenses)}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill expense-fill ${getTrendClass()}`}
            style={{
              width: `${Math.min(Math.abs(trend), 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GastosCard;