import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './AppRoutes';
import { GlobalContextProvider } from './context/GlobalContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalContextProvider>
    <BrowserRouter>
      <AppRoutes />
      </BrowserRouter>
    </GlobalContextProvider>
  </React.StrictMode>
);
