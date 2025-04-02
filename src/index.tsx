import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { ConfigProvider } from 'antd';
import ro_RO from 'antd/lib/locale/ro_RO';
import moment from 'moment';
import 'moment/locale/ro';

// Setăm limba pentru moment.js
moment.locale('ro');

// Încărcăm componentul principal în DOM
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConfigProvider locale={ro_RO}>
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </React.StrictMode>
);
