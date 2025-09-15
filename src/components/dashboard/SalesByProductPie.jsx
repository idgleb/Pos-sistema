import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './SalesByProductPie.css';

// Plugin personalizado para centrar texto en el doughnut
const centerTextPlugin = {
  id: 'centerText',
  afterDatasetsDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    
    // Obtener el total de los datos
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    
    // Determinar el tamaño de fuente basado en el ancho del gráfico
    const chartWidth = chartArea.right - chartArea.left;
    let labelFontSize, valueFontSize, spacing;
    
    if (chartWidth < 300) {
      // Móvil
      labelFontSize = 6;
      valueFontSize = 8;
      spacing = 3;
    } else if (chartWidth < 500) {
      // Tablet
      labelFontSize = 8;
      valueFontSize = 10;
      spacing = 4;
    } else {
      // Desktop
      labelFontSize = 14;
      valueFontSize = 18;
      spacing = 8;
    }
    
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Dibujar "TOTAL"
    ctx.font = `bold ${labelFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText('TOTAL', centerX, centerY - spacing);
    
    // Dibujar el valor
    ctx.font = `bold ${valueFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = '#1e293b';
    ctx.fillText(
      new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
      }).format(total / 100),
      centerX,
      centerY + spacing
    );
    
    ctx.restore();
  }
};

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin);

const SalesByProductPie = ({ movements, products }) => {
  const chartData = useMemo(() => {
    // Filtrar movimientos de ventas del día actual
    const todaySales = movements.filter(movement => 
      movement.type === 'sale' && 
      new Date(movement.dateISO).toDateString() === new Date().toDateString()
    );

    // Agrupar ventas por producto
    const salesByProduct = {};
    
    todaySales.forEach(movement => {
      if (movement.meta && movement.meta.items) {
        movement.meta.items.forEach(item => {
          const productId = item.productId;
          const revenue = item.qty * (item.customPrice || item.price || 0);
          
          if (salesByProduct[productId]) {
            salesByProduct[productId] += revenue;
          } else {
            salesByProduct[productId] = revenue;
          }
        });
      }
    });

    // Convertir a array y filtrar productos con ventas
    const productSales = Object.entries(salesByProduct)
      .filter(([_, revenue]) => revenue > 0)
      .map(([productId, revenue]) => {
        const product = products.find(p => p.id === productId);
        return {
          productId,
          productName: product ? product.name : `Producto ${productId}`,
          revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    if (productSales.length === 0) {
      return {
        labels: ['Sin ventas'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e2e8f0'],
          borderColor: ['#cbd5e1'],
          borderWidth: 1,
        }]
      };
    }

    // Generar colores modernos para los productos (paleta vibrante 2024)
    const colors = [
      '#667eea', // Purple
      '#764ba2', // Deep purple
      '#f093fb', // Pink
      '#4facfe', // Light blue
      '#43e97b', // Green
      '#fa709a', // Rose
      '#feca57', // Yellow
      '#ff9ff3', // Light pink
      '#48dbfb', // Cyan
      '#ff6b6b', // Red
    ];

    return {
      labels: productSales.map(item => item.productName),
      datasets: [{
        data: productSales.map(item => item.revenue),
        backgroundColor: colors.slice(0, productSales.length),
        borderColor: colors.slice(0, productSales.length).map(color => 
          color.replace('rgb', 'rgba').replace(')', ', 0.8)')
        ),
        borderWidth: 2,
      }]
    };
  }, [movements, products]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      centerText: true,
      legend: {
        position: 'bottom',
        onClick: function(e, legendItem, legend) {
          const index = legendItem.index;
          const chart = legend.chart;
          
          // Toggle visibility
          const meta = chart.getDatasetMeta(0);
          meta.data[index].hidden = !meta.data[index].hidden;
          
          // Update legend item
          legendItem.hidden = meta.data[index].hidden;
          
          chart.update();
        },
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                const meta = chart.getDatasetMeta(0);
                const isHidden = meta.data[i] ? meta.data[i].hidden : false;
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  hidden: isHidden,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 2
            }).format(value / 100)} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderAlign: 'inner'
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    cutout: '60%'
  };

  const totalRevenue = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="sales-by-product-pie">
      <div className="chart-header">
        <h3 className="chart-title">Ventas por Producto</h3>
        <p className="chart-subtitle">Distribución de ingresos del día</p>
      </div>
      
      <div className="doughnut-container">
        <Doughnut data={chartData} options={options} />
      </div>
      
      {chartData.labels.length === 1 && chartData.labels[0] === 'Sin ventas' && (
        <div className="no-data-message">
          <div className="no-data-icon">📊</div>
          <p>No hay ventas registradas hoy</p>
        </div>
      )}
    </div>
  );
};

export default SalesByProductPie;
