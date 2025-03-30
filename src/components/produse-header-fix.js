/**
 * Script special pentru corectarea header-ului în paginile site-ului
 * Acest script verifică și forțează afișarea header-ului pe desktop
 */

document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth > 768) {
    console.log('Ecran mare detectat, se aplică corecțiile pentru header');
    
    // Verifică dacă suntem pe pagina de produse sau pe oricare altă pagină
    const isProdusePage = window.location.pathname.includes('products');
    const pagePrefix = isProdusePage ? 'Produse - ' : '';
    
    // Verifică header și aplică corecțiile
    fixHeaderForAllPages(pagePrefix);
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
      
      // Asigură-te că titlul și descrierea sunt corecte pentru pagina curentă
      updateHeaderContent();
    }
  }
});

// Funcție pentru a actualiza conținutul header-ului în funcție de pagina curentă
function updateHeaderContent() {
  const header = document.querySelector('header');
  if (!header) return;
  
  const path = window.location.pathname;
  let title = 'Lupul și Corbul';
  let description = 'Prăjituri artizanale & Suplimente naturale';
  
  // Setează titlul și descrierea în funcție de pagină
  if (path.includes('products')) {
    title = 'Produsele Noastre';
    description = 'Prăjituri și suplimente naturale de calitate';
  } else if (path.includes('ong')) {
    title = 'Făuritorii de Destin';
    description = 'Organizația noastră non-profit';
  } else if (path.includes('therapy')) {
    title = 'Terapie Personalizată';
    description = 'Servicii de terapie adaptate nevoilor tale';
  } else if (path.includes('contact')) {
    title = 'Contact';
    description = 'Contactează-ne pentru mai multe informații';
  }
  
  // Actualizează titlul și descrierea
  const headerTitle = header.querySelector('h1');
  const headerDesc = header.querySelector('p');
  
  if (headerTitle) headerTitle.textContent = title;
  if (headerDesc) headerDesc.textContent = description;
}

// Funcție pentru a aplica corecții header pentru toate paginile
function fixHeaderForAllPages(pagePrefix) {
  const header = document.querySelector('header');
  if (!header) {
    console.warn('Header-ul nu a fost găsit, se creează un nou header');
    createHeader(pagePrefix);
    return;
  }
  
  // Asigură vizibilitatea
  header.style.display = 'block';
  header.style.visibility = 'visible';
  
  // Asigură-te că navigația este vizibilă pe desktop
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.style.display = 'flex';
  } else {
    console.warn('Navigația principală nu a fost găsită');
  }
}

// Funcție pentru a crea un header nou dacă nu există
function createHeader(pagePrefix) {
  const header = document.createElement('header');
  header.innerHTML = `
    <h1>${pagePrefix}Lupul și Corbul</h1>
    <p>Prăjituri artizanale & Suplimente naturale</p>
  `;
  
  // Adaugă header-ul la începutul body
  document.body.insertBefore(header, document.body.firstChild);
  console.log('Header nou creat și adăugat la pagină');
}
