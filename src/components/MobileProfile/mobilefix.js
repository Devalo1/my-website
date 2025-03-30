/*
 * SOLUȚIE DIRECTĂ PENTRU MENIU MOBIL
 * Script independent care forțează afișarea meniului mobil
 */

(function() {
  function injectMenuNow() {
    // Creează stilurile necesare cu prioritate absolută
    const style = document.createElement('style');
    style.id = 'emergency-mobile-styles';
    style.innerHTML = `
      #emergency-menu-button {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        width: 40px !important;
        height: 40px !important;
        background-color: #6b4423 !important;
        color: white !important;
        font-size: 24px !important;
        line-height: 40px !important;
        text-align: center !important;
        border: none !important;
        border-radius: 5px !important;
        z-index: 999999999 !important;
        cursor: pointer !important;
      }
      
      #emergency-logo {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        left: 10px !important;
        width: 80px !important;
        z-index: 999999998 !important;
      }
      
      #emergency-menu {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 80% !important;
        max-width: 300px !important;
        height: 100% !important;
        background: white !important;
        z-index: 999999997 !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
        box-shadow: 2px 0 10px rgba(0,0,0,0.5) !important;
      }
      
      #emergency-menu.open {
        transform: translateX(0) !important;
      }
      
      #emergency-overlay {
        display: none !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.5) !important;
        z-index: 999999996 !important;
      }
      
      #emergency-overlay.open {
        display: block !important;
      }
      
      /* Add page-specific styles to ensure consistency across all pages */
      .page-home #emergency-menu-button,
      .page-products #emergency-menu-button,
      .page-ong #emergency-menu-button,
      .page-therapy #emergency-menu-button,
      .page-contact #emergency-menu-button {
        display: block !important;
      }
      
      /* Fix for scroll issues on certain pages */
      body.menu-open {
        overflow: hidden !important;
      }
    `;
    
    // Inject style tag into head
    document.head.appendChild(style);
    
    // Detect current page for proper menu links
    const currentPath = window.location.pathname;
    let currentPage = 'home';
    
    if (currentPath.includes('products')) currentPage = 'products';
    if (currentPath.includes('ong')) currentPage = 'ong';
    if (currentPath.includes('therapy')) currentPage = 'therapy';
    if (currentPath.includes('contact')) currentPage = 'contact';
    
    // Add page class to body
    document.body.classList.add(`page-${currentPage}`);
    
    // Create emergency menu button
    const menuButton = document.createElement('button');
    menuButton.id = 'emergency-menu-button';
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Meniu');
    document.body.appendChild(menuButton);
    
    // Create emergency logo
    const logo = document.createElement('img');
    logo.id = 'emergency-logo';
    logo.src = '/my-website/images/Logo.png';
    logo.setAttribute('alt', 'Lupul și Corbul Logo');
    logo.setAttribute('onerror', 'this.style.display="none"');
    document.body.appendChild(logo);
    
    // Create emergency menu
    const menu = document.createElement('nav');
    menu.id = 'emergency-menu';
    menu.innerHTML = `
      <div style="padding: 20px; background: #6b4423; color: white; display: flex; justify-content: space-between; align-items: center;">
        <strong>Meniu</strong>
        <button id="emergency-close" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="border-bottom: 1px solid #eee;"><a href="/my-website/" style="display: block; padding: 15px; color: #333; text-decoration: none; ${currentPage === 'home' ? 'font-weight: bold; background: #f5f5f5;' : ''}">Acasă</a></li>
        <li style="border-bottom: 1px solid #eee;"><a href="/my-website/products" style="display: block; padding: 15px; color: #333; text-decoration: none; ${currentPage === 'products' ? 'font-weight: bold; background: #f5f5f5;' : ''}">Produse</a></li>
        <li style="border-bottom: 1px solid #eee;"><a href="/my-website/ong" style="display: block; padding: 15px; color: #333; text-decoration: none; ${currentPage === 'ong' ? 'font-weight: bold; background: #f5f5f5;' : ''}">Făuritorii de Destin</a></li>
        <li style="border-bottom: 1px solid #eee;"><a href="/my-website/therapy" style="display: block; padding: 15px; color: #333; text-decoration: none; ${currentPage === 'therapy' ? 'font-weight: bold; background: #f5f5f5;' : ''}">Terapie Personalizată</a></li>
        <li><a href="/my-website/contact" style="display: block; padding: 15px; color: #333; text-decoration: none; ${currentPage === 'contact' ? 'font-weight: bold; background: #f5f5f5;' : ''}">Contact</a></li>
      </ul>
    `;
    document.body.appendChild(menu);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'emergency-overlay';
    document.body.appendChild(overlay);
    
    // Add event listeners
    menuButton.addEventListener('click', function() {
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('menu-open');
    });
    
    document.getElementById('emergency-close').addEventListener('click', function() {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
    
    overlay.addEventListener('click', function() {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
    
    // Emergency fix for any pre-existing mobile menus
    setTimeout(function() {
      const existingMobileMenus = document.querySelectorAll('nav.mobile, #mobile-nav, .mobile-nav');
      existingMobileMenus.forEach(function(mobileMenu) {
        mobileMenu.style.display = 'none';
      });
    }, 500);
  }
  
  // Check if it's a mobile device
  if (window.innerWidth <= 768) {
    // Execute immediately for faster display
    injectMenuNow();
  }
})();
