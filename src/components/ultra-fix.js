/**
 * ultra-fix.js - Script de compatibilitate pentru toate paginile site-ului
 * 
 * Acest script asigură compatibilitatea între diferitele pagini ale site-ului,
 * detectează și rezolvă probleme comune și uniformizează experiența utilizatorului.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('ultra-fix.js încărcat - asigurare compatibilitate între pagini');
    
    // Funcție pentru a aplica stiluri consistente pe toate paginile
    function applyConsistentStyles() {
        const pages = ['home', 'products', 'ong', 'therapy', 'contact'];
        const currentPage = getCurrentPage();
        
        // Adaugă clasa pentru pagina curentă pe body
        document.body.classList.add(`page-${currentPage}`);
        
        // Asigură-te că header-ul este vizibil și formatat corect
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'block';
            header.style.visibility = 'visible';
        }
        
        // Verifică dacă imaginea de fundal este încărcată corect
        ensureBackgroundImage();
    }
    
    // Funcție pentru a asigura încărcarea imaginii de fundal
    function ensureBackgroundImage() {
        // Verifică dacă imaginea de fundal este încărcată
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (!backgroundImage || backgroundImage === 'none' || backgroundImage.includes('undefined')) {
            console.log('Imaginea de fundal nu este încărcată, se aplică fallback');
            body.style.backgroundImage = 'url("/my-website/images/cover.jpeg")';
        }
    }
    
    // Funcție pentru a detecta pagina curentă
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('products')) return 'products';
        if (path.includes('ong')) return 'ong';
        if (path.includes('therapy')) return 'therapy';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }
    
    // Asigură consistența navigației
    function ensureNavigation() {
        const currentPage = getCurrentPage();
        
        // Selectează toate link-urile din meniu
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            
            // Determină pagina asociată link-ului
            let pageName = 'home';
            if (href.includes('products')) pageName = 'products';
            if (href.includes('ong')) pageName = 'ong';
            if (href.includes('therapy')) pageName = 'therapy';
            if (href.includes('contact')) pageName = 'contact';
            
            // Marchează link-ul activ
            if (pageName === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Aplică toate funcțiile de compatibilitate
    applyConsistentStyles();
    ensureNavigation();
    
    // Reaplică la schimbarea dimensiunii ferestrei
    window.addEventListener('resize', () => {
        applyConsistentStyles();
        ensureNavigation();
    });
});
