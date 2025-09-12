import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './SalesByProductPie.css';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

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
      legend: {
        position: 'bottom',
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
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  hidden: false,
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
    }
  };

  const totalRevenue = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="sales-by-product-pie">
      <div className="chart-container">
        <Pie data={chartData} options={options} />
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
