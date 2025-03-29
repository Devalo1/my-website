document.addEventListener('DOMContentLoaded', () => {
    console.log('Large screen script loaded.');

    // Ensure navigation menu is visible for large screens
    const nav = document.querySelector('#main-nav');
    if (nav) {
        nav.style.display = 'flex'; // Make the navigation menu visible
        nav.style.flexDirection = 'row';
        nav.style.justifyContent = 'space-between';
        nav.style.padding = '1rem 2rem';
        console.log('Navigation menu adjusted for large screens.');
    }

    // Adjust grid layouts for large screens
    document.querySelectorAll('.produse-grid, .responsive-grid').forEach(grid => {
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        grid.style.gap = '2rem';
        console.log('Grid layout adjusted for large screens.');
    });

    // Reset profile and cart icon positioning
    const profile = document.querySelector('.profile');
    const cart = document.querySelector('.cart');
    if (profile && cart) {
        profile.style.position = '';
        profile.style.top = '';
        profile.style.right = '';
        profile.style.width = '';
        profile.style.height = '';

        cart.style.position = '';
        cart.style.top = '';
        cart.style.right = '';
        cart.style.width = '';
        cart.style.height = '';
        console.log('Profile and cart buttons reset for large screens.');
    }
});
