/**
 * Script special pentru corectarea header-ului în pagina produse.html
 * Acest script verifică și forțează afișarea header-ului pe desktop
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('produse-header-fix.js: Verificare și reparare header pentru pagina produse.html');
  
  // Verifică dacă suntem pe desktop
  if (window.innerWidth > 768) {
    console.log('Ecran mare detectat, verificăm header-ul...');
    
    // Verifică dacă există header și dacă este vizibil
    const header = document.querySelector('header');
    if (!header) {
      console.error('Header lipsește! Se creează unul nou.');
      const newHeader = document.createElement('header');
      document.body.insertBefore(newHeader, document.body.firstChild);
    } else {
      // Asigură-te că header-ul este vizibil
      header.style.display = 'block';
      header.style.visibility = 'visible';
      header.style.opacity = '1';
      console.log('Header existent verificat și corectat.');
    }
    
    // Forțează reinițializarea header-ului
    if (typeof initializeHeader === 'function') {
      console.log('Reinițializăm header-ul...');
      setTimeout(initializeHeader, 100);
    } else {
      console.warn('Funcția initializeHeader nu este disponibilă. Se încearcă încărcarea Header L.js');
      
      // Verifică dacă Header L.js este încărcat, dacă nu, îl încarcă
      if (!document.querySelector('script[src="Header L.js"]')) {
        const headerScript = document.createElement('script');
        headerScript.src = 'Header L.js';
        headerScript.onload = function() {
          console.log('Header L.js încărcat cu succes');
          if (typeof initializeHeader === 'function') {
            setTimeout(initializeHeader, 100);
          }
        };
        document.head.appendChild(headerScript);
      }
    }
  } else {
    console.log('Ecran mic detectat, nu sunt necesare corecții pentru header-ul desktop.');
  }
});

// Verifică și după ce toate resursele sunt încărcate
window.addEventListener('load', function() {
  if (window.innerWidth > 768) {
    console.log('Verificare finală pentru header după încărcarea completă a paginii');
    
    // Verifică starea header-ului
    const header = document.querySelector('header');
    const nav = document.getElementById('main-nav');
    
    if (header) {
      // Forțează stilurile pentru header
      header.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        min-height: 60px !important;
        position: relative !important;
        z-index: 1000 !important;
        background-color: rgba(0, 0, 0, 0.8) !important;
      `;
      console.log('Header forțat să fie vizibil');
    }
    
    if (!nav || window.getComputedStyle(nav).display === 'none') {
      console.warn('Meniul principal nu este vizibil, se încearcă forțarea afișării');
      
      // Reexecută funcția de inițializare cu prioritate maximă
      if (typeof initializeHeader === 'function') {
        initializeHeader();
      }
    }
  }
});
