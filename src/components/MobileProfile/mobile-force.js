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
    }
  `;
  
  // Adaugă stilurile în HEAD
  document.head.appendChild(criticalStyles);
  
  // Funcție pentru a crea butonul de urgență
  function createEmergencyButton() {
    if (document.querySelector('.force-mobile-button')) return;
    
    console.log('Mobile-force: Creare buton de urgență pentru meniu');
    
    const emergencyButton = document.createElement('button');
    emergencyButton.className = 'force-mobile-button';
    emergencyButton.innerHTML = '☰';
    emergencyButton.setAttribute('title', 'Meniu de urgență');
    
    document.body.appendChild(emergencyButton);
    
    // Adaugă eveniment de click
    emergencyButton.addEventListener('click', function() {
      // Încearcă să folosească funcția existentă dacă există
      if (typeof window.openMobileMenu === 'function') {
        window.openMobileMenu();
        return;
      }
      
      // Altfel, creează un meniu de urgență
      showEmergencyMenu();
    });
  }
  
  // Funcție pentru a crea logo-ul de urgență
  function createEmergencyLogo() {
    if (document.querySelector('.force-mobile-logo')) return;
    
    console.log('Mobile-force: Creare logo de urgență');
    
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.className = 'force-mobile-logo';
    
    const logoImg = document.createElement('img');
    logoImg.src = 'images/Logo.png';
    logoImg.alt = 'Lupul și Corbul';
    
    logoLink.appendChild(logoImg);
    document.body.appendChild(logoLink);
  }
  
  // Funcție pentru a afișa meniul de urgență
  function showEmergencyMenu() {
    console.log('Mobile-force: Afișare meniu de urgență');
    
    // Verifică dacă există deja meniul de urgență
    let menuPanel = document.querySelector('.emergency-menu-panel');
    let overlay = document.querySelector('.emergency-overlay');
    
    if (!menuPanel) {
      // Creează overlay-ul
      overlay = document.createElement('div');
      overlay.className = 'emergency-overlay';
      document.body.appendChild(overlay);
      
      // Creează panoul de meniu
      menuPanel = document.createElement('div');
      menuPanel.className = 'emergency-menu-panel';
      menuPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; background:#6b4423; color:white;">
          <span>Meniu de urgență</span>
          <button style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">×</button>
        </div>
        <a href="index.html" style="display:block; padding:15px; border-bottom:1px solid #eee; color:#333; text-decoration:none;">Acasă</a>
        <a href="produse.html" style="display:block; padding:15px; border-bottom:1px solid #eee; color:#333; text-decoration:none;">Produse</a>
        <a href="ong.html" style="display:block; padding:15px; border-bottom:1px solid #eee; color:#333; text-decoration:none;">Făuritorii de Destin</a>
        <a href="terapie.html" style="display:block; padding:15px; border-bottom:1px solid #eee; color:#333; text-decoration:none;">Terapie Personalizată</a>
        <a href="contact.html" style="display:block; padding:15px; border-bottom:1px solid #eee; color:#333; text-decoration:none;">Contact</a>
      `;
      document.body.appendChild(menuPanel);
      
      // Adaugă funcționalitatea de închidere
      const closeButton = menuPanel.querySelector('button');
      closeButton.addEventListener('click', function() {
        menuPanel.classList.remove('visible');
        overlay.classList.remove('visible');
      });
      
      overlay.addEventListener('click', function() {
        menuPanel.classList.remove('visible');
        overlay.classList.remove('visible');
      });
      
      // Adaugă funcționalitatea de închidere la click pe link-uri
      menuPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          menuPanel.classList.remove('visible');
          overlay.classList.remove('visible');
        });
      });
    }
    
    // Fă meniul vizibil
    menuPanel.classList.add('visible');
    overlay.classList.add('visible');
  }
  
  // Verificare inițială
  setTimeout(function() {
    // Verifică dacă există deja un buton de meniu funcțional
    const existingButton = document.querySelector('.menu-toggle, .mobile-menu-button');
    const isButtonVisible = existingButton && 
                           window.getComputedStyle(existingButton).display !== 'none' &&
                           window.getComputedStyle(existingButton).visibility !== 'hidden';
    
    if (!isButtonVisible) {
      console.log('Mobile-force: Nu există buton de meniu vizibil, se creează unul de urgență');
      createEmergencyButton();
      createEmergencyLogo();
    } else {
      console.log('Mobile-force: Buton de meniu existent și vizibil, nu este necesară intervenția');
    }
  }, 1000); // Verifică după 1 secundă pentru a permite încărcarea altor scripturi
  
  // Verificare periodică
  setInterval(function() {
    const existingButton = document.querySelector('.menu-toggle, .mobile-menu-button');
    const isButtonVisible = existingButton && 
                           window.getComputedStyle(existingButton).display !== 'none' &&
                           window.getComputedStyle(existingButton).visibility !== 'hidden';
    
    if (!isButtonVisible) {
      console.log('Mobile-force: Butonul de meniu a dispărut sau este ascuns, se recreează');
      createEmergencyButton();
      createEmergencyLogo();
    }
  }, 3000); // Verifică la fiecare 3 secunde
})();

