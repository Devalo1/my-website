import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { ConfigProvider } from 'antd';
import ro_RO from 'antd/lib/locale/ro_RO';
import 'moment/locale/ro';
import moment from 'moment';

// Setăm limba pentru moment.js
moment.locale('ro');

// Montăm aplicația în DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={ro_RO}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
