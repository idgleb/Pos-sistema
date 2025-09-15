import React from 'react';
import { getSalesByHour } from '../../lib/dateHelpers';
import './VelocidadVentas.css';

const VelocidadVentas = ({ salesMovements, salesVelocity }) => {
  const hourlyData = getSalesByHour(salesMovements);
  const currentHour = new Date().getHours();
  
  // Obtener las horas con más actividad
  const peakHours = hourlyData
    .filter(h => h.sales > 0)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);
  
  // Calcular estadísticas
  const totalHoursActive = hourlyData.filter(h => h.sales > 0).length;
  const averageSalesPerActiveHour = totalHoursActive > 0 
    ? Math.round((salesMovements.length / totalHoursActive) * 10) / 10 
    : 0;
  
  const getHourLabel = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  const getVelocityStatus = () => {
    if (salesVelocity >= 2) return { status: 'high', label: 'Alta', color: 'green' };
    if (salesVelocity >= 1) return { status: 'medium', label: 'Media', color: 'yellow' };
    if (salesVelocity > 0) return { status: 'low', label: 'Baja', color: 'orange' };
    return { status: 'none', label: 'Sin actividad', color: 'gray' };
  };

  const velocityStatus = getVelocityStatus();
  const maxSales = Math.max(...hourlyData.map(h => h.sales));

  return (
    <div className="velocidad-ventas-card">
      <div className="metric-header">
        <div className="metric-icon-wrapper velocity">
          <span className="metric-icon">⚡</span>
        </div>
        <div className={`velocity-badge ${velocityStatus.color}`}>
          {velocityStatus.label}
        </div>
      </div>
      
      <div className="metric-body">
        <h3 className="metric-title">Velocidad de Ventas</h3>
        <div className="velocity-main">
          <div className="velocity-value">
            {salesVelocity}
            <span className="velocity-unit">ventas/hora</span>
          </div>
          <div className="velocity-subtitle">
            {totalHoursActive} {totalHoursActive === 1 ? 'hora activa' : 'horas activas'} hoy
          </div>
        </div>
      </div>
      
      <div className="hourly-chart">
        <div className="chart-title">Actividad por hora</div>
        <div className="chart-bars">
          {hourlyData.map((hourData, index) => {
            const percentage = maxSales > 0 ? (hourData.sales / maxSales) * 100 : 0;
            const isCurrentHour = hourData.hour === currentHour;
            const isActive = hourData.sales > 0;
            
            return (
              <div 
                key={hourData.hour} 
                className={`hour-bar ${isCurrentHour ? 'current' : ''} ${isActive ? 'active' : ''}`}
                title={`${getHourLabel(hourData.hour)}: ${hourData.sales} ventas`}
              >
                <div 
                  className="bar-fill"
                  style={{ height: `${percentage}%` }}
                ></div>
                <div className="hour-label">
                  {hourData.hour}
                </div>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot current"></div>
            <span>Hora actual</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot active"></div>
            <span>Con ventas</span>
          </div>
        </div>
      </div>
      
      {peakHours.length > 0 && (
        <div className="peak-hours">
          <div className="peak-title">Horas pico</div>
          <div className="peak-list">
            {peakHours.map((peak, index) => (
              <div key={peak.hour} className={`peak-item rank-${index + 1}`}>
                <div className="peak-time">
                  {getHourLabel(peak.hour)}
                </div>
                <div className="peak-sales">
                  {peak.sales} {peak.sales === 1 ? 'venta' : 'ventas'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="metric-footer">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{averageSalesPerActiveHour}</div>
            <div className="stat-label">Promedio/hora activa</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{salesMovements.length}</div>
            <div className="stat-label">Total ventas hoy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocidadVentas;
