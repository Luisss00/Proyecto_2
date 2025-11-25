import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Configurar flags futuros de React Router para evitar advertencias
if (typeof window !== 'undefined') {
  // Configurar flags futuros
  window.__REACT_ROUTER_FUTURE_FLAGS__ = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)