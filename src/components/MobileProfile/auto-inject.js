/**
 * SCRIPT SIMPLIFICAT PENTRU MENIU MOBIL - V7.0
 * 
 * Versiune ultra-robustă cu implementare directă:
 * - Garantează funcționarea butonului hamburger
 * - Afișare corectă pe toate paginile
 * - Fără animații complexe care pot eșua
 */

(function() {
  // Flag pentru debugging
  const DEBUG = true;
  function debug(message) {
    if (DEBUG) console.log("AutoInject: " + message);
  }
  
  debug("Script inițiat");
  
  // VERIFICARE STRICTĂ - Rulează doar pe mobil - VERIFICARE DUBLĂ
  if (window.innerWidth > 768 || document.documentElement.clientWidth > 768) {
    debug('Ecran desktop detectat, script oprit.');
    return;
  }
  
  // Folosește un ID specific pentru a verifica dacă meniul e deja injectat
  if (document.getElementById('hamburger-mobile-menu-v7')) return;
  
  // Creează și adaugă stilurile direct
  const style = document.createElement('style');
  style.textContent = `
    /* Stiluri pentru meniul mobil V7 */
    #hamburger-button-v7 {
      position: fixed;
      top: 10px;
      left: 10px;
      width: 40px;
      height: 40px;
      background: #6b4423;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 24px;
      z-index: 100000;
      cursor: pointer;
    }
    
    #site-logo-v7 {
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      height: 40px;
      z-index: 100000;
    }
    
    #site-logo-v7 img {
      height: 100%;
      width: auto;
    }
    
    #right-buttons-v7 {
      position: fixed;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 10px;
      z-index: 100000;
    }
    
    .action-button-v7 {
      width: 35px;
      height: 35px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .action-button-v7 img {
      width: 60%;
      height: 60%;
    }
    
    #cart-count-v7 {
      position: absolute;
      top: -5px;
      right: -5px;
      background: red;
      color: white;
      font-size: 10px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    #navigation-menu-v7 {
      position: fixed;
      top: 0;
      left: 0;
      width: 80%;
      max-width: 300px;
      height: 100%;
      background: white;
      z-index: 100001;
      box-shadow: 2px 0 5px rgba(0,0,0,0.3);
      transform: translateX(-100%);
      transition: transform 0.3s;
    }
    
    #navigation-menu-v7.open {
      transform: translateX(0);
    }
    
    #navigation-menu-v7 .menu-header {
      background: #6b4423;
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    #navigation-menu-v7 .menu-header button {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }
    
    #navigation-menu-v7 a {
      display: block;
      padding: 15px;
      border-bottom: 1px solid #eee;
      color: #333;
      text-decoration: none;
    }
    
    #navigation-menu-v7 a.active {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    
    #menu-overlay-v7 {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 100000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    
    #menu-overlay-v7.open {
      opacity: 1;
      pointer-events: auto;
    }
    
    body {
      padding-top: 60px;
    }
    
    /* Ascunde elementele din header pe toate paginile pe mobil */
    @media (max-width: 768px) {
      header, .header {
        min-height: 60px !important;
        max-height: 60px !important;
        height: 60px !important;
        position: relative !important;
        background: none !important;
      }
      
      header img:not(#site-logo-v7 img),
      header .logo:not(#site-logo-v7),
      header a:not(#site-logo-v7) img,
      .header img:not(#site-logo-v7 img),
      .header .logo:not(#site-logo-v7),
      .header a:not(#site-logo-v7) img,
      #main-nav:not(#navigation-menu-v7),
      img[src*="Logo"]:not(#site-logo-v7 img) {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        max-height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
      }
    }
    
    /* Stiluri extrem de agresive pentru toate paginile pe mobil */
    @media (max-width: 768px) {
      header *:not(#site-logo-v7):not(#site-logo-v7 *):not(#hamburger-button-v7):not(#right-buttons-v7):not(#right-buttons-v7 *),
      .header *:not(#site-logo-v7):not(#site-logo-v7 *):not(#hamburger-button-v7):not(#right-buttons-v7):not(#right-buttons-v7 *) {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        height: 0 !important;
        max-height: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        margin: 0 !important;
        padding: 0 !important;
        pointer-events: none !important;
      }
      
      /* Asigură-te că logo-ul nu e afectat de suprimarea header-ului */
      #site-logo-v7 {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        height: 40px !important;
        z-index: 100000 !important;
        pointer-events: auto !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Funcție pentru crearea interfeței mobile
  function createMobileInterface() {
    debug("Creare interfață mobilă");
    
    // Container principal
    const container = document.createElement('div');
    container.id = 'hamburger-mobile-menu-v7';
    
    // 1. Buton hamburger
    const menuButton = document.createElement('button');
    menuButton.id = 'hamburger-button-v7';
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Deschide meniul');
    container.appendChild(menuButton);
    
    // 2. Logo central
    const logo = document.createElement('a');
    logo.id = 'site-logo-v7';
    logo.href = 'index.html';
    
    const logoImg = document.createElement('img');
    logoImg.src = 'images/Logo.png';
    logoImg.alt = 'Logo';
    
    logo.appendChild(logoImg);
    container.appendChild(logo);
    
    // 3. Butoane dreapta
    const rightButtons = document.createElement('div');
    rightButtons.id = 'right-buttons-v7';
    
    // Buton profil
    const profileBtn = document.createElement('div');
    profileBtn.className = 'action-button-v7';
    profileBtn.id = 'profile-button-v7';
    
    const profileImg = document.createElement('img');
    profileImg.src = 'images/profi.png';
    profileImg.alt = 'Profil';
    
    profileBtn.appendChild(profileImg);
    rightButtons.appendChild(profileBtn);
    
    // Buton coș
    const cartBtn = document.createElement('div');
    cartBtn.className = 'action-button-v7';
    cartBtn.id = 'cart-button-v7';
    
    const cartImg = document.createElement('img');
    cartImg.src = 'images/bag.png';
    cartImg.alt = 'Coș';
    
    const cartCount = document.createElement('span');
    cartCount.id = 'cart-count-v7';
    cartCount.textContent = '0';
    
    cartBtn.appendChild(cartImg);
    cartBtn.appendChild(cartCount);
    rightButtons.appendChild(cartBtn);
    
    container.appendChild(rightButtons);
    
    // 4. Meniu de navigare
    const navMenu = document.createElement('div');
    navMenu.id = 'navigation-menu-v7';
    
    navMenu.innerHTML = `
      <div class="menu-header">
        <span>Meniu</span>
        <button id="close-menu-v7">×</button>
      </div>
      <a href="index.html">Acasă</a>
      <a href="produse.html">Produse</a>
      <a href="ong.html">Făuritorii de Destin</a>
      <a href="terapie.html">Terapie Personalizată</a>
      <a href="contact.html">Contact</a>
    `;
    
    container.appendChild(navMenu);
    
    // 5. Overlay
    const overlay = document.createElement('div');
    overlay.id = 'menu-overlay-v7';
    container.appendChild(overlay);
    
    // Adaugă elementele la body
    document.body.appendChild(container);
    
    // Verifică dacă suntem pe pagina ONG și modifică stilurile pentru această pagină
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'ong.html') {
      debug('Pagina ONG detectată - aplicare stiluri specifice pentru mobil');
      
      // Adăugăm atribut data pentru CSS mai specific
      document.body.setAttribute('data-page', 'ong');
      
      // Simplificăm funcția de ascundere pentru ONG - doar ascundem headerul original
      function optimizeOngHeaderForMobile() {
        const header = document.querySelector('header');
        if (header) {
          // Doar resetăm stilurile header-ului în loc să ascundem fiecare element
          header.style.cssText = `
            height: 60px !important;
            min-height: 60px !important;
            background: transparent !important;
            position: relative !important;
            z-index: 1 !important;
          `;
          
          // Ascundem doar navigația desktop și elementele care ar putea cauza probleme
          const desktopNav = header.querySelector('nav:not(#navigation-menu-v7)');
          if (desktopNav) {
            desktopNav.style.display = 'none';
          }
          
          // Eliminăm stilurile care ar putea interfera
          const conflictingStyles = document.querySelectorAll('style[id*="emergency"], style[id*="mobile-menu"]');
          conflictingStyles.forEach(style => {
            style.disabled = true;
          });
        }
      }
      
      // Aplicăm optimizarea de mai multe ori pentru a ne asigura că funcționează
      optimizeOngHeaderForMobile();
      setTimeout(optimizeOngHeaderForMobile, 100);
      window.addEventListener('load', optimizeOngHeaderForMobile);
    }
    
    // Funcționalitate buton hamburger - deschide meniul
    menuButton.addEventListener('click', function() {
      navMenu.classList.add('open');
      overlay.classList.add('open');
    });
    
    // Funcționalitate buton închidere - închide meniul
    document.getElementById('close-menu-v7').addEventListener('click', function() {
      navMenu.classList.remove('open');
      overlay.classList.remove('open');
    });
    
    // Overlay închide meniul
    overlay.addEventListener('click', function() {
      navMenu.classList.remove('open');
      overlay.classList.remove('open');
    });
    
    // Marcarea link-ului activ
    const links = navMenu.querySelectorAll('a');
    links.forEach(function(link) {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
      
      // Închide meniul la click pe link
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        overlay.classList.remove('open');
      });
    });
    
    // Actualizare număr elemente coș
    try {
      const items = JSON.parse(localStorage.getItem('cartItems')) || [];
      const count = items.reduce((total, item) => total + parseInt(item.quantity || 0), 0);
      cartCount.textContent = count.toString();
    } catch(e) {
      console.error('Eroare la citirea coșului', e);
    }
    
    // Funcționalitate buton profil - ÎMBUNĂTĂȚITĂ
    profileBtn.addEventListener('click', function(e) {
      debug("Click pe butonul de profil");
      e.preventDefault();
      e.stopPropagation();
      
      // Verifică dacă funcția globală există direct
      if (typeof window.openMobileProfileMenu === 'function') {
        debug("Folosesc funcția globală openMobileProfileMenu");
        window.openMobileProfileMenu();
        return;
      }
      
      // Verifică dacă există un controller dedicat
      if (window.MobileUserButton && typeof window.MobileUserButton.handleProfileButtonClick === 'function') {
        debug("Folosesc MobileUserButton.handleProfileButtonClick");
        window.MobileUserButton.handleProfileButtonClick(e);
        return;
      }
      
      // Verifică dacă scriptul dedicat există dar nu s-a inițializat complet
      if (typeof window.MobileUserButton !== 'undefined') {
        debug("Controller buton profil detectat dar incomplet");
        
        // Încearcă inițializarea explicită dacă funcția este disponibilă
        if (typeof window.MobileUserButton.initialize === 'function') {
          debug("Inițializez MobileUserButton");
          window.MobileUserButton.initialize();
          
          // Reîncearcă deschiderea după inițializare
          if (typeof window.MobileUserButton.openProfileMenu === 'function') {
            debug("Deschid meniu după inițializare");
            window.MobileUserButton.openProfileMenu();
            return;
          }
        }
      }
      
      // Comportament de rezervă - încărcare script dacă nu există
      debug("Scriptul dedicat nu există, încerc să-l încarc");
      
      // Verifică dacă scriptul e deja în curs de încărcare
      if (!document.querySelector('script[src="utilizator-button-function.js"]')) {
        const script = document.createElement('script');
        script.src = 'utilizator-button-function.js';
        script.onload = function() {
          debug("Script încărcat cu succes");
          // Încearcă deschiderea meniului după încărcare
          setTimeout(function() {
            if (typeof window.openMobileProfileMenu === 'function') {
              window.openMobileProfileMenu();
            } else if (window.MobileUserButton && typeof window.MobileUserButton.openProfileMenu === 'function') {
              window.MobileUserButton.openProfileMenu();
            } else {
              debug("Nu am putut găsi funcțiile necesare după încărcare");
              // Fallback extrem - alertă
              alert("Vă rugăm să vă conectați pentru a continua");
            }
          }, 300);
        };
        document.head.appendChild(script);
      }
      
      // Comportament de rezervă doar dacă scriptul dedicat nu e disponibil deloc
      debug("Folosesc comportament de rezervă pentru butonul de profil");
      const profileDetails = document.querySelector('.profile-details');
      if (profileDetails) {
        profileDetails.style.display = profileDetails.style.display === 'block' ? 'none' : 'block';
      } else {
        // Fallback extrem - alertă
        alert("Vă rugăm să vă conectați pentru a continua");
      }
    });
    
    // Funcționalitate buton coș
    cartBtn.addEventListener('click', function() {
      const cartDetails = document.querySelector('.cart-details');
      if (cartDetails) {
        cartDetails.style.display = cartDetails.style.display === 'block' ? 'none' : 'block';
      }
    });
  }
  
  // Execută crearea interfeței după încărcarea documentului
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMobileInterface);
  } else {
    // Dacă documentul e deja încărcat, creează interfața imediat
    createMobileInterface();
  }
  
  // Cleanup any visible code on the page that shouldn't be there
  function cleanupMobilePageDebris() {
    // Text fragments that shouldn't be visible
    const problematicFragments = [
      "ad> n ong-container",
      "ent.querySelector",
      "fo').style.display",
      "overlay.id",
      "document.body.appendChild",
      "Header L.js",
      "createMobileMenu",
      "setInterval"
    ];
    
    // Find and remove problematic text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToRemove = [];
    let node;
    while (node = walker.nextNode()) {
      // Skip script and style elements
      if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') {
        continue;
      }
      
      // Check for problematic content
      if (problematicFragments.some(fragment => node.textContent.includes(fragment))) {
        nodesToRemove.push(node);
      }
    }
    
    // Remove the problematic nodes
    nodesToRemove.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    
    debug(`Mobile cleanup: removed ${nodesToRemove.length} problematic text nodes`);
  }
  
  // Run cleanup after page load
  window.addEventListener('load', cleanupMobilePageDebris);
})();
