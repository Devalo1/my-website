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
      .page-products-mobile .products-grid,
      .page-ong-mobile .programs-grid,
      .page-therapy-mobile .therapy-services,
      .page-contact-mobile .contact-content {
        margin-top: 60px !important;
      }
    }
  `;
  
  // Inject style into document head
  document.head.appendChild(style);
  
  // Function to detect current page
  function detectCurrentPage() {
    const path = window.location.pathname;
    let pageName = 'home';
    
    if (path.includes('products')) pageName = 'products';
    else if (path.includes('ong')) pageName = 'ong';
    else if (path.includes('therapy')) pageName = 'therapy';
    else if (path.includes('contact')) pageName = 'contact';
    
    // Add mobile class to the body to enable mobile-specific styles
    document.body.classList.add(`page-${pageName}-mobile`);
    return pageName;
  }
  
  // Create mobile interface elements
  function createMobileInterface() {
    const currentPage = detectCurrentPage();
    
    // Create hamburger button
    const hamburgerButton = document.createElement('button');
    hamburgerButton.id = 'hamburger-button-v7';
    hamburgerButton.innerHTML = '☰';
    hamburgerButton.setAttribute('aria-label', 'Meniu');
    document.body.appendChild(hamburgerButton);
    
    // Create logo
    const logoContainer = document.createElement('div');
    logoContainer.id = 'site-logo-v7';
    
    const logo = document.createElement('img');
    logo.src = '/my-website/images/Logo.svg';
    logo.alt = 'Lupul și Corbul';
    logo.onerror = function() {
      // Use text fallback if image doesn't load
      this.style.display = 'none';
      logoContainer.innerHTML = '<div style="color: #6b4423; font-weight: bold; font-size: 16px;">Lupul și Corbul</div>';
    };
    
    logoContainer.appendChild(logo);
    document.body.appendChild(logoContainer);
    
    // Create right side buttons container (profile & cart)
    const rightButtons = document.createElement('div');
    rightButtons.id = 'right-buttons-v7';
    
    // Profile button
    const profileButton = document.createElement('button');
    profileButton.className = 'action-button-v7';
    profileButton.id = 'profile-button-mobile-v7';
    profileButton.setAttribute('aria-label', 'Profil');
    
    const profileImg = document.createElement('img');
    profileImg.src = '/my-website/images/profi.png';
    profileImg.alt = 'Profil';
    profileImg.onerror = function() {
      this.outerHTML = '<i style="font-family: sans-serif;">👤</i>';
    };
    
    profileButton.appendChild(profileImg);
    
    // Cart button
    const cartButton = document.createElement('button');
    cartButton.className = 'action-button-v7';
    cartButton.setAttribute('aria-label', 'Coș cumpărături');
    
    const cartImg = document.createElement('img');
    cartImg.src = '/my-website/images/bag.png';
    cartImg.alt = 'Coș';
    cartImg.onerror = function() {
      this.outerHTML = '<i style="font-family: sans-serif;">🛒</i>';
    };
    
    cartButton.appendChild(cartImg);
    
    // Optional: Add cart count badge
    const cartCount = document.createElement('span');
    cartCount.id = 'cart-count-v7';
    cartCount.textContent = '0';
    cartCount.style.display = 'none'; // Hide initially
    cartButton.appendChild(cartCount);
    
    rightButtons.appendChild(profileButton);
    rightButtons.appendChild(cartButton);
    document.body.appendChild(rightButtons);
    
    // Create navigation menu
    const navigationMenu = document.createElement('div');
    navigationMenu.id = 'navigation-menu-v7';
    
    const menuHeader = document.createElement('div');
    menuHeader.className = 'menu-header';
    menuHeader.innerHTML = `
      <span>Meniu Navigare</span>
      <button id="close-menu-v7">&times;</button>
    `;
    
    const menuLinks = document.createElement('div');
    menuLinks.innerHTML = `
      <a href="/my-website/" class="${currentPage === 'home' ? 'active' : ''}">Acasă</a>
      <a href="/my-website/products" class="${currentPage === 'products' ? 'active' : ''}">Produse</a>
      <a href="/my-website/ong" class="${currentPage === 'ong' ? 'active' : ''}">Făuritorii de Destin</a>
      <a href="/my-website/therapy" class="${currentPage === 'therapy' ? 'active' : ''}">Terapie Personalizată</a>
      <a href="/my-website/contact" class="${currentPage === 'contact' ? 'active' : ''}">Contact</a>
    `;
    
    navigationMenu.appendChild(menuHeader);
    navigationMenu.appendChild(menuLinks);
    document.body.appendChild(navigationMenu);
    
    // Create overlay for menu background
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'menu-overlay-v7';
    document.body.appendChild(menuOverlay);
    
    // Add event listeners
    hamburgerButton.addEventListener('click', function() {
      navigationMenu.classList.add('open');
      menuOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    document.getElementById('close-menu-v7').addEventListener('click', function() {
      navigationMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      document.body.style.overflow = ''; // Restore scrolling
    });
    
    menuOverlay.addEventListener('click', function() {
      navigationMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Set up profile button functionality
    profileButton.addEventListener('click', function() {
      // Simple redirect to login page for now
      // In a full implementation, you'd check login status and show dropdown
      window.location.href = '/my-website/login';
    });
    
    // Set up cart button functionality
    cartButton.addEventListener('click', function() {
      // Update and show cart count badge as a visual feedback
      const count = parseInt(cartCount.textContent || '0');
      cartCount.textContent = (count + 1).toString();
      cartCount.style.display = 'flex';
      
      // Actual cart functionality would go here
      alert('Coșul de cumpărături va fi implementat în curând!');
    });
    
    console.log('Mobile navigation interface created successfully');
  }
  
  // Set up observers to ensure our mobile interface stays on top
  function setupMobileInterfaceObserver() {
    const observer = new MutationObserver(function(mutations) {
      // Re-establish our mobile elements if they were removed
      if (!document.getElementById('hamburger-button-v7')) {
        console.log('Mobile interface elements missing, recreating...');
        createMobileInterface();
      }
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    console.log('Mobile interface observer set up');
  }
  
  // Initialize mobile interface
  createMobileInterface();
  setupMobileInterfaceObserver();
  
  // Mark as initialized to prevent duplicate execution
  window.mobileMenuInitialized = true;
})();
