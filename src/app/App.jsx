import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppRoutes from './routes';
import StoreProvider from './store/StoreProvider';
import { initializeGoogleIdentityServices } from '../lib/googleDriveBackup';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  // Inicializar Google Identity Services al cargar la aplicación
  useEffect(() => {
    initializeGoogleIdentityServices().catch(error => {
      console.warn('Error inicializando Google Identity Services:', error);
    });
  }, []);

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

  // Track page views with Google Analytics (gtag) for SPA route changes
  useEffect(() => {
    // Only track if gtag is available (loaded from index.html)
    if (typeof window !== 'undefined' && window.gtag) {
      const path = location.pathname + location.search;
      window.gtag('config', 'G-CGH0T8KT90', {
        page_path: path,
      });
    }
  }, [location]);

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
