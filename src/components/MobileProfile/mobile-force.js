/**
 * SCRIPT DE FORȚARE PENTRU MENIU MOBIL
 * 
 * Acest script este o măsură secundară care asigură
 * că meniul mobil este disponibil și funcțional.
 */

(function() {
  // Execută doar pe ecrane de mobil
  if (window.innerWidth > 768) return;
  
  console.log('Mobile-force: Script de forțare pentru meniu mobil inițiat');
  
  // Adaugă stiluri critice pentru mobil
  const criticalStyles = document.createElement('style');
  criticalStyles.id = 'mobile-force-styles';
  criticalStyles.innerHTML = `
    @media (max-width: 768px) {
      body {
        padding-top: 60px !important; /* Spațiu pentru header */
      }
      
      .force-mobile-button {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        width: 40px !important;
        height: 40px !important;
        background-color: #ff4500 !important; /* Orange-red pentru distincție */
        color: white !important;
        font-size: 24px !important;
        line-height: 40px !important;
        text-align: center !important;
        border: none !important;
        border-radius: 5px !important;
        z-index: 9999999 !important;
        cursor: pointer !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.7) !important;
      }
      
      .force-mobile-logo {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        left: 10px !important;
        width: 80px !important;
        height: auto !important;
        z-index: 9999998 !important;
      }
      
      .force-mobile-logo img {
        width: 100% !important;
        height: auto !important;
      }
      
      .emergency-menu-panel {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 80% !important;
        max-width: 300px !important;
        height: 100% !important;
        background-color: white !important;
        z-index: 9999997 !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
        overflow-y: auto !important;
      }
      
      .emergency-menu-panel.visible {
        transform: translateX(0) !important;
      }
      
      .emergency-overlay {
        display: none;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0,0,0,0.7) !important;
        z-index: 9999996 !important;
      }
      
      .emergency-overlay.visible {
        display: block !important;
      }
      
      /* Page specific adjustments */
      .page-home .page-content,
      .page-products .produse-grid,
      .page-ong .ong-content,
      .page-therapy .therapy-page,
      .page-contact .contact-info {
        margin-top: 60px !important;
      }
      
      /* Profile and cart buttons position */
      .profile-cart-buttons {
        position: fixed !important;
        top: 10px !important;
        right: 60px !important;
        display: flex !important;
        gap: 10px !important;
        z-index: 9999999 !important;
      }
      
      /* Adjust for page-specific elements */
      .page-products .produs-card {
        width: 100% !important;
        margin: 10px 0 !important;
      }
      
      .page-ong .mission-card {
        width: 100% !important;
        margin: 10px 0 !important;
      }
    }
  `;
  
  document.head.appendChild(criticalStyles);
  
  // Detect current page for proper styling
  function detectCurrentPage() {
    const path = window.location.pathname;
    let pageName = 'home';
    
    if (path.includes('products')) pageName = 'products';
    else if (path.includes('ong')) pageName = 'ong';
    else if (path.includes('therapy')) pageName = 'therapy';
    else if (path.includes('contact')) pageName = 'contact';
    
    document.body.classList.add(`page-${pageName}`);
    return pageName;
  }
  
  // Ensure menu button exists
  function ensureMobileMenu() {
    if (!document.querySelector('.force-mobile-button')) {
      // Create menu button
      const menuButton = document.createElement('button');
      menuButton.className = 'force-mobile-button';
      menuButton.innerHTML = '☰';
      menuButton.setAttribute('aria-label', 'Meniu');
      document.body.appendChild(menuButton);
      
      // Create menu structure
      createMobileMenuStructure();
    }
  }
  
  // Create full menu structure
  function createMobileMenuStructure() {
    const currentPage = detectCurrentPage();
    
    // Create logo
    if (!document.querySelector('.force-mobile-logo')) {
      const logoContainer = document.createElement('div');
      logoContainer.className = 'force-mobile-logo';
      
      const logo = document.createElement('img');
      logo.src = '/my-website/images/Logo.png';
      logo.alt = 'Lupul și Corbul';
      logo.onerror = function() {
        this.style.display = 'none';
      };
      
      logoContainer.appendChild(logo);
      document.body.appendChild(logoContainer);
    }
    
    // Create panel for menu
    if (!document.querySelector('.emergency-menu-panel')) {
      const menuPanel = document.createElement('div');
      menuPanel.className = 'emergency-menu-panel';
      
      menuPanel.innerHTML = `
        <div style="padding: 15px; background: #6b4423; color: white; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold;">Meniu</span>
          <button class="close-menu-button" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 15px;">
          <nav>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 10px;"><a href="/my-website/" style="color: ${currentPage === 'home' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'home' ? 'bold' : 'normal'};">Acasă</a></li>
              <li style="margin-bottom: 10px;"><a href="/my-website/products" style="color: ${currentPage === 'products' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'products' ? 'bold' : 'normal'};">Produse</a></li>
              <li style="margin-bottom: 10px;"><a href="/my-website/ong" style="color: ${currentPage === 'ong' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'ong' ? 'bold' : 'normal'};">Făuritorii de Destin</a></li>
              <li style="margin-bottom: 10px;"><a href="/my-website/therapy" style="color: ${currentPage === 'therapy' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'therapy' ? 'bold' : 'normal'};">Terapie Personalizată</a></li>
              <li><a href="/my-website/contact" style="color: ${currentPage === 'contact' ? '#6b4423' : '#333'}; text-decoration: none; font-weight: ${currentPage === 'contact' ? 'bold' : 'normal'};">Contact</a></li>
            </ul>
          </nav>
        </div>
      `;
      
      document.body.appendChild(menuPanel);
    }
    
    // Create overlay
    if (!document.querySelector('.emergency-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'emergency-overlay';
      document.body.appendChild(overlay);
    }
    
    // Create profile and cart buttons
    if (!document.querySelector('.profile-cart-buttons')) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'profile-cart-buttons';
      
      const profileButton = document.createElement('button');
      profileButton.className = 'profile-button';
      profileButton.innerHTML = '<i style="font-family: sans-serif;">👤</i>';
      profileButton.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; background: white; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer;';
      
      const cartButton = document.createElement('button');
      cartButton.className = 'cart-button';
      cartButton.innerHTML = '<i style="font-family: sans-serif;">🛒</i>';
      cartButton.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; background: white; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer;';
      
      buttonsContainer.appendChild(profileButton);
      buttonsContainer.appendChild(cartButton);
      document.body.appendChild(buttonsContainer);
    }
  }
  
  // Add event listeners
  function addEventListeners() {
    // Menu toggle
    document.querySelector('.force-mobile-button').addEventListener('click', function() {
      const menuPanel = document.querySelector('.emergency-menu-panel');
      const overlay = document.querySelector('.emergency-overlay');
      
      menuPanel.classList.add('visible');
      overlay.classList.add('visible');
    });
    
    // Close button
    document.querySelector('.close-menu-button').addEventListener('click', function() {
      const menuPanel = document.querySelector('.emergency-menu-panel');
      const overlay = document.querySelector('.emergency-overlay');
      
      menuPanel.classList.remove('visible');
      overlay.classList.remove('visible');
    });
    
    // Overlay click
    document.querySelector('.emergency-overlay').addEventListener('click', function() {
      const menuPanel = document.querySelector('.emergency-menu-panel');
      const overlay = document.querySelector('.emergency-overlay');
      
      menuPanel.classList.remove('visible');
      overlay.classList.remove('visible');
    });
  }
  
  // Initialize
  function init() {
    detectCurrentPage();
    ensureMobileMenu();
    
    // Add event listeners when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        addEventListeners();
      });
    } else {
      addEventListeners();
    }
  }
  
  // Start the process
  init();
})();
