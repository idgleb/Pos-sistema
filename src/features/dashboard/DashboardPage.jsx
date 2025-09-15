import React, { useMemo } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import SalesByProductPie from '../../components/dashboard/SalesByProductPie';
import TicketPromedioCard from '../../components/dashboard/TicketPromedioCard';
import ProductosTopCard from '../../components/dashboard/ProductosTopCard';
import VelocidadVentas from '../../components/dashboard/VelocidadVentas';
import IngresosCard from '../../components/dashboard/IngresosCard';
import GastosCard from '../../components/dashboard/GastosCard';
import BalanceEfectivoCard from '../../components/dashboard/BalanceEfectivoCard';
import { 
  filterMovementsByTypeAndToday, 
  filterMovementsByTypeAndRange,
  sumMovementsAmount, 
  formatCurrency,
  getYesterdayRange,
  getLastWeekRange,
  getLastMonthRange,
  calculateAverageTicket,
  getTopSellingProducts,
  calculateSalesVelocity,
  calculatePercentageChange,
  calculateCashBalance
} from '../../lib/dateHelpers';
import './DashboardPage.css';

const DashboardPage = () => {
  const { state } = useStore();

  // Calcular métricas avanzadas del día
  const advancedMetrics = useMemo(() => {
    // Filtrar movimientos del día actual
    const todaySales = filterMovementsByTypeAndToday(state.movements, 'sale');
    const todayExpenses = filterMovementsByTypeAndToday(state.movements, 'expense');
    
    // Filtrar movimientos de períodos anteriores
    const yesterdayRange = getYesterdayRange();
    const lastWeekRange = getLastWeekRange();
    const lastMonthRange = getLastMonthRange();
    
    const yesterdaySales = filterMovementsByTypeAndRange(state.movements, 'sale', yesterdayRange);
    const lastWeekSales = filterMovementsByTypeAndRange(state.movements, 'sale', lastWeekRange);
    const lastMonthSales = filterMovementsByTypeAndRange(state.movements, 'sale', lastMonthRange);
    
    // Calcular totales actuales
    const totalRevenue = sumMovementsAmount(todaySales);
    const totalExpenses = sumMovementsAmount(todayExpenses);
    const netProfit = totalRevenue - totalExpenses;
    
    // Calcular balance efectivo para todo el tiempo
    const allSales = state.movements.filter(movement => movement.type === 'sale');
    const allExpenses = state.movements.filter(movement => movement.type === 'expense');
    const cashBalance = calculateCashBalance(allSales, allExpenses);
    const salesCount = todaySales.length;
    const expensesCount = todayExpenses.length;
    
    // Calcular totales de períodos anteriores
    const yesterdayRevenue = sumMovementsAmount(yesterdaySales);
    const lastWeekRevenue = sumMovementsAmount(lastWeekSales);
    const lastMonthRevenue = sumMovementsAmount(lastMonthSales);
    
    // Calcular balance efectivo de períodos anteriores
    const yesterdayExpenses = filterMovementsByTypeAndRange(state.movements, 'expense', yesterdayRange);
    const lastWeekExpenses = filterMovementsByTypeAndRange(state.movements, 'expense', lastWeekRange);
    const lastMonthExpenses = filterMovementsByTypeAndRange(state.movements, 'expense', lastMonthRange);
    
    const yesterdayCashBalance = calculateCashBalance(yesterdaySales, yesterdayExpenses);
    const lastWeekCashBalance = calculateCashBalance(lastWeekSales, lastWeekExpenses);
    const lastMonthCashBalance = calculateCashBalance(lastMonthSales, lastMonthExpenses);
    
    // Calcular tendencias (porcentaje de cambio vs ayer)
    const revenueTrend = calculatePercentageChange(totalRevenue, yesterdayRevenue);
    const expenseTrend = calculatePercentageChange(totalExpenses, sumMovementsAmount(yesterdayExpenses));
    const cashBalanceTrend = calculatePercentageChange(cashBalance, yesterdayCashBalance);
    
    // Calcular ticket promedio
    const averageTicket = calculateAverageTicket(todaySales);
    const yesterdayAverageTicket = calculateAverageTicket(yesterdaySales);
    
    // Obtener productos más vendidos
    const topProducts = getTopSellingProducts(todaySales, state.products, 5);
    
    // Calcular velocidad de ventas (asumiendo 8 horas de operación)
    const salesVelocity = calculateSalesVelocity(todaySales, 8);
    
    return {
      // Métricas básicas
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: netProfit,
      cashBalance,
      salesCount,
      expensesCount,
      revenueTrend,
      expenseTrend,
      cashBalanceTrend,
      
      // Métricas avanzadas
      averageTicket,
      yesterdayAverageTicket,
      topProducts,
      salesVelocity,
      todaySales,
      
      // Datos para comparaciones
      todayData: {
        revenue: totalRevenue,
        salesCount: salesCount,
        cashBalance: cashBalance
      },
      yesterdayData: {
        revenue: yesterdayRevenue,
        expenses: sumMovementsAmount(yesterdayExpenses),
        salesCount: yesterdaySales.length,
        cashBalance: yesterdayCashBalance
      },
      lastWeekData: {
        revenue: lastWeekRevenue,
        salesCount: lastWeekSales.length,
        cashBalance: lastWeekCashBalance
      },
      lastMonthData: {
        revenue: lastMonthRevenue,
        salesCount: lastMonthSales.length,
        cashBalance: lastMonthCashBalance
      }
    };
  }, [state.movements, state.products]);

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
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-layout-new">
          {/* Fila superior - Métricas principales */}
          <div className="metrics-row-main">
            <IngresosCard
              revenue={advancedMetrics.revenue}
              salesCount={advancedMetrics.salesCount}
              yesterdayRevenue={advancedMetrics.yesterdayData.revenue}
              trend={advancedMetrics.revenueTrend}
            />
            
            <GastosCard
              expenses={advancedMetrics.expenses}
              expensesCount={advancedMetrics.expensesCount}
              yesterdayExpenses={advancedMetrics.yesterdayData.expenses}
              trend={advancedMetrics.expenseTrend}
            />
            
            <BalanceEfectivoCard
              cashBalance={advancedMetrics.cashBalance}
            />

            {/* Nueva métrica: Ticket Promedio */}
            <TicketPromedioCard
              currentTicket={advancedMetrics.averageTicket}
              previousTicket={advancedMetrics.yesterdayAverageTicket}
              salesCount={advancedMetrics.salesCount}
              period="ayer"
            />
          </div>

          {/* Fila intermedia - Métricas avanzadas */}
          <div className="metrics-row-advanced">
            {/* Productos más vendidos */}
            <ProductosTopCard
              topProducts={advancedMetrics.topProducts}
              totalSales={advancedMetrics.salesCount}
            />


            {/* Velocidad de ventas */}
            <VelocidadVentas
              salesMovements={advancedMetrics.todaySales}
              salesVelocity={advancedMetrics.salesVelocity}
            />
          </div>

          {/* Gráfico principal */}
          <div className="chart-container">
            <SalesByProductPie 
              movements={state.movements}
              products={state.products}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
