import React from 'react';
import { formatCurrency, calculatePercentageChange } from '../../lib/dateHelpers';
import './TicketPromedioCard.css';

const TicketPromedioCard = ({ 
  currentTicket, 
  previousTicket, 
  salesCount,
  period = 'ayer' 
}) => {
  const percentageChange = calculatePercentageChange(currentTicket, previousTicket);
  const isPositive = percentageChange > 0;
  const isNeutral = percentageChange === 0;

  const getTrendIcon = () => {
    if (isNeutral) return '→';
    return isPositive ? '↗' : '↘';
  };

  const getTrendClass = () => {
    if (isNeutral) return 'trend-neutral';
    return isPositive ? 'trend-positive' : 'trend-negative';
  };

  return (
    <div className="ticket-promedio-card">
      <div className="metric-header">
        <div className="metric-icon-wrapper ticket">
          <span className="metric-icon">🎫</span>
        </div>
        <div className={`metric-trend ${getTrendClass()}`}>
          <span className="trend-icon">{getTrendIcon()}</span>
          <span className="trend-text">{Math.abs(percentageChange)}%</span>
        </div>
      </div>
      
      <div className="metric-body">
        <h3 className="metric-title">Ticket Promedio del Día</h3>
        <div className="metric-value">
          {formatCurrency(currentTicket)}
        </div>
        <div className="metric-subtitle">
          {salesCount} {salesCount === 1 ? 'venta' : 'ventas'} hoy
        </div>
      </div>
      
      <div className="metric-footer">
        <div className="comparison-info">
          <span className="comparison-label">vs {period}:</span>
          <span className="comparison-value">
            {formatCurrency(previousTicket)}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ticket-fill ${getTrendClass()}`}
            style={{
              width: `${Math.min(Math.abs(percentageChange), 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TicketPromedioCard;
