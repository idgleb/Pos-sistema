import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppRoutes from './routes';
import StoreProvider from './store/StoreProvider';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    if (isDashboard) {
      document.body.classList.add('dashboard-active');
    } else {
      document.body.classList.remove('dashboard-active');
    }

    return () => {
      document.body.classList.remove('dashboard-active');
    };
  }, [isDashboard]);

  return (
    <div className={`app ${isDashboard ? 'app-dashboard' : ''}`}>
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
    </div>
  );
};

const App = () => {
  // Usar basename solo en producción (GitHub Pages)
  const basename = import.meta.env.PROD ? '/Pos-sistema' : '';
  
  return (
    <StoreProvider>
      <BrowserRouter basename={basename}>
        <AppContent />
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
