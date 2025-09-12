import React from 'react';
import './KpiCard.css';

const KpiCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend = null,
  subtitle = null 
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'kpi-card--success';
      case 'error':
        return 'kpi-card--error';
      case 'warning':
        return 'kpi-card--warning';
      case 'info':
        return 'kpi-card--info';
      default:
        return 'kpi-card--primary';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend > 0) {
      return <span className="trend-icon trend-icon--up">↗</span>;
    } else if (trend < 0) {
      return <span className="trend-icon trend-icon--down">↘</span>;
    }
    return <span className="trend-icon trend-icon--neutral">→</span>;
  };

  const getTrendClass = () => {
    if (!trend) return '';
    
    if (trend > 0) {
      return 'trend--positive';
    } else if (trend < 0) {
      return 'trend--negative';
    }
    return 'trend--neutral';
  };

  return (
    <div className={`kpi-card ${getColorClass()}`}>
      <div className="kpi-card-header">
        <div className="kpi-card-icon">
          {icon}
        </div>
        <div className="kpi-card-title">
          {title}
        </div>
      </div>
      
      <div className="kpi-card-content">
        <div className="kpi-card-value">
          {value}
        </div>
        
        {trend !== null && (
          <div className={`kpi-card-trend ${getTrendClass()}`}>
            {getTrendIcon()}
            <span className="trend-text">
              {Math.abs(trend)}%
            </span>
          </div>
        )}
        
        {subtitle && (
          <div className="kpi-card-subtitle">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;


