// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // This contains our TailwindCSS styles
import { DashboardProvider } from './context/DashboardContext.jsx'; // Import our provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire App in the provider */}
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>,
);