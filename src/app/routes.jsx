import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas
import POSPage from '../features/pos/POSPage';
import ExpensesPage from '../features/expenses/ExpensesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import MovementsPage from '../features/movements/MovementsPage';
import ProductsPage from '../features/products/ProductsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<POSPage />} />
      <Route path="/gastos" element={<ExpensesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/movimientos" element={<MovementsPage />} />
      <Route path="/productos" element={<ProductsPage />} />
    </Routes>
  );
};

export default AppRoutes;