/**
 * FORȚEAZĂ INJECTAREA ȘI AFIȘAREA MENIULUI PE MOBIL
 * 
 * Acest script încearcă să forțeze apariția meniului pe mobil
 * chiar dacă alte scripturi încearcă să îl suprime
 */

(function() {
  // Rulează la intervale pentru a asigura afișarea
  function forceMenuDisplay() {
    // Verifică dacă suntem pe un ecran mic (mobil)
    if (window.innerWidth > 768) {
      return;
    }

    console.log('Force-Menu: Forțare afișare meniu mobil');
    
    // Forțează afișarea butonului de meniu
    const menuButton = document.querySelector('.mobile-menu-button');
    if (menuButton) {
      menuButton.style.display = 'block !important';
      menuButton.style.visibility = 'visible !important';
      menuButton.style.opacity = '1 !important';
      menuButton.style.zIndex = '2147483647 !important';
    } else {
      console.log('Force-Menu: Butonul de meniu nu a fost găsit!');
    }
    
    // Forțează afișarea acțiunilor (profil & coș)
    const actionsContainer = document.querySelector('.mobile-actions');
    if (actionsContainer) {
      actionsContainer.style.display = 'flex !important';
      actionsContainer.style.visibility = 'visible !important';
      actionsContainer.style.opacity = '1 !important';
      actionsContainer.style.zIndex = '2147483646 !important';
    } else {
      console.log('Force-Menu: Containerul de acțiuni nu a fost găsit!');
    }
    
    // Re-adaugă event listener la butonul de meniu
    if (menuButton) {
      menuButton.addEventListener('click', function() {
        const panel = document.getElementById('mobile-menu-panel');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (panel && overlay) {
          panel.classList.add('open');
          overlay.classList.add('open');
          console.log('Force-Menu: Meniul a fost deschis prin forțare');
        } else {
          console.log('Force-Menu: Panoul de meniu sau overlay-ul nu au fost găsite!');
        }
      });
    }
  }
  
  // Rulează imediat
  setTimeout(forceMenuDisplay, 500);
  
  // Rulează periodic pentru a se asigura că meniul e vizibil
  setInterval(forceMenuDisplay, 2000);
  
  // Rulează după ce pagina e complet încărcată
  window.addEventListener('load', function() {
    forceMenuDisplay();
    
    // Adaugă rezistență la suprascrierea funcționalității
    document.querySelector('.mobile-menu-button')?.addEventListener('click', function(e) {
      e.stopPropagation();
      const panel = document.getElementById('mobile-menu-panel');
      const overlay = document.querySelector('.mobile-overlay');
      
      if (panel && overlay) {
        panel.classList.add('open');
        overlay.classList.add('open');
      }
    }, true);
  });
})();
