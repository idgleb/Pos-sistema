import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppRoutes from './routes';
import StoreProvider from './store/StoreProvider';
import './App.css';

const App = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
