/*
 * SUPER FORȚARE MENIU MOBIL - COD EXTREM DE AGRESIV
 * Acest script folosește tehnici extreme pentru a forța afișarea meniului pe mobil
 * Ignoră orice alt cod care încearcă să ascundă meniul
 */

// EXECUȚIE IMEDIATĂ - Nu așteaptă niciun eveniment
(function() {
  // Verifică dacă suntem pe mobil
  if (window.innerWidth > 768) {
    console.log('Header M.js: ecran mare detectat, script oprit');
    return;
  }
  
  console.log('FORȚĂ MAXIMĂ MENIU MOBIL: Început - FĂRĂ ÎNTÂRZIERE');
  
  // Flag global pentru a preveni multiple inițializări
  window.HEADER_M_INITIALIZED = window.HEADER_M_INITIALIZED || false;
  
  if (window.HEADER_M_INITIALIZED) {
    console.log('Header M.js deja inițializat, se oprește a doua execuție');
    return;
  }
  
  window.HEADER_M_INITIALIZED = true;
  
  // CREAZĂ STILURI ABSOLUTE - Nimic nu le poate suprascrie
  const forceStyle = document.createElement('style');
  forceStyle.id = 'force-mobile-menu-styles';
  forceStyle.innerHTML = `
    @media (max-width: 768px) {
      /* STILURI ABSOLUTE PENTRU HAMBURGER BUTTON */
      .menu-toggle, 
      button.menu-toggle,
      #mobile-menu-button,
      .mobile-menu-button,
      body .menu-toggle,
      header .menu-toggle,
      div .menu-toggle,
      nav .menu-toggle {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        min-height: 40px !important;
        padding: 0 !important;
        margin: 0 !important;
        background-color: #6b4423 !important;
        color: white !important;
        z-index: 2147483647 !important;
        border: none !important;
        border-radius: 5px !important;
        font-size: 24px !important;
        line-height: 40px !important;
        text-align: center !important;
        cursor: pointer !important;
        animation: none !important;
        transform: none !important;
        transition: none !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
        font-weight: bold !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        text-decoration: none !important;
        pointer-events: auto !important;
      }
      
      /* STILURI ABSOLUTE PENTRU LOGO */
      .logo,
      img.logo,
      a .logo,
      header .logo,
      .forced-logo,
      .site-logo {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        left: 10px !important;
        width: 80px !important;
        height: auto !important;
        max-width: 80px !important;
        z-index: 2147483646 !important;
        pointer-events: auto !important;
      }
      
      /* ASIGURĂ CĂ MENIUL MOBIL ESTE DEASUPRA CÂND ESTE DESCHIS */
      #mobile-nav.open,
      #mobile-nav[style*="translateX(0)"],
      nav#mobile-nav.open,
      .mobile-menu.open,
      .mobile-nav.open {
        transform: translateX(0) !important;
        left: 0 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* OVERLAY-UL TREBUIE AFIȘAT CORECT */
      .mobile-nav-overlay.open, 
      .mobile-overlay.open,
      .nav-overlay.open {
        display: block !important;
        visibility: visible !important;
        opacity: 0.7 !important;
      }
      
      /* ASCUNDE ALTE MENIURI DESKTOP */
      nav:not(#mobile-nav),
      .desktop-menu,
      #main-nav,
      .main-navigation:not(#mobile-nav),
      header > nav:not(#mobile-nav) {
        display: none !important;
      }
      
      /* STILURI SPECIFICE PENTRU FIECARE PAGINĂ */
      .page-home-mobile .hero-content,
      .page-products-mobile .products-content,
      .page-ong-mobile .ong-content,
      .page-therapy-mobile .therapy-content,
      .page-contact-mobile .contact-content {
        padding-top: 60px !important;
      }
      
      /* BUTOANE DE PROFIL ȘI COȘ */
      .profile-cart-buttons {
        position: fixed !important;
        top: 10px !important;
        right: 60px !important;
        display: flex !important;
        gap: 10px !important;
        z-index: 2147483645 !important;
      }
      
      .profile-button, .cart-button {
        width: 35px !important;
        height: 35px !important;
        border-radius: 50% !important;
        background: white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
      }
    }
  `;
  
  document.head.appendChild(forceStyle);
  
  // Detectează pagina curentă
  function detectCurrentPage() {
    const path = window.location.pathname;
    let pageName = 'home';
    
    if (path.includes('products')) pageName = 'products';
    else if (path.includes('ong')) pageName = 'ong';
    else if (path.includes('therapy')) pageName = 'therapy';
    else if (path.includes('contact')) pageName = 'contact';
    
    // Adaugă clasa paginii pe body pentru stiluri specifice
    document.body.classList.add(`page-${pageName}-mobile`);
    
    return pageName;
  }
  
  // Creează meniul mobil dacă nu există
  function createMobileMenu() {
    // Verifică dacă meniul există deja
    if (document.getElementById('mobile-nav')) {
      console.log('Meniul mobil există deja');
      return;
    }
    
    const currentPage = detectCurrentPage();
    console.log(`Pagina curentă detectată: ${currentPage}`);
    
    // Creează meniul mobil universal
    const mobileNav = document.createElement('nav');
    mobileNav.id = 'mobile-nav';
    mobileNav.style.cssText = `
      position: fixed;
      top: 0;
      left: -300px;
      width: 80%;
      max-width: 300px;
      height: 100%;
      background: white;
      z-index: 2147483645;
      transition: transform 0.3s ease;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    `;
    
    mobileNav.innerHTML = `
      <div style="padding: 20px; background: #6b4423; color: white; display: flex; justify-content: space-between; align-items: center;">
        <strong style="font-size: 18px;">Meniu</strong>
        <button id="close-mobile-nav" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div style="padding: 10px;">
        <a href="/my-website/" style="display: block; padding: 15px; border-bottom: 1px solid #eee; color: ${currentPage === 'home' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'home' ? 'bold' : 'normal'};">Acasă</a>
        <a href="/my-website/products" style="display: block; padding: 15px; border-bottom: 1px solid #eee; color: ${currentPage === 'products' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'products' ? 'bold' : 'normal'};">Produse</a>
        <a href="/my-website/ong" style="display: block; padding: 15px; border-bottom: 1px solid #eee; color: ${currentPage === 'ong' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'ong' ? 'bold' : 'normal'};">Făuritorii de Destin</a>
        <a href="/my-website/therapy" style="display: block; padding: 15px; border-bottom: 1px solid #eee; color: ${currentPage === 'therapy' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'therapy' ? 'bold' : 'normal'};">Terapie Personalizată</a>
        <a href="/my-website/contact" style="display: block; padding: 15px; color: ${currentPage === 'contact' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'contact' ? 'bold' : 'normal'};">Contact</a>
      </div>
    `;
    
    document.body.appendChild(mobileNav);
    
    // Creează overlay-ul
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 2147483644;
      display: none;
    `;
    document.body.appendChild(overlay);
    
    // Creează butonul de hamburger
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Meniu');
    document.body.appendChild(menuToggle);
    
    // Creează logo-ul
    const siteLogo = document.createElement('img');
    siteLogo.className = 'logo forced-logo';
    siteLogo.src = '/my-website/images/Logo.png';
    siteLogo.alt = 'Logo';
    document.body.appendChild(siteLogo);
    
    // Creează butoanele de profil și coș
    const profileCartButtons = document.createElement('div');
    profileCartButtons.className = 'profile-cart-buttons';
    
    const profileButton = document.createElement('button');
    profileButton.className = 'profile-button';
    profileButton.innerHTML = '👤';
    
    const cartButton = document.createElement('button');
    cartButton.className = 'cart-button';
    cartButton.innerHTML = '🛒';
    
    profileCartButtons.appendChild(profileButton);
    profileCartButtons.appendChild(cartButton);
    document.body.appendChild(profileCartButtons);
    
    // Adaugă evenimentele pentru deschiderea și închiderea meniului
    menuToggle.addEventListener('click', function() {
      mobileNav.style.transform = 'translateX(300px)';
      mobileNav.classList.add('open');
      overlay.style.display = 'block';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    
    document.getElementById('close-mobile-nav').addEventListener('click', function() {
      mobileNav.style.transform = 'translateX(0)';
      mobileNav.classList.remove('open');
      overlay.style.display = 'none';
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', function() {
      mobileNav.style.transform = 'translateX(0)';
      mobileNav.classList.remove('open');
      overlay.style.display = 'none';
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    // Adaugă funcționalitate butoanelor de profil și coș
    profileButton.addEventListener('click', function() {
      // Verifică dacă utilizatorul este autentificat
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('user'));
      } catch (e) {}
      
      if (user) {
        // Afișează opțiunile de profil
        alert(`Bine ai venit, ${user.name || user.email}!`);
      } else {
        // Afișează opțiunile de autentificare
        if (confirm('Trebuie să fii autentificat pentru a-ți vedea profilul. Dorești să te autentifici?')) {
          window.location.href = '/my-website/login';
        }
      }
    });
    
    cartButton.addEventListener('click', function() {
      // Verifică dacă există produse în coș
      let cartItems = [];
      try {
        cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      } catch (e) {}
      
      if (cartItems.length === 0) {
        alert('Coșul tău este gol.');
      } else {
        // Redirecționează către pagina coșului sau afișează un popup cu conținutul coșului
        alert(`Ai ${cartItems.length} produse în coș.`);
      }
    });
  }
  
  // Elimină alte meniuri care ar putea interfera
  function cleanupMenuElements() {
    // Selectori pentru elemente care ar trebui ascunse pe mobil
    const elementsToHide = [
      'header nav:not(#mobile-nav)',
      '.desktop-menu',
      'nav.desktop',
      '#main-nav',
      '.main-nav'
    ];
    
    elementsToHide.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
      });
    });
  }
  
  // Inițializare
  function initialize() {
    detectCurrentPage();
    createMobileMenu();
    cleanupMenuElements();
  }
  
  // Execută la încărcarea DOM-ului
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Execută din nou după încărcarea completă a paginii pentru a te asigura că meniul rămâne vizibil
  window.addEventListener('load', function() {
    detectCurrentPage();
    cleanupMenuElements();
    
    // Forțează stilurile pentru elementele importante
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.style.display = 'block';
      menuToggle.style.visibility = 'visible';
      menuToggle.style.opacity = '1';
    }
    
    const forcedLogo = document.querySelector('.forced-logo');
    if (forcedLogo) {
      forcedLogo.style.display = 'block';
      forcedLogo.style.visibility = 'visible';
      forcedLogo.style.opacity = '1';
    }
    
    const profileCartButtons = document.querySelector('.profile-cart-buttons');
    if (profileCartButtons) {
      profileCartButtons.style.display = 'flex';
      profileCartButtons.style.visibility = 'visible';
      profileCartButtons.style.opacity = '1';
    }
  });
  
  // Asigură-te că meniul rămâne vizibil chiar și după ce DOM-ul este manipulat
  const observer = new MutationObserver(function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const forcedLogo = document.querySelector('.forced-logo');
    const profileCartButtons = document.querySelector('.profile-cart-buttons');
    
    if (!menuToggle || menuToggle.style.display === 'none') {
      console.log('Butonul de meniu a fost ascuns sau șters, se recreează');
      initialize();
    }
    
    if (!forcedLogo || forcedLogo.style.display === 'none') {
      console.log('Logo-ul a fost ascuns sau șters, se recreează');
      initialize();
    }
    
    if (!profileCartButtons || profileCartButtons.style.display === 'none') {
      console.log('Butoanele de profil și coș au fost ascunse sau șterse, se recreează');
      initialize();
    }
  });
  
  // Observă modificările la <body> și copiii direcți
  observer.observe(document.body, { childList: true, subtree: true });
})();
