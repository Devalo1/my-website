/**
 * Script pentru fixarea header-ului pe pagina ONG - Făuritorii de Destin
 * 
 * Acest script asigură că header-ul este afișat corect pe pagina ONG
 * și menține consistența cu celelalte pagini ale site-ului.
 */

document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth > 768) {
    console.log('Ecran mare detectat, se aplică corecțiile pentru header pe pagina ONG');
    
    // Verifică dacă suntem pe pagina ONG
    const isOngPage = window.location.pathname.includes('ong');
    
    if (isOngPage) {
      fixOngHeader();
    } else {
      // Pe alte pagini, aplicăm fix-ul general
      console.log('Nu suntem pe pagina ONG, se aplică fix-ul general pentru header');
    }
  } else {
    console.log('Ecran mic detectat, nu sunt necesare corecții pentru header-ul desktop.');
  }
});

// Funcție pentru a corecta header-ul pe pagina ONG
function fixOngHeader() {
  const header = document.querySelector('header');
  if (!header) {
    console.warn('Header-ul nu a fost găsit pe pagina ONG, se creează un nou header');
    createOngHeader();
    return;
  }
  
  // Asigură vizibilitatea
  header.style.display = 'block';
  header.style.visibility = 'visible';
  
  // Actualizează titlul pentru pagina ONG
  const headerTitle = header.querySelector('h1');
  const headerDesc = header.querySelector('p');
  
  if (headerTitle) headerTitle.textContent = 'Făuritorii de Destin';
  if (headerDesc) headerDesc.textContent = 'Organizația noastră non-profit';
  
  // Asigură-te că navigația este vizibilă pe desktop
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.style.display = 'flex';
    
    // Marchează link-ul ONG ca activ
    const ongLink = Array.from(nav.querySelectorAll('a')).find(a => 
      a.textContent.toLowerCase().includes('făuritori') || 
      a.textContent.toLowerCase().includes('destin') ||
      a.textContent.toLowerCase().includes('ong')
    );
    
    if (ongLink) {
      // Elimină clasa active de pe toate link-urile
      nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      // Adaugă clasa active pe link-ul ONG
      ongLink.classList.add('active');
    }
  }
}

// Funcție pentru a crea un header nou specific pentru pagina ONG
function createOngHeader() {
  const header = document.createElement('header');
  header.innerHTML = `
    <h1>Făuritorii de Destin</h1>
    <p>Organizația noastră non-profit</p>
  `;
  
  // Adaugă header-ul la începutul body
  document.body.insertBefore(header, document.body.firstChild);
  console.log('Header nou creat și adăugat la pagina ONG');
}

// Verifică header-ul și după încărcarea completă a paginii
window.addEventListener('load', function() {
  if (window.innerWidth > 768 && window.location.pathname.includes('ong')) {
    console.log('Verificare finală pentru header ONG după încărcarea completă a paginii');
    fixOngHeader();
  }
});
