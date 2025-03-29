// Script de control global pentru header și navigație
// Acest script are prioritate maximă pentru afișarea meniului pe toate paginile

// GLOBAL FLAG to prevent multiple header creation
window.HEADER_L_INITIALIZED = window.HEADER_L_INITIALIZED || false;

// Execută imediat, nu aștepta DOMContentLoaded
(function() {
    // Check if we've already initialized to prevent duplicates
    if (window.HEADER_L_INITIALIZED) {
        console.log('Header L.js deja inițializat, se oprește execuția pentru a preveni duplicarea');
        return;
    }
    
    console.log('Header L.js se execută imediat pentru a preveni FOUC (Flash of Unstyled Content)');
    
    // VERIFICARE CRITICĂ: Nu executa acest script pe ecrane mici
    if (window.innerWidth <= 768) {
        console.log('Header L.js nu se execută pe ecrane mici (lățime <= 768px)');
        return; // Oprește executarea scriptului pentru ecrane mici
    }
    
    // Set the global flag to indicate we've started initialization
    window.HEADER_L_INITIALIZED = true;
    
    // Stiluri cu prioritate maximă aplicate imediat
    const priorityStyles = document.createElement('style');
    priorityStyles.id = 'header-priority-styles';
    priorityStyles.innerHTML = `
        /* Stilurile au efect doar pe ecrane mari */
        @media (min-width: 769px) {
            header {
                display: block !important;
                position: relative !important;
                height: auto !important;
                width: 100% !important;
                background-color: rgba(0, 0, 0, 0.8) !important;
                z-index: 1000 !important;
                padding: 1rem 0 !important;
                visibility: visible !important;
                opacity: 1 !important;
                min-height: 60px !important;
                overflow: visible !important;
            }
            
            /* Verifică dacă există probleme cu header-ul și forțează afișarea */
            body > header:empty::after {
                content: "Header L.js a detectat un header gol și îl repară" !important;
                color: white !important;
                display: block !important;
                text-align: center !important;
                padding: 10px !important;
            }
            
            header .logo {
                position: fixed !important;
                top: 10px !important;
                left: 10px !important;
                max-width: 100px !important;
                z-index: 1001 !important;
            }
            
            #main-nav {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 2rem !important;
                padding: 1rem 2rem !important;
                background-color: #8b5a2b !important;
                width: 100% !important;
            }
            
            #main-nav a {
                display: inline-block !important;
                color: white !important;
                text-decoration: none !important;
                font-weight: bold !important;
                padding: 0.5rem 1rem !important;
                border-radius: 5px !important;
                transition: background-color 0.3s, color 0.3s, transform 0.3s !important;
            }
            
            #main-nav a:hover {
                transform: scale(1.1) !important;
                background-color: #ffdd57 !important;
                color: #333 !important;
            }
            
            #main-nav a.active {
                background-color: #6b4423 !important;
                color: #fff8f0 !important;
            }
            
            .header-profile-cart {
                position: absolute !important;
                top: 20px !important;
                right: 20px !important;
                display: flex !important;
                gap: 20px !important;
                z-index: 1002 !important;
            }
            
            .header-profile, .header-cart {
                display: block !important;
                cursor: pointer !important;
            }
            
            .header-profile img, .header-cart img {
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
            }
            
            .header-cart-count {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                background: red !important;
                color: white !important;
                border-radius: 50% !important;
                padding: 0 5px !important;
                font-size: 14px !important;
            }
        }
        
        /* Asigură-te că pe ecrane mici nu sunt afișate elementele de desktop */
        @media (max-width: 768px) {
            #main-nav, .header-profile-cart {
                display: none !important;
            }
        }
    `;
    
    // Adaugă stilurile în HEAD imediat
    document.head.appendChild(priorityStyles);
    console.log('Stiluri prioritare adăugate în HEAD');
})();

