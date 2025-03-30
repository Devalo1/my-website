import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css';

// Consolă de debugging îmbunătățită
console.log('🚀 Aplicația se încarcă...');

// Verifică dacă elementul root există
const rootElement = document.getElementById('root');
console.log('Element root găsit:', !!rootElement);

if (rootElement) {
  try {
    console.log('Încercare de renderizare...');
    const root = ReactDOM.createRoot(rootElement);
    
    // Înfășurarea într-un ErrorBoundary pentru a prinde erorile
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('✅ Aplicația a fost renderizată cu succes!');
  } catch (error) {
    console.error('❌ Eroare la renderizarea aplicației:', error);
    
    // Afișează un mesaj de eroare direct în pagină
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #8b5a2b;">
        <h1>Eroare la încărcarea aplicației</h1>
        <p>Am întâmpinat o problemă la încărcarea aplicației. Verifică consola pentru detalii.</p>
        <pre style="background: #f5f5f5; padding: 1rem; text-align: left; overflow: auto;">${error}</pre>
      </div>
    `;
  }
} else {
  console.error('❌ Elementul #root nu a fost găsit în pagină!');
  
  // Creăm un element root nou și încercăm din nou
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  
  console.log('Am creat un nou element #root');
  
  try {
    ReactDOM.createRoot(newRoot).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ Aplicația a fost renderizată după crearea unui nou root!');
  } catch (error) {
    console.error('❌ Eroare la a doua încercare de renderizare:', error);
  }
}
