/**
 * SCRIPT ULTRA-SIMPLIFICAT - SOLUȚIE DEFINITIVĂ
 * Rezolvă problemele de performanță și header-ul lipsă pe produse.html
 */

(function() {
  // Execută imediat - nu aștepta încărcarea
  console.log('ULTRA-FIX: Script în execuție');
  
  // FIXARE HEADER PENTRU PRODUSE.HTML
  function fixProduseHeader() {
    // Verifică dacă suntem pe pagina produse.html și pe desktop
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'produse.html' && window.innerWidth > 768) {
      console.log('ULTRA-FIX: Reparare header pentru produse.html');
      
      // Adaugă stiluri directe pentru header
      const style = document.createElement('style');
      style.textContent = `
        @media (min-width: 769px) {
          header {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            height: auto !important;
            min-height: 60px !important;
            width: 100% !important;
            background-color: rgba(0, 0, 0, 0.8) !important;
            z-index: 1000 !important;
            padding: 1rem 0 !important;
            margin-bottom: 20px !important;
          }
          
          header a.logo {
            position: fixed !important;
            top: 10px !important;
            left: 10px !important;
            max-width: 100px !important;
            z-index: 1001 !important;
          }
          
          header a.logo img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          #main-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 2rem !important;
            padding: 1rem 2rem !important;
            background-color: #8b5a2b !important;
            width: 100% !important;
          }
          
          #main-nav a {
            display: inline-block !important;
            color: white !important;
            text-decoration: none !important;
            font-weight: bold !important;
            padding: 0.5rem 1rem !important;
            border-radius: 5px !important;
          }
          
          #main-nav a[href="produse.html"] {
            background-color: #6b4423 !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Verifică și creează/repară header-ul
      let header = document.querySelector('header');
      if (!header) {
        header = document.createElement('header');
        document.body.insertBefore(header, document.body.firstChild);
      }
      
      // Verifică conținutul header-ului
      if (!header.querySelector('#main-nav')) {
        header.innerHTML = `
          <a href="index.html" class="logo">
            <img src="images/Logo.png" alt="Lupul și Corbul">
          </a>
          <nav id="main-nav">
            <a href="index.html">Acasă</a>
            <a href="produse.html">Produse</a>
            <a href="ong.html">Făuritorii de Destin</a>
            <a href="terapie.html">Terapie Personalizată</a>
            <a href="contact.html">Contact</a>
          </nav>
        `;
      }
    }
  }
  
  // ASCUNDE LOGO MARE PE ONG.HTML ÎN VERSIUNEA MOBILĂ
  function fixOngMobile() {
    // Verifică dacă suntem pe pagina ong.html și pe mobil
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'ong.html' && window.innerWidth <= 768) {
      console.log('ULTRA-FIX: Ascundere logo mare pentru ong.html pe mobil');
      
      // Adaugă stiluri pentru a ascunde logo mare
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          header img:not(#site-logo-v7 img), 
          header > a > img,
          header .logo:not(#site-logo-v7),
          .hero-image,
          img[width="500"],
          img[width="600"],
          img[width="700"],
          img[width="800"],
          img[width="900"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            left: -9999px !important;
          }
          
          header, .header {
            height: 60px !important;
            min-height: 60px !important;
            max-height: 60px !important;
            background: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // OPTIMIZĂRI DE PERFORMANȚĂ
  function improvePerformance() {
    console.log('ULTRA-FIX: Aplicare optimizări de performanță');
    
    // 1. Eliminare script-uri redundante
    const scriptIds = [
      'emergency-mobile-menu-script', 
      'force-mobile-menu-styles'
    ];
    
    scriptIds.forEach(id => {
      const script = document.getElementById(id);
      if (script) {
        script.remove();
        console.log(`ULTRA-FIX: Script eliminat: ${id}`);
      }
    });
    
    // 2. Setarea priorităților pentru scripturile importante
    document.querySelectorAll('script').forEach(script => {
      if (script.src && (
        script.src.includes('auto-inject.js') || 
        script.src.includes('ultra-fix.js')
      )) {
        // Dă prioritate scripturilor esențiale
        script.async = false;
        script.defer = true;
      } else if (!script.src) {
        // Este un script inline, nu face nimic
      } else {
        // Scripturile externe non-esențiale pot fi async
        script.async = true;
      }
    });
  }
  
  // Execută imediat reparațiile
  fixProduseHeader();
  fixOngMobile();
  improvePerformance();
  
  // Execută din nou după încărcarea DOM
  document.addEventListener('DOMContentLoaded', function() {
    fixProduseHeader();
    fixOngMobile();
    improvePerformance();
  });
  
  // Execută din nou după încărcarea completă a paginii
  window.addEventListener('load', function() {
    fixProduseHeader();
    fixOngMobile();
    
    // Verifică din nou header-ul produse.html după o secundă
    if (window.location.pathname.split('/').pop() === 'produse.html') {
      setTimeout(fixProduseHeader, 1000);
    }
  });
})();
