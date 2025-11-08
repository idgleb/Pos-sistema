import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas
import POSPage from '../features/pos/POSPage';
import ExpensesPage from '../features/expenses/ExpensesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import MovementsPage from '../features/movements/MovementsPage';
import ProductsPage from '../features/products/ProductsPage';
import PrivacyPolicyPage from '../features/legal/PrivacyPolicyPage';
import TermsOfServicePage from '../features/legal/TermsOfServicePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<POSPage />} />
      <Route path="/gastos" element={<ExpensesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/movimientos" element={<MovementsPage />} />
      <Route path="/productos" element={<ProductsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
    </Routes>
  );
};

export default AppRoutes;






