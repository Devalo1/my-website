/*
 * SUPER FORȚARE MENIU MOBIL - COD EXTREM DE AGRESIV
 * Acest script folosește tehnici extreme pentru a forța afișarea meniului pe mobil
 * Ignoră orice alt cod care încearcă să ascundă meniul
 */

// EXECUȚIE IMEDIATĂ - Nu așteaptă niciun eveniment
(function() {
  console.log('FORȚĂ MAXIMĂ MENIU MOBIL: Început - FĂRĂ ÎNTÂRZIERE');
  
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
    }
  `;
  
  // ADAUGĂ STILURILE IMEDIAT LA ÎNCEPUTUL HEAD
  if (document.head) {
    if (document.head.firstChild) {
      document.head.insertBefore(forceStyle, document.head.firstChild);
    } else {
      document.head.appendChild(forceStyle);
    }
  } else {
    // Dacă cumva <head> nu există, forțează crearea lui
    const head = document.createElement('head');
    head.appendChild(forceStyle);
    document.documentElement.insertBefore(head, document.body);
  }
  
  // CREARE AGRESIVĂ ELEMENTS - Nu așteaptă DOMContentLoaded
  function forceCreateMobileElements() {
    console.log('FORȚĂ MAXIMĂ: Creez elemente mobile');
    
    // VERIFICĂ DACĂ SUNTEM PE MOBIL
    if (window.innerWidth > 768) return;
    
    // CREAZĂ BUTONUL DE MENIU DACĂ NU EXISTĂ
    if (!document.querySelector('.menu-toggle, #mobile-menu-button')) {
      console.log('FORȚĂ MAXIMĂ: Creez butonul de meniu forțat');
      const menuButton = document.createElement('button');
      menuButton.className = 'menu-toggle';
      menuButton.id = 'absolutely-forced-menu-button';
      menuButton.innerHTML = '☰';
      menuButton.setAttribute('style', `
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
      `);
      
      // ADAUGĂ BUTONUL LA BODY
      document.body.appendChild(menuButton);
      
      // ADAUGĂ EVENT LISTENER
      menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMobileMenu();
      });
    }
    
    // CREAZĂ LOGO DACĂ NU EXISTĂ
    if (!document.querySelector('.logo, a[href*="index"] img')) {
      console.log('FORȚĂ MAXIMĂ: Creez logo forțat');
      const logoLink = document.createElement('a');
      logoLink.href = 'index.html';
      logoLink.className = 'forced-logo-link';
      
      const logo = document.createElement('img');
      logo.src = 'images/Logo.png';
      logo.alt = 'Lupul și Corbul';
      logo.className = 'logo';
      logo.setAttribute('style', `
        display: block !important;
        width: 100% !important;
        height: auto !important;
        max-width: 100% !important;
      `);
      
      logoLink.setAttribute('style', `
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
      `);
      
      logoLink.appendChild(logo);
      document.body.appendChild(logoLink);
    }
    
    // CREAZĂ MENIUL MOBIL DACĂ NU EXISTĂ
    if (!document.querySelector('#mobile-nav')) {
      console.log('FORȚĂ MAXIMĂ: Creez meniul mobil forțat');
      
      // Mai întâi creează overlay-ul
      const overlay = document.createElement('div');
      overlay.className = 'mobile-nav-overlay';
      overlay.setAttribute('style', `
        display: none;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0,0,0,0.7) !important;
        z-index: 2147483645 !important;
      `);
      
      // Apoi creează meniul
      const mobileNav = document.createElement('nav');
      mobileNav.id = 'mobile-nav';
      mobileNav.setAttribute('style', `
        display: none;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 80% !important;
        max-width: 300px !important;
        height: 100% !important;
        background-color: white !important;
        z-index: 2147483646 !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
        overflow-y: auto !important;
        box-shadow: 2px 0 10px rgba(0,0,0,0.5) !important;
      `);
      
      // Conținutul meniului
      mobileNav.innerHTML = `
        <div class="mobile-nav-header" style="
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 15px !important;
          background-color: #6b4423 !important;
          color: white !important;
        ">
          <span style="font-size: 18px !important; font-weight: bold !important;">Meniu</span>
          <button class="close-menu" style="
            background: none !important;
            border: none !important;
            color: white !important;
            font-size: 24px !important;
            cursor: pointer !important;
            padding: 0 !important;
            width: 30px !important;
            height: 30px !important;
            line-height: 30px !important;
            text-align: center !important;
          ">×</button>
        </div>
        <a href="index.html" class="nav-link" style="
          display: block !important;
          padding: 15px !important;
          border-bottom: 1px solid #eee !important;
          color: #333 !important;
          text-decoration: none !important;
          font-size: 16px !important;
        ">Acasă</a>
        <a href="produse.html" class="nav-link" style="
          display: block !important;
          padding: 15px !important;
          border-bottom: 1px solid #eee !important;
          color: #333 !important;
          text-decoration: none !important;
          font-size: 16px !important;
        ">Produse</a>
        <a href="ong.html" class="nav-link" style="
          display: block !important;
          padding: 15px !important;
          border-bottom: 1px solid #eee !important;
          color: #333 !important;
          text-decoration: none !important;
          font-size: 16px !important;
        ">Făuritorii de Destin</a>
        <a href="terapie.html" class="nav-link" style="
          display: block !important;
          padding: 15px !important;
          border-bottom: 1px solid #eee !important;
          color: #333 !important;
          text-decoration: none !important;
          font-size: 16px !important;
        ">Terapie Personalizată</a>
        <a href="contact.html" class="nav-link" style="
          display: block !important;
          padding: 15px !important;
          border-bottom: 1px solid #eee !important;
          color: #333 !important;
          text-decoration: none !important;
          font-size: 16px !important;
        ">Contact</a>
      `;
      
      // Adaugă elementele în DOM
      document.body.appendChild(overlay);
      document.body.appendChild(mobileNav);
      
      // Adaugă event listeners pentru închidere
      overlay.addEventListener('click', function() {
        closeMobileMenu();
      });
      
      const closeBtn = mobileNav.querySelector('.close-menu');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          closeMobileMenu();
        });
      }
      
      mobileNav.querySelectorAll('a.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
          setTimeout(closeMobileMenu, 100);
        });
      });
    }
  }
  
  // FUNCȚII PENTRU MENIUL MOBIL
  window.openMobileMenu = function() {
    const mobileNav = document.querySelector('#mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    
    if (!mobileNav || !overlay) {
      console.log('FORȚĂ MAXIMĂ: Elementele lipsă, le recreez');
      forceCreateMobileElements();
      setTimeout(openMobileMenu, 50);
      return;
    }
    
    overlay.style.display = 'block';
    mobileNav.style.display = 'block';
    mobileNav.style.visibility = 'visible';
    overlay.style.visibility = 'visible';
    
    // Forțează un reflow pentru a permite animația
    void mobileNav.offsetWidth;
    
    // Adaugă clasa open pentru a declanșa stilurile de afișare forțată
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    
    // Aplică direct stilurile pentru a fi sigur că sunt aplicate
    mobileNav.style.transform = 'translateX(0)';
    overlay.style.opacity = '0.7';
    
    // Blochează scrollul pe body
    document.body.style.overflow = 'hidden';
  };
  
  window.closeMobileMenu = function() {
    const mobileNav = document.querySelector('#mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    
    if (!mobileNav || !overlay) return;
    
    // Elimină clasa open
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    
    // Aplică direct stilurile pentru închidere
    mobileNav.style.transform = 'translateX(-100%)';
    overlay.style.opacity = '0';
    
    // Ascunde complet după animație
    setTimeout(function() {
      mobileNav.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  };
  
  // EXECUTĂ IMEDIAT CREAREA ELEMENTELOR PENTRU MOBIL
  // Nu așteaptă niciun eveniment
  forceCreateMobileElements();
  
  // VERIFICARE AGRESIVĂ ȘI INTERVENȚIE
  function forceCheckElements() {
    // Verifică doar pe mobil
    if (window.innerWidth > 768) return;
    
    console.log('FORȚĂ MAXIMĂ: Verificare agresivă a elementelor mobile');
    
    // Verifică butonul de meniu
    const menuToggle = document.querySelector('.menu-toggle, #mobile-menu-button');
    if (!menuToggle || 
        window.getComputedStyle(menuToggle).display === 'none' || 
        window.getComputedStyle(menuToggle).visibility === 'hidden') {
      console.log('FORȚĂ MAXIMĂ: Butonul de meniu lipsește sau e ascuns, îl recreez');
      
      // Elimină orice buton existent care ar putea fi ascuns
      if (menuToggle) {
        menuToggle.remove();
      }
      
      // Crează un buton nou
      const menuButton = document.createElement('button');
      menuButton.className = 'menu-toggle';
      menuButton.id = 'absolutely-forced-menu-button-' + Math.random().toString(36).substring(2, 9);
      menuButton.innerHTML = '☰';
      menuButton.setAttribute('style', `
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
      `);
      
      // Adaugă la DOM
      document.body.appendChild(menuButton);
      
      // Adaugă event listener
      menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMobileMenu();
      });
    }
    
    // Verifică logo
    const logo = document.querySelector('.logo, a[href*="index"] img');
    if (!logo || 
        window.getComputedStyle(logo).display === 'none' || 
        window.getComputedStyle(logo).visibility === 'hidden') {
      console.log('FORȚĂ MAXIMĂ: Logo-ul lipsește sau e ascuns, îl recreez');
      
      // Elimină orice logo existent care ar putea fi ascuns
      if (logo) {
        const logoParent = logo.parentElement;
        if (logoParent.tagName === 'A') {
          logoParent.remove();
        } else {
          logo.remove();
        }
      }
      
      // Crează un logo nou
      const logoLink = document.createElement('a');
      logoLink.href = 'index.html';
      logoLink.className = 'forced-logo-link-' + Math.random().toString(36).substring(2, 9);
      
      const newLogo = document.createElement('img');
      newLogo.src = 'images/Logo.png';
      newLogo.alt = 'Lupul și Corbul';
      newLogo.className = 'logo';
      newLogo.setAttribute('style', `
        display: block !important;
        width: 100% !important;
        height: auto !important;
        max-width: 100% !important;
      `);
      
      logoLink.setAttribute('style', `
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
      `);
      
      logoLink.appendChild(newLogo);
      document.body.appendChild(logoLink);
    }
  }
  
  // INTERVAL DE VERIFICARE AGRESIVĂ - Verifică elementele la fiecare 200ms
  setInterval(forceCheckElements, 200);
  
  // PREVENȚIE PENTRU ÎNCERCĂRI DE ASCUNDERE
  // Interceptează modificări la stiluri
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    // Dacă este un element de meniu mobil și se încearcă ascunderea
    if ((this.classList && (this.classList.contains('menu-toggle') || 
                            this.classList.contains('logo') || 
                            this.id === 'mobile-nav')) && 
        (name === 'style' && 
         (value.includes('display: none') || 
          value.includes('visibility: hidden') || 
          value.includes('opacity: 0')))) {
      console.log('FORȚĂ MAXIMĂ: Blocare încercare de ascundere pentru:', this);
      return; // Blochează modificarea
    }
    return originalSetAttribute.call(this, name, value);
  };
})();

// EXECUȚIE DUPĂ ÎNCĂRCAREA DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('FORȚĂ MAXIMĂ: DOM încărcat, verificare suplimentară');
  
  // Verifică dacă suntem pe mobil
  if (window.innerWidth <= 768) {
    console.log('FORȚĂ MAXIMĂ: Ecran mobil detectat, verific elementele din nou');
    
    // Verifică header
    const header = document.querySelector('header');
    if (!header) {
      console.log('FORȚĂ MAXIMĂ: Header lipsește, îl creez');
      const newHeader = document.createElement('header');
      document.body.insertBefore(newHeader, document.body.firstChild);
    }
    
    // Verifică butonul de meniu
    if (!document.querySelector('.menu-toggle, #mobile-menu-button')) {
      console.log('FORȚĂ MAXIMĂ: Buton meniu lipsă la DOMContentLoaded, forțez crearea');
      const menuButton = document.createElement('button');
      menuButton.className = 'menu-toggle';
      menuButton.innerHTML = '☰';
      menuButton.setAttribute('style', `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        width: 40px !important;
        height: 40px !important;
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
      `);
      
      document.body.appendChild(menuButton);
      
      menuButton.addEventListener('click', function() {
        // Verifică dacă funcția există, altfel o definește
        if (typeof window.openMobileMenu !== 'function') {
          window.openMobileMenu = function() {
            const mobileNav = document.querySelector('#mobile-nav');
            const overlay = document.querySelector('.mobile-nav-overlay');
            
            if (!mobileNav || !overlay) {
              alert('Elementele de meniu lipsesc. Reîncărcați pagina.');
              return;
            }
            
            overlay.style.display = 'block';
            mobileNav.style.display = 'block';
            
            setTimeout(function() {
              mobileNav.style.transform = 'translateX(0)';
            }, 10);
          };
        }
        
        window.openMobileMenu();
      });
    }
  }
  
  // Înlocuiește orice funcție de toggle menu existentă
  if (typeof window.toggleMenu === 'function' || typeof window.toggleMobileMenu === 'function') {
    console.log('FORȚĂ MAXIMĂ: Înlocuiesc funcțiile toggleMenu existente');
    
    window.toggleMenu = window.toggleMobileMenu = function() {
      const mobileNav = document.querySelector('#mobile-nav');
      if (mobileNav) {
        if (mobileNav.classList.contains('open') || 
            window.getComputedStyle(mobileNav).transform.includes('matrix') && 
            !window.getComputedStyle(mobileNav).transform.includes('-100')) {
          window.closeMobileMenu();
        } else {
          window.openMobileMenu();
        }
      } else {
        window.openMobileMenu();
      }
    };
  }
});

// VERIFICARE DUPĂ ÎNCĂRCAREA COMPLETĂ
window.addEventListener('load', function() {
  console.log('FORȚĂ MAXIMĂ: Pagina complet încărcată, verificare finală');
  
  if (window.innerWidth <= 768) {
    // Forțează una ultimă dată vizibilitatea butonului
    const menuToggle = document.querySelector('.menu-toggle, #mobile-menu-button');
    if (!menuToggle) {
      console.log('FORȚĂ MAXIMĂ: Buton în continuare lipsă la load, ultimă încercare');
      
      const lastResortButton = document.createElement('button');
      lastResortButton.className = 'menu-toggle ultimate-force';
      lastResortButton.innerHTML = '☰';
      lastResortButton.setAttribute('style', `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        width: 40px !important;
        height: 40px !important;
        padding: 0 !important;
        margin: 0 !important;
        background-color: #ff0000 !important; /* Roșu pentru ultimă încercare */
        color: white !important;
        z-index: 2147483647 !important;
        border: none !important;
        border-radius: 5px !important;
        font-size: 24px !important;
        line-height: 40px !important;
        text-align: center !important;
        cursor: pointer !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.8) !important;
      `);
      
      document.body.appendChild(lastResortButton);
      
      lastResortButton.addEventListener('click', function() {
        try {
          window.openMobileMenu();
        } catch (error) {
          // Cel mai extrem caz - creează și deschide meniul direct
          alert('Meniul nu poate fi deschis. Reîncărcați pagina.');
        }
      });
    }
  }
});

// MUTAȚIE OBSERVER AGRESIV
// Monitorizează orice modificare în DOM care ar putea afecta meniul
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    // Verifică doar pentru mobil
    if (window.innerWidth > 768) return;
    
    let needsCheck = false;
    
    // Verifică dacă mutațiile afectează elemente de meniu
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || 
           mutation.attributeName === 'class')) {
        const target = mutation.target;
        
        if (target.classList && 
            (target.classList.contains('menu-toggle') || 
             target.classList.contains('logo') || 
             target.id === 'mobile-nav' || 
             target.classList.contains('mobile-nav-overlay'))) {
          needsCheck = true;
          break;
        }
      }
      
      if (mutation.type === 'childList' && 
          (mutation.removedNodes.length > 0)) {
        // Verifică dacă un element de meniu a fost eliminat
        for (const node of mutation.removedNodes) {
          if (node.nodeType === 1 && // Element node
              (node.classList && 
               (node.classList.contains('menu-toggle') || 
                node.classList.contains('logo')) || 
               node.id === 'mobile-nav')) {
            needsCheck = true;
            break;
          }
        }
      }
    }
    
    if (needsCheck) {
      console.log('FORȚĂ MAXIMĂ: Detectate modificări care afectează meniul, verific');
      
      // Verificare imediată
      forceCheckElements();
      
      // Verificare după o scurtă întârziere pentru a prinde efectele CSS tranziționale
      setTimeout(forceCheckElements, 50);
      setTimeout(forceCheckElements, 200);
    }
  });
  
  // Începe observarea întregului document
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });
}
