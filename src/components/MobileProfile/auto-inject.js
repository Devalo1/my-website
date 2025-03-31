/**
 * SCRIPT SIMPLIFICAT PENTRU MENIU MOBIL - V7.0
 * 
 * Versiune ultra-robustă cu implementare directă:
 * - Garantează funcționarea butonului hamburger
 * - Afișare corectă pe toate paginile
 * - Fără animații complexe care pot eșua
 */

(function() {
  // Fix for duplicate paths that might be causing preload issues
  function fixDuplicatePaths() {
    // Fix any preload links with duplicate paths
    document.querySelectorAll('link[rel="preload"]').forEach(link => {
      if (link.href.includes('/my-website/my-website/')) {
        const fixedHref = link.href.replace('/my-website/my-website/', '/my-website/');
        link.href = fixedHref;
        console.log('Fixed duplicate path in preload link');
      }
    });
  }
  
  // Run path fix immediately
  fixDuplicatePaths();
  
  // Execute only on mobile devices
  if (window.innerWidth > 768) {
    console.log('Auto-inject: Desktop detected, script not executed');
    return;
  }
  
  console.log('Auto-inject: Mobile detected, initializing mobile interface');
  
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
      
      /* Page specific adjustments */
      .page-home-mobile .hero,
      .page-products-mobile .products-page,
      .page-ong-mobile .ong-page,
      .page-therapy-mobile .therapy-page,
      .page-contact-mobile .contact-page {
        margin-top: 60px !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Create mobile UI elements
  function createMobileUI() {
    // Hamburger button
    const hamburgerButton = document.createElement('button');
    hamburgerButton.id = 'hamburger-button-v7';
    hamburgerButton.innerHTML = '☰';
    hamburgerButton.setAttribute('aria-label', 'Menu');
    document.body.appendChild(hamburgerButton);
    
    // Logo
    const logo = document.createElement('a');
    logo.id = 'site-logo-v7';
    logo.href = '/my-website/';
    
    const logoImg = document.createElement('img');
    logoImg.src = '/my-website/images/Logo.png';
    logoImg.alt = 'Site Logo';
    logoImg.onerror = function() {
      // Fallback if logo image doesn't exist
      this.style.display = 'none';
      logo.style.display = 'none';
    };
    
    logo.appendChild(logoImg);
    document.body.appendChild(logo);
    
    // Right buttons (profile and cart)
    const rightButtons = document.createElement('div');
    rightButtons.id = 'right-buttons-v7';
    
    // Profile button
    const profileButton = document.createElement('div');
    profileButton.className = 'action-button-v7';
    profileButton.id = 'profile-button-v7';
    
    const profileImg = document.createElement('img');
    profileImg.src = '/my-website/images/profi.png';
    profileImg.alt = 'Profile';
    profileImg.onerror = function() {
      this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b4423"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    };
    
    profileButton.appendChild(profileImg);
    rightButtons.appendChild(profileButton);
    
    // Cart button
    const cartButton = document.createElement('div');
    cartButton.className = 'action-button-v7';
    cartButton.id = 'cart-button-v7';
    
    const cartImg = document.createElement('img');
    cartImg.src = '/my-website/images/bag.png';
    cartImg.alt = 'Cart';
    cartImg.onerror = function() {
      this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b4423"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>';
    };
    
    // Get cart count from localStorage
    let cartCount = 0;
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
    
    // Add count badge if needed
    if (cartCount > 0) {
      const countBadge = document.createElement('div');
      countBadge.id = 'cart-count-v7';
      countBadge.textContent = cartCount > 9 ? '9+' : cartCount;
      cartButton.appendChild(countBadge);
    }
    
    cartButton.appendChild(cartImg);
    rightButtons.appendChild(cartButton);
    document.body.appendChild(rightButtons);
    
    // Create navigation menu
    const navigationMenu = document.createElement('nav');
    navigationMenu.id = 'navigation-menu-v7';
    
    // Detect current page for menu highlighting
    const path = window.location.pathname;
    const isHomePage = path === '/' || path.endsWith('/my-website/') || path.includes('/index.html');
    const isProductsPage = path.includes('/products');
    const isOngPage = path.includes('/ong');
    const isTherapyPage = path.includes('/therapy');
    const isContactPage = path.includes('/contact');
    
    // Set appropriate page class on body
    document.body.classList.add(isHomePage ? 'page-home-mobile' : 
                                isProductsPage ? 'page-products-mobile' :
                                isOngPage ? 'page-ong-mobile' :
                                isTherapyPage ? 'page-therapy-mobile' :
                                isContactPage ? 'page-contact-mobile' : 'page-other-mobile');
    
    navigationMenu.innerHTML = `
      <div class="menu-header">
        <h3>Meniu</h3>
        <button id="close-menu-v7">&times;</button>
      </div>
      <a href="/my-website/" class="${isHomePage ? 'active' : ''}">Acasă</a>
      <a href="/my-website/products" class="${isProductsPage ? 'active' : ''}">Produse</a>
      <a href="/my-website/ong" class="${isOngPage ? 'active' : ''}">Făuritorii de Destin</a>
      <a href="/my-website/therapy" class="${isTherapyPage ? 'active' : ''}">Terapie Personalizată</a>
      <a href="/my-website/contact" class="${isContactPage ? 'active' : ''}">Contact</a>
    `;
    
    document.body.appendChild(navigationMenu);
    
    // Create overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'menu-overlay-v7';
    document.body.appendChild(menuOverlay);
    
    // Add event listeners
    hamburgerButton.addEventListener('click', function() {
      navigationMenu.classList.add('open');
      menuOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    
    document.getElementById('close-menu-v7').addEventListener('click', function() {
      navigationMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    menuOverlay.addEventListener('click', function() {
      navigationMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    
    // Profile and cart button functionality
    profileButton.addEventListener('click', function() {
      // Check if user is logged in
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('user'));
      } catch (e) {}
      
      if (user) {
        // Show profile options
        alert(`Bun venit, ${user.name || user.email}!`);
      } else {
        // Show login options
        if (confirm('Trebuie să fii autentificat pentru a vedea profilul tău. Vrei să te autentifici?')) {
          window.location.href = '/my-website/login';
        }
      }
    });
    
    cartButton.addEventListener('click', function() {
      // Show cart
      let cartItems = [];
      try {
        cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      } catch (e) {}
      
      if (cartItems.length === 0) {
        alert('Coșul tău este gol.');
      } else {
        // Redirect to cart page or show cart popup
        window.location.href = '/my-website/cart';
      }
    });
  }
  
  // Hide any existing mobile menus to avoid conflicts
  function hideExistingMobileMenus() {
    const selectors = [
      'nav.mobile', 
      '#mobile-nav', 
      '.mobile-nav',
      '#mobile-menu',
      '.hamburger-menu',
      '#navigation-menu:not(#navigation-menu-v7)',
      '.menu-toggle',
      '.mobile-menu-toggle'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        }
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createMobileUI();
      hideExistingMobileMenus();
    });
  } else {
    createMobileUI();
    hideExistingMobileMenus();
  }
  
  // Ensure mobile menu is visible even after script interference
  window.addEventListener('load', function() {
    hideExistingMobileMenus();
    
    // Ensure our buttons are visible
    const hamburgerButton = document.getElementById('hamburger-button-v7');
    const siteLogoV7 = document.getElementById('site-logo-v7');
    const rightButtonsV7 = document.getElementById('right-buttons-v7');
    
    if (hamburgerButton) hamburgerButton.style.display = 'block';
    if (siteLogoV7) siteLogoV7.style.display = 'block';
    if (rightButtonsV7) rightButtonsV7.style.display = 'flex';
  });
})();
