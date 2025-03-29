/**
 * Script special pentru a asigura funcționarea corectă a meniului mobil pe pagina ONG
 * Acest script ajută la eliminarea conflictelor între diferitele implementări
 */

(function() {
  // Execută doar pe mobil și doar pe pagina ONG
  if (window.innerWidth > 768) return;
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage !== 'ong.html') return;
  
  console.log('ONG Header Fix: Inițiere corectare meniu mobil pentru pagina ONG');
  
  // Funcție pentru a verifica și corecta meniul mobil
  function fixMobileMenu() {
    // 1. Verifică dacă meniul din auto-inject.js a fost injectat corect
    const hamburgerMenu = document.getElementById('hamburger-mobile-menu-v7');
    const hamburgerButton = document.getElementById('hamburger-button-v7');
    
    if (!hamburgerMenu || !hamburgerButton || window.getComputedStyle(hamburgerButton).display === 'none') {
      console.log('ONG Header Fix: Meniul mobil lipsește sau este ascuns, se forțează reconstrucția');
      
      // Șterge orice meniuri de urgență existente pentru a evita duplicatele
      document.querySelectorAll('[id*="emergency"], [id*="instant-mobile"]').forEach(el => el.remove());
      
      // Forțează reîncărcarea auto-inject.js
      const script = document.createElement('script');
      script.src = 'auto-inject.js?nocache=' + new Date().getTime();
      document.head.appendChild(script);
    }
    
    // 2. Ascunde elementele de header care nu sunt necesare pe mobil
    const header = document.querySelector('header');
    if (header) {
      // Simplifică header-ul pentru mobil
      header.style.cssText = `
        height: 60px !important;
        min-height: 60px !important;
        max-height: 60px !important;
        background: transparent !important;
        position: relative !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
      
      // Ascunde toate elementele din header în afară de cele create de auto-inject.js
      Array.from(header.children).forEach(child => {
        // Nu ascunde elementele create de auto-inject.js
        if (!child.id || 
            !child.id.includes('v7')) {
          child.style.display = 'none';
        }
      });
    }
  }
  
  // Execută verificarea de mai multe ori pentru a prinde toate cazurile
  // Imediat
  setTimeout(fixMobileMenu, 0);
  
  // După încărcarea DOM-ului
  document.addEventListener('DOMContentLoaded', fixMobileMenu);
  
  // După încărcarea completă a paginii
  window.addEventListener('load', fixMobileMenu);
  
  // Periodic pentru a prinde orice modificări ulterioare
  setInterval(fixMobileMenu, 1000);
})();
