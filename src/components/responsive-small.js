document.addEventListener('DOMContentLoaded', () => {
    console.log('Script pentru ecrane mici încărcat.');
    
    // NU mai afectăm direct header-ul sau meniul - Header M.js se va ocupa de ele
    console.log('responsive-small.js: Delegarea completă a controlului header-ului către Header M.js');
    
    // Ajustează doar layout-urile care nu țin de header
    document.querySelectorAll('.produse-grid, .responsive-grid').forEach(grid => {
        grid.style.gridTemplateColumns = '1fr';
        grid.style.gap = '1rem';
        console.log('Layout grid ajustat pentru ecrane mici.');
    });

    // Ajustează footer-ul pentru ecrane mici
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.textAlign = 'center';
        footer.style.padding = '1rem';
        console.log('Footer ajustat pentru ecrane mici.');
    }
    
    // Alte ajustări pentru ecrane mici (care nu afectează header-ul)
    document.querySelectorAll('h1:not(header h1), h2:not(header h2), h3:not(header h3)').forEach(h => {
        h.style.fontSize = h.tagName === 'H1' ? '1.5rem' : h.tagName === 'H2' ? '1.3rem' : '1.1rem';
    });
    
    document.querySelectorAll('p:not(header p)').forEach(p => {
        p.style.fontSize = '1rem';
    });
    
    // Ajustări pentru paginile specifice
    adjustSpecificPages();
    
    console.log('Ajustări pentru conținut (non-header) aplicate pentru ecrane mici.');
    
    /**
     * Ajustează elementele specifice pentru fiecare pagină
     */
    function adjustSpecificPages() {
        const path = window.location.pathname;
        
        // Pagina Acasă
        if (path.includes('home') || path === '/' || path.endsWith('/my-website/')) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.height = '300px';
                heroSection.style.padding = '1rem';
            }
        }
        
        // Pagina Produse
        if (path.includes('products')) {
            const productCards = document.querySelectorAll('.produs-card');
            productCards.forEach(card => {
                card.style.margin = '1rem 0';
                card.style.maxWidth = '100%';
            });
        }
        
        // Pagina ONG
        if (path.includes('ong')) {
            const missionCards = document.querySelectorAll('.mission-card');
            missionCards.forEach(card => {
                card.style.margin = '1rem 0';
                card.style.width = '100%';
            });
        }
        
        // Pagina Terapie
        if (path.includes('therapy')) {
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                contactForm.style.padding = '1rem';
            }
        }
        
        // Pagina Contact
        if (path.includes('contact')) {
            const contactCards = document.querySelectorAll('.contact-card');
            contactCards.forEach(card => {
                card.style.width = '100%';
                card.style.margin = '1rem 0';
            });
        }
    }
});
