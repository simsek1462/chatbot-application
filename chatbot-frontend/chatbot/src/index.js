import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App /> // React.StrictMode kaldırıldı
);

// Performans ölçümü için isterseniz bir fonksiyon geçebilirsiniz
// reportWebVitals(console.log); // Performans ölçümünü etkinleştirmek için bu satırı kullanabilirsiniz
reportWebVitals();