// Funcție de inițializare completă a header-ului
function initializeHeader() {
    // Check if we have multiple headers and remove duplicates
    const headers = document.querySelectorAll('header');
    if (headers.length > 1) {
        console.warn(`Au fost detectate ${headers.length} elemente header! Se păstrează doar primul.`);
        // Keep only the first header, remove others
        for (let i = 1; i < headers.length; i++) {
            headers[i].parentNode.removeChild(headers[i]);
        }
    }
    
    console.log('Inițializare header...');
    
    // FOARTE IMPORTANT: Nu inițializa header-ul pentru desktop pe ecrane mici
    if (window.innerWidth <= 768) {
        console.log('Header L.js nu inițializează header-ul pe ecrane mici (lățime <= 768px)');
        return; // Oprește executarea pentru ecrane mici
    }
    
    // Verifică dacă există deja un header
    let header = document.querySelector('header');
    if (!header) {
        console.warn('Element header negăsit. Se creează unul nou...');
        header = document.createElement('header');
        document.body.insertAdjacentElement('afterbegin', header);
    } else {
        console.log('Element header găsit.');
    }
    
    // Verifică dacă header-ul este vizibil - dacă nu, forțează vizibilitatea
    if (window.getComputedStyle(header).display === 'none' || 
        window.getComputedStyle(header).visibility === 'hidden') {
        console.warn('Header-ul este ascuns! Se forțează afișarea...');
        header.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            height: auto !important;
            min-height: 60px !important;
            width: 100% !important;
            background-color: rgba(0, 0, 0, 0.8) !important;
            z-index: 1000 !important;
            padding: 1rem 0 !important;
        `;
    }
    
    // Verifică dacă header-ul are conținut, dacă nu, adaugă conținutul default
    if (header.children.length === 0 || header.innerHTML.trim() === '') {
        console.warn('Header gol detectat. Se adaugă conținut default...');
        
        // Definește structura HTML pentru header
        const headerHTML = `
            <a href="index.html">
                <img src="images/Logo.png" alt="Lupul și Corbul Logo" class="logo">
            </a>
            <nav id="main-nav">
                <a href="index.html" class="nav-link">Acasă</a>
                <a href="produse.html" class="nav-link">Produse</a>
                <a href="ong.html" class="nav-link">Făuritorii de Destin</a>
                <a href="terapie.html" class="nav-link">Terapie Personalizată</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </nav>
            <div class="header-profile-cart">
                <div class="header-profile" onclick="toggleProfileDetails()">
                    <img src="images/profi.png" alt="Profile">
                </div>
                <div class="header-cart" onclick="toggleCartDetails()">
                    <img src="images/bag.png" alt="Cart">
                    <div class="header-cart-count">0</div>
                </div>
            </div>
        `;
        
        // Inserează HTML-ul în header
        header.innerHTML = headerHTML;
        console.log('Conținutul header-ului a fost actualizat.');
    }
    
    // Verifică și repară elementele de navigație dacă lipsesc
    if (!document.getElementById('main-nav')) {
        console.warn('Meniul principal lipsește din header. Se adaugă...');
        
        const nav = document.createElement('nav');
        nav.id = 'main-nav';
        nav.innerHTML = `
            <a href="index.html" class="nav-link">Acasă</a>
            <a href="produse.html" class="nav-link">Produse</a>
            <a href="ong.html" class="nav-link">Făuritorii de Destin</a>
            <a href="terapie.html" class="nav-link">Terapie Personalizată</a>
            <a href="contact.html" class="nav-link">Contact</a>
        `;
        
        header.appendChild(nav);
    }
    
    // Evidențiază linkul activ
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Pagina curentă detectată:', currentPage);
    
    document.querySelectorAll('#main-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            console.log(`Link activ setat pentru: ${href}`);
        }
    });
    
    // Inițializează contorul coșului
    updateHeaderCartCount();
    
    // Verifică dacă meniul este vizibil
    setTimeout(() => {
        const nav = document.getElementById('main-nav');
        if (nav) {
            const isVisible = window.getComputedStyle(nav).display !== 'none';
            console.log(`Meniul de navigație este ${isVisible ? 'vizibil' : 'invizibil'}`);
            
            if (!isVisible) {
                console.warn('Meniul nu este vizibil! Se forțează afișarea...');
                nav.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
            }
        }
    }, 500);
}

// Funcție pentru a actualiza contorul coșului în header
function updateHeaderCartCount() {
    const cartCountElement = document.querySelector('.header-cart-count');
    if (cartCountElement) {
        let cartItems = [];
        try {
            cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        } catch (e) {
            console.error('Eroare la citirea coșului din localStorage:', e);
        }
        const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
        cartCountElement.textContent = itemCount;
    }
}

// Funcții pentru a gestiona click-urile pe profilul și coșul din header
window.toggleProfileDetails = function() {
    // Verifică dacă există controller dedicat pentru desktop
    if (window.PROFILE_BUTTON_MANAGED_BY_DESKTOP === 'utilizator-button-function-desktop.js' && 
        window.DesktopUserButton && 
        typeof window.DesktopUserButton.toggleProfileMenu === 'function') {
      
      console.log('Delegare toggleProfileDetails către utilizator-button-function-desktop.js');
      window.DesktopUserButton.toggleProfileMenu();
      return;
    }
    
    // Comportament de rezervă dacă nu există controller dedicat
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        profileDetails.style.display = profileDetails.style.display === 'block' ? 'none' : 'block';
    } else {
        // Redirecționează către pagina de login dacă nu există detalii de profil
        window.location.href = 'login.html';
    }
};

window.toggleCartDetails = function() {
    const cartDetails = document.querySelector('.cart-details');
    if (cartDetails) {
        cartDetails.style.display = cartDetails.style.display === 'block' ? 'none' : 'block';
    } else {
        // Opțional: redirecționează către pagina coșului sau produselor
        window.location.href = 'produse.html';
    }
};

// Execută inițializarea header-ului când documentul e gata
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
    // Documentul e deja încărcat
    initializeHeader();
}

// Verifică din nou după ce toate resursele sunt încărcate
window.addEventListener('load', () => {
    console.log('Toate resursele au fost încărcate. Se verifică meniul...');
    
    // Detectează pagina curentă
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Pagina curentă detectată (la load):', currentPage);
    
    // Verifică în mod special pentru pagina produse.html
    if (currentPage === 'produse.html') {
        console.log('Pagina produse.html detectată - verificare suplimentară header');
        
        // Forțează inițializarea header-ului după o scurtă întârziere pentru a permite tuturor scripturilor să ruleze
        setTimeout(() => {
            initializeHeader();
            
            // Verifică încă o dată după alte 500ms
            setTimeout(initializeHeader, 500);
        }, 100);
    }
    
    // Forță inițializarea header-ului din nou, pentru a fi sigur
    initializeHeader();
    
    const nav = document.getElementById('main-nav');
    
    if (nav) {
        const isVisible = window.getComputedStyle(nav).display !== 'none';
        console.log(`După încărcare completă, meniul este ${isVisible ? 'vizibil' : 'invizibil'}`);
        
        if (!isVisible) {
            console.warn('Meniul încă nu este vizibil după încărcare completă! Se forțează afișarea din nou...');
            nav.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
        }
    }
    
    // Actualizează contorul coșului după încărcarea completă
    updateHeaderCartCount();
});

// Observator pentru a detecta modificări în DOM care ar putea afecta meniul
const observer = new MutationObserver((mutations) => {
    // FOARTE IMPORTANT: Observatorul nu intervine pe ecrane mici
    if (window.innerWidth <= 768) {
        return; // Nu face nimic pe ecrane mici
    }
    
    for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            const nav = document.getElementById('main-nav');
            if (nav && window.getComputedStyle(nav).display === 'none') {
                console.warn('Meniul a fost ascuns de o modificare DOM! Se forțează afișarea...');
                nav.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
            }
        }
    }
});

// Pornește observatorul după încărcarea documentului dar doar pe ecrane mari
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
});

// Special cleanup function to remove any visible code debris
function cleanupVisibleCode() {
    // Clean up any text nodes that contain script or style code
    const textFragments = [
        "overlay.id =", "document.body.appendChild", 
        "ad> n", "ent.querySelector", 
        "fo').style.display", "Header L.js", 
        "createMobileMenu", "setInterval"
    ];
    
    // First, look for text nodes in the body
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        null, 
        false
    );
    
    const nodesToRemove = [];
    let node;
    while (node = walker.nextNode()) {
        // Skip nodes in script and style elements
        if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;
        
        // Check if this text node contains any of our problematic fragments
        if (textFragments.some(fragment => node.textContent.includes(fragment))) {
            nodesToRemove.push(node);
        }
    }
    
    // Remove problematic text nodes
    nodesToRemove.forEach(node => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    });
    
    // Also look for and remove any embedded scripts in content divs
    document.querySelectorAll('div > script:not([src]), div > style').forEach(element => {
        if (element.parentNode && !element.parentNode.classList.contains('script-container')) {
            element.parentNode.removeChild(element);
        }
    });
    
    console.log(`Cleanup completed: removed ${nodesToRemove.length} problematic text nodes`);
}

// Run the cleanup function after the page has loaded
window.addEventListener('load', cleanupVisibleCode);
