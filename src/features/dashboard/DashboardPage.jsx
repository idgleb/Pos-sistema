import React, { useMemo } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import KpiCard from '../../components/dashboard/KpiCard';
import SalesByProductPie from '../../components/dashboard/SalesByProductPie';
import { 
  filterMovementsByTypeAndToday, 
  sumMovementsAmount, 
  formatCurrency
} from '../../lib/dateHelpers';
import './DashboardPage.css';

const DashboardPage = () => {
  const { state } = useStore();

  // Calcular métricas del día
  const dailyMetrics = useMemo(() => {
    // Filtrar movimientos del día actual
    const todaySales = filterMovementsByTypeAndToday(state.movements, 'sale');
    const todayExpenses = filterMovementsByTypeAndToday(state.movements, 'expense');
    
    // Calcular totales
    const totalRevenue = sumMovementsAmount(todaySales);
    const totalExpenses = sumMovementsAmount(todayExpenses);
    const netProfit = totalRevenue - totalExpenses;
    
    // Contar transacciones
    const salesCount = todaySales.length;
    const expensesCount = todayExpenses.length;
    
    // Calcular tendencias (porcentaje de cambio vs promedio)
    const avgRevenue = state.movements.filter(m => m.type === 'sale').length > 0 
      ? state.movements.filter(m => m.type === 'sale').reduce((sum, m) => sum + m.amount, 0) / Math.max(7, state.movements.filter(m => m.type === 'sale').length)
      : 0;
    const revenueTrend = avgRevenue > 0 ? ((totalRevenue - avgRevenue) / avgRevenue) * 100 : 0;
    
    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: netProfit,
      salesCount,
      expensesCount,
      revenueTrend
    };
  }, [state.movements]);

  // Obtener fecha actual formateada
  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
  const dateString = currentDate.toLocaleDateString('es-ES', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Obtener saludo según hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 19) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-modern">
        <div className="header-content">
          <div className="greeting-section">
            <h1 className="greeting">{getGreeting()}</h1>
            <p className="date-info">
              <span className="day-name">{dayName}</span>
              <span className="date-separator">•</span>
              <span className="date-full">{dateString}</span>
            </p>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-icon">📊</span>
              <span className="stat-value">{state.movements.length}</span>
              <span className="stat-label">movimientos</span>
            </div>
            <div className="quick-stat">
              <span className="stat-icon">🛍️</span>
              <span className="stat-value">{dailyMetrics.salesCount}</span>
              <span className="stat-label">ventas hoy</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-layout">
          {/* Columna izquierda - Métricas */}
          <div className="metrics-column">
            <div className="metrics-modern">
              <div className="metric-card revenue-card">
                <div className="metric-header">
                  <div className="metric-icon-wrapper">
                    <span className="metric-icon">💰</span>
                  </div>
                  <div className="metric-trend">
                    {dailyMetrics.revenueTrend > 0 ? (
                      <span className="trend-up">↑ {Math.abs(dailyMetrics.revenueTrend).toFixed(1)}%</span>
                    ) : dailyMetrics.revenueTrend < 0 ? (
                      <span className="trend-down">↓ {Math.abs(dailyMetrics.revenueTrend).toFixed(1)}%</span>
                    ) : (
                      <span className="trend-neutral">→ 0%</span>
                    )}
                  </div>
                </div>
                <div className="metric-body">
                  <h3 className="metric-title">Ingresos del día</h3>
                  <div className="metric-value">{formatCurrency(dailyMetrics.revenue)}</div>
                  <div className="metric-subtitle">{dailyMetrics.salesCount} transacciones</div>
                </div>
                <div className="metric-footer">
                  <div className="progress-bar">
                    <div className="progress-fill revenue-fill" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="metric-card expense-card">
                <div className="metric-header">
                  <div className="metric-icon-wrapper expense">
                    <span className="metric-icon">💸</span>
                  </div>
                </div>
                <div className="metric-body">
                  <h3 className="metric-title">Gastos del día</h3>
                  <div className="metric-value">{formatCurrency(dailyMetrics.expenses)}</div>
                  <div className="metric-subtitle">{dailyMetrics.expensesCount} registros</div>
                </div>
                <div className="metric-footer">
                  <div className="progress-bar">
                    <div className="progress-fill expense-fill" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className={`metric-card profit-card ${dailyMetrics.profit >= 0 ? 'positive' : 'negative'}`}>
                <div className="metric-header">
                  <div className="metric-icon-wrapper profit">
                    <span className="metric-icon">{dailyMetrics.profit >= 0 ? '📈' : '📉'}</span>
                  </div>
                </div>
                <div className="metric-body">
                  <h3 className="metric-title">Balance neto</h3>
                  <div className="metric-value">{formatCurrency(dailyMetrics.profit)}</div>
                  <div className="metric-subtitle">
                    {dailyMetrics.profit >= 0 ? 'Ganancia del día' : 'Pérdida del día'}
                  </div>
                </div>
                <div className="metric-footer">
                  <div className="balance-indicator">
                    <span className="indicator-dot"></span>
                    <span className="indicator-text">
                      {dailyMetrics.profit >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Gráfico */}
          <div className="chart-column">
            <div className="charts-modern">
              <div className="chart-container">
                <div className="chart-header">
                  <div className="chart-title-section">
                    <h2 className="chart-title">Distribución de ventas por producto</h2>
                    <div className="chart-subtitle">
                      Total: {formatCurrency(dailyMetrics.revenue)}
                    </div>
                  </div>
                  <div className="chart-period">Hoy</div>
                </div>
                <div className="chart-body">
                  <SalesByProductPie 
                    movements={state.movements}
                    products={state.products}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;