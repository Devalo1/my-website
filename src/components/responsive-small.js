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
    
    console.log('Ajustări pentru conținut (non-header) aplicate pentru ecrane mici.');
});
