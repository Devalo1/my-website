document.addEventListener('DOMContentLoaded', () => {
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            // Verifică dacă scriptul există deja
            if (document.querySelector(`script[src="${src}"]`)) {
                console.log(`Scriptul ${src} este deja încărcat.`);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = () => {
                console.log(`Scriptul ${src} a fost încărcat cu succes.`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Eroare la încărcarea scriptului ${src}`);
                reject();
            };
            document.head.appendChild(script);
        });
    };

    const removeScript = (src) => {
        const scripts = document.querySelectorAll(`script[src*="${src}"]`);
        scripts.forEach(script => {
            console.log(`Se elimină scriptul ${script.src}`);
            script.remove();
        });
    };

    // Setează o clasă pe body pentru a identifica dimensiunea ecranului
    const setScreenSizeClass = () => {
        if (window.innerWidth <= 768) {
            document.body.classList.add('small-screen');
            document.body.classList.remove('large-screen');
        } else {
            document.body.classList.add('large-screen');
            document.body.classList.remove('small-screen');
        }
    };
    
    // Aplicăm clasa inițială
    setScreenSizeClass();

    const handleScreenSize = async () => {
        console.log(`Lățimea actuală a ecranului: ${window.innerWidth}px`);
        
        // Actualizăm clasa pe body
        setScreenSizeClass();
        
        try {
            if (window.innerWidth > 768) {
                // Ecrane mari - curățăm orice stiluri mobile care ar putea persista
                document.querySelectorAll('#mobile-nav, .mobile-nav-overlay, .menu-toggle').forEach(el => {
                    if (el) el.style.display = 'none';
                });
                
                // Elimină scripturile pentru ecran mic dacă există
                removeScript('responsive-small.js');
                removeScript('Header M.js');
                
                // Încarcă scripturile pentru ecran mare
                console.log('Se încarcă scripturile pentru ecran mare...');
                await loadScript('Header L.js');
                await loadScript('responsive-large.js');
                await loadScript('utilizator-button-function-desktop.js');
                console.log('Scripturile pentru ecran mare au fost încărcate.');
                
                // Activează navigația pentru toate paginile
                setupDesktopNavigation();
            } else {
                // Ecrane mici - curățăm orice stiluri desktop care ar putea persista
                const desktopMenu = document.querySelector('#main-nav');
                if (desktopMenu) desktopMenu.style.display = 'none';
                
                // Elimină scripturile pentru ecran mare dacă există
                removeScript('Header L.js');
                removeScript('responsive-large.js');
                
                // Încarcă scripturile pentru ecran mic
                await loadScript('Header M.js');
                await loadScript('responsive-small.js');
                await loadScript('MobileProfile/mobile-optimize.js');
                
                // Activează navigația pentru ecrane mici
                setupMobileNavigation();
            }
        } catch (error) {
            console.error('Eroare la gestionarea dimensiunii ecranului:', error);
        }
    };

    // Funcție pentru navigația pe desktop
    function setupDesktopNavigation() {
        const pages = ['home', 'products', 'ong', 'therapy', 'contact'];
        const currentPage = getCurrentPage();
        
        document.querySelectorAll('#main-nav a').forEach(link => {
            const pageName = link.getAttribute('data-page');
            if (pageName === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    // Funcție pentru navigația pe mobil
    function setupMobileNavigation() {
        // Implementare specifică pentru mobil
    }
    
    // Detectează pagina curentă
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('products')) return 'products';
        if (path.includes('ong')) return 'ong';
        if (path.includes('therapy')) return 'therapy';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }
    
    // Inițializare
    handleScreenSize();

    // Verifică și la redimensionarea ferestrei
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('Ecranul a fost redimensionat, se ajustează scripturile...');
            handleScreenSize();
        }, 250); // Întârziere pentru a evita apelurile frecvente
    });
});
