import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom';

// Setare variabilă CSS pentru base path
const setBasePath = () => {
  // Detectează dacă este pe GitHub Pages sau local
  const isGitHubPages = window.location.hostname === 'devalo1.github.io';
  const basePath = isGitHubPages ? '/my-website' : '';
  
  // Setează variabila CSS
  document.documentElement.style.setProperty('--base-url', basePath);
};

// Apelează funcția pentru a seta calea de bază
setBasePath();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
