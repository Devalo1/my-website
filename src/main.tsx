import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom';

// Setare căi imagini în funcție de mediu
const setImagePaths = () => {
  // Detectează dacă este pe GitHub Pages sau local
  const isGitHubPages = window.location.hostname === 'devalo1.github.io';
  const basePath = isGitHubPages ? '/my-website' : '';
  
  // Setează variabilele CSS pentru căile complete
  document.documentElement.style.setProperty('--background-url', `${basePath}/background.jpg`);
  document.documentElement.style.setProperty('--cover-url', `${basePath}/images/cover.jpeg`);
};

// Apelează funcția pentru a seta căile
setImagePaths();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
