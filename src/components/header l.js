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
    
    document.head.appendChild(priorityStyles);
    
    // Detectare pagină curentă pentru navigație
    function detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('products')) return 'products';
        if (path.includes('ong')) return 'ong';
        if (path.includes('therapy')) return 'therapy';
        if (path.includes('contact')) return 'contact';
        
        // Default pentru acasă
        return 'home';
    }
    
    // Creare sau actualizare header
    function createOrUpdateHeader() {
        // Verifică dacă există deja un header
        let header = document.querySelector('header');
        let mainNav = document.getElementById('main-nav');
        const currentPage = detectCurrentPage();
        
        console.log(`Pagina curentă detectată: ${currentPage}`);
        
        if (!header) {
            console.log('Nu există header, se creează unul nou');
            
            // Creează header-ul
            header = document.createElement('header');
            
            // Adaugă titlul și descrierea în funcție de pagină
            let title, description;
            
            switch(currentPage) {
                case 'products':
                    title = 'Produsele Noastre';
                    description = 'Prăjituri și suplimente naturale de calitate';
                    break;
                case 'ong':
                    title = 'Făuritorii de Destin';
                    description = 'Organizația noastră non-profit';
                    break;
                case 'therapy':
                    title = 'Terapie Personalizată';
                    description = 'Servicii de terapie adaptate nevoilor tale';
                    break;
                case 'contact':
                    title = 'Contact';
                    description = 'Contactează-ne pentru mai multe informații';
                    break;
                default:
                    title = 'Lupul și Corbul';
                    description = 'Prăjituri artizanale & Suplimente naturale';
            }
            
            header.innerHTML = `
                <h1>${title}</h1>
                <p>${description}</p>
            `;
            
            // Adaugă header-ul în DOM
            document.body.insertBefore(header, document.body.firstChild);
        } else {
            console.log('Header-ul a fost găsit, se actualizează');
            
            // Actualizează titlul și descrierea în funcție de pagină
            const headerTitle = header.querySelector('h1');
            const headerDesc = header.querySelector('p');
            
            if (headerTitle && headerDesc) {
                switch(currentPage) {
                    case 'products':
                        headerTitle.textContent = 'Produsele Noastre';
                        headerDesc.textContent = 'Prăjituri și suplimente naturale de calitate';
                        break;
                    case 'ong':
                        headerTitle.textContent = 'Făuritorii de Destin';
                        headerDesc.textContent = 'Organizația noastră non-profit';
                        break;
                    case 'therapy':
                        headerTitle.textContent = 'Terapie Personalizată';
                        headerDesc.textContent = 'Servicii de terapie adaptate nevoilor tale';
                        break;
                    case 'contact':
                        headerTitle.textContent = 'Contact';
                        headerDesc.textContent = 'Contactează-ne pentru mai multe informații';
                        break;
                    default:
                        headerTitle.textContent = 'Lupul și Corbul';
                        headerDesc.textContent = 'Prăjituri artizanale & Suplimente naturale';
                }
            }
        }
        
        // Creează sau actualizează navigația principală
        if (!mainNav) {
            console.log('Nu există navigație, se creează una nouă');
            
            mainNav = document.createElement('nav');
            mainNav.id = 'main-nav';
            
            mainNav.innerHTML = `
                <a href="/my-website/" data-page="home" class="${currentPage === 'home' ? 'active' : ''}">Acasă</a>
                <a href="/my-website/products" data-page="products" class="${currentPage === 'products' ? 'active' : ''}">Produse</a>
                <a href="/my-website/ong" data-page="ong" class="${currentPage === 'ong' ? 'active' : ''}">Făuritorii de Destin</a>
                <a href="/my-website/therapy" data-page="therapy" class="${currentPage === 'therapy' ? 'active' : ''}">Terapie Personalizată</a>
                <a href="/my-website/contact" data-page="contact" class="${currentPage === 'contact' ? 'active' : ''}">Contact</a>
            `;
            
            // Adaugă navigația după header
            if (header.nextSibling) {
                document.body.insertBefore(mainNav, header.nextSibling);
            } else {
                document.body.appendChild(mainNav);
            }
        } else {
            console.log('Navigația a fost găsită, se actualizează');
            
            // Actualizează link-ul activ
            const links = mainNav.querySelectorAll('a');
            links.forEach(link => {
                const page = link.getAttribute('data-page') || '';
                if (page === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
        
        // Creează sau actualizează butoanele de profil și coș
        createOrUpdateProfileAndCart(header);
    }
    
    // Funcție pentru a crea sau actualiza butoanele de profil și coș
    function createOrUpdateProfileAndCart(header) {
        let profileCartContainer = document.querySelector('.header-profile-cart');
        
        if (!profileCartContainer) {
            console.log('Nu există butoane de profil și coș, se creează');
            
            profileCartContainer = document.createElement('div');
            profileCartContainer.className = 'header-profile-cart';
            
            // Crează butonul de profil
            const profileButton = document.createElement('div');
            profileButton.className = 'header-profile';
            
            const profileImg = document.createElement('img');
            profileImg.src = '/my-website/images/profi.png';
            profileImg.alt = 'Profil';
            profileImg.onerror = function() {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b4423"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
            };
            
            profileButton.appendChild(profileImg);
            
            // Crează butonul de coș
            const cartButton = document.createElement('div');
            cartButton.className = 'header-cart';
            
            const cartImg = document.createElement('img');
            cartImg.src = '/my-website/images/bag.png';
            cartImg.alt = 'Coș';
            cartImg.onerror = function() {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b4423"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>';
            };
            
            // Adaugă un badge pentru numărul de produse în coș
            let cartCount = 0;
            try {
                const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
            } catch (e) {}
            
            if (cartCount > 0) {
                const cartCountBadge = document.createElement('div');
                cartCountBadge.className = 'header-cart-count';
                cartCountBadge.textContent = cartCount > 9 ? '9+' : cartCount;
                cartButton.appendChild(cartCountBadge);
            }
            
            cartButton.appendChild(cartImg);
            
            // Adaugă butoanele în container
            profileCartContainer.appendChild(profileButton);
            profileCartContainer.appendChild(cartButton);
            
            // Adaugă container-ul în header
            header.appendChild(profileCartContainer);
            
            // Adaugă event listeners
            addButtonListeners(profileButton, cartButton);
        } else {
            console.log('Butoanele de profil și coș există, se actualizează');
            
            // Actualizează doar badge-ul coșului
            const cartButton = profileCartContainer.querySelector('.header-cart');
            if (cartButton) {
                // Elimină badge-ul existent dacă există
                const existingBadge = cartButton.querySelector('.header-cart-count');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // Adaugă un badge nou pentru numărul de produse în coș
                let cartCount = 0;
                try {
                    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                    cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
                } catch (e) {}
                
                if (cartCount > 0) {
                    const cartCountBadge = document.createElement('div');
                    cartCountBadge.className = 'header-cart-count';
                    cartCountBadge.textContent = cartCount > 9 ? '9+' : cartCount;
                    cartButton.appendChild(cartCountBadge);
                }
            }
        }
    }
    
    // Adaugă event listeners pentru butoanele de profil și coș
    function addButtonListeners(profileButton, cartButton) {
        // Event listener pentru butonul de profil
        profileButton.addEventListener('click', function() {
            // Funcție delegată la utilizator-button-function-desktop.js
            if (window.DesktopUserButton && window.DesktopUserButton.handleProfileButtonClick) {
                window.DesktopUserButton.handleProfileButtonClick(event);
            } else {
                console.warn('Nu a fost găsit controller-ul pentru butonul de profil');
                // Implementare de rezervă
                let user = null;
                try {
                    user = JSON.parse(localStorage.getItem('user'));
                } catch (e) {}
                
                if (user) {
                    alert(`Bine ai venit, ${user.name || user.email}!`);
                } else {
                    if (confirm('Trebuie să fii autentificat pentru a-ți vedea profilul. Dorești să te autentifici?')) {
                        window.location.href = '/my-website/login';
                    }
                }
            }
        });
        
        // Event listener pentru butonul de coș
        cartButton.addEventListener('click', function() {
            // Funcție delegată la coș
            if (window.DesktopUserButton && window.DesktopUserButton.showCart) {
                window.DesktopUserButton.showCart();
            } else {
                console.warn('Nu a fost găsit controller-ul pentru coș');
                // Implementare de rezervă
                let cartItems = [];
                try {
                    cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                } catch (e) {}
                
                if (cartItems.length === 0) {
                    alert('Coșul tău este gol.');
                } else {
                    alert(`Ai ${cartItems.length} produse în coș.`);
                }
            }
        });
    }
    
    // Inițializează header-ul și navigația
    createOrUpdateHeader();
    
    // Adaugă un event listener pentru a asigura că header-ul rămâne formatat corect
    window.addEventListener('load', function() {
        // Verifică încă o dată că suntem pe desktop
        if (window.innerWidth > 768) {
            console.log('Verificare finală pentru header după încărcarea completă a paginii');
            createOrUpdateHeader();
        }
    });
    
    // Verifică și actualizează header-ul la redimensionarea ferestrei
    window.addEventListener('resize', function() {
        // Verifică dacă suntem pe desktop
        if (window.innerWidth > 768) {
            if (!window.HEADER_L_INITIALIZED) {
                console.log('Trecere de la mobil la desktop, se inițializează header-ul');
                window.HEADER_L_INITIALIZED = true;
                createOrUpdateHeader();
            }
        } else {
            // Suntem pe mobil, dezactivează flag-ul pentru a permite reinițializarea la trecerea înapoi la desktop
            window.HEADER_L_INITIALIZED = false;
        }
    });
})();
