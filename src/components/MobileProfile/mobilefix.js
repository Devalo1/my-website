/*
 * SOLUȚIE DIRECTĂ PENTRU MENIU MOBIL
 * Script independent care forțează afișarea meniului mobil
 */

(function() {
  // Rulează imediat pentru a preveni FOUC (Flash of Unstyled Content)
  if (window.innerWidth > 768) return; // Se execută doar pe mobil
  
  // Funcția de injectare imediată a meniului
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
    `;
    
    document.head.insertBefore(style, document.head.firstChild);
    
    // Creează componentele meniului
    let menuButton = document.createElement('button');
    menuButton.id = 'emergency-menu-button';
    menuButton.innerHTML = '☰';
    document.body.appendChild(menuButton);
    
    let logo = document.createElement('a');
    logo.href = 'index.html';
    logo.id = 'emergency-logo';
    logo.innerHTML = '<img src="images/Logo.png" alt="Logo" style="width:100%">';
    document.body.appendChild(logo);
    
    let menu = document.createElement('div');
    menu.id = 'emergency-menu';
    menu.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:15px;background:#6b4423;color:white;">
        <span>Meniu</span>
        <button id="emergency-close" style="background:none;border:none;color:white;font-size:24px;">×</button>
      </div>
      <a href="index.html" style="display:block;padding:15px;border-bottom:1px solid #eee;">Acasă</a>
      <a href="produse.html" style="display:block;padding:15px;border-bottom:1px solid #eee;">Produse</a>
      <a href="ong.html" style="display:block;padding:15px;border-bottom:1px solid #eee;">Făuritorii de Destin</a>
      <a href="terapie.html" style="display:block;padding:15px;border-bottom:1px solid #eee;">Terapie Personalizată</a>
      <a href="contact.html" style="display:block;padding:15px;border-bottom:1px solid #eee;">Contact</a>
    `;
    
    let overlay = document.createElement('div');
    overlay.id = 'emergency-overlay';
    
    document.body.appendChild(menu);
    document.body.appendChild(overlay);
    
    // Adaugă funcționalitatea
    menuButton.addEventListener('click', () => {
      menu.classList.add('open');
      overlay.classList.add('open');
    });
    
    document.getElementById('emergency-close').addEventListener('click', () => {
      menu.classList.remove('open');
      overlay.classList.remove('open');
    });
    
    overlay.addEventListener('click', () => {
      menu.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
  
  // Execută injectarea imediată
  injectMenuNow();
  
  // Verifică din nou după încărcarea paginii
  window.addEventListener('load', function() {
    const menuButton = document.getElementById('emergency-menu-button');
    if (!menuButton || window.getComputedStyle(menuButton).display === 'none') {
      console.log('Meniul de urgență a dispărut, recreez...');
      injectMenuNow();
    }
  });
  
  // Verifică periodic
  setInterval(function() {
    const menuButton = document.getElementById('emergency-menu-button');
    if (!menuButton || window.getComputedStyle(menuButton).display === 'none') {
      console.log('Meniul de urgență a dispărut, recreez...');
      injectMenuNow();
    }
  }, 2000);
})();
