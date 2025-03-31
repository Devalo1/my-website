// This script ensures the navigation menu is properly centered

document.addEventListener('DOMContentLoaded', function() {
  // Find the navbar menu
  const navbarNav = document.querySelector('.navbar-nav');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarNav) {
    // Remove any Bootstrap utility classes that might affect alignment
    navbarNav.classList.remove('ms-auto', 'me-auto', 'ml-auto', 'mr-auto', 'justify-content-end', 'justify-content-start');
    navbarNav.classList.add('mx-auto');
    
    // Apply inline styles for absolute centering
    navbarNav.style.display = 'flex';
    navbarNav.style.justifyContent = 'center';
    navbarNav.style.width = '100%';
    navbarNav.style.float = 'none';
    navbarNav.style.margin = '0 auto';
  }
  
  if (navbarCollapse) {
    navbarCollapse.classList.remove('justify-content-end', 'justify-content-start');
    navbarCollapse.style.display = 'flex';
    navbarCollapse.style.justifyContent = 'center';
  }
  
  // Adjust any container elements
  const container = document.querySelector('.navbar .container, .navbar .container-fluid');
  if (container) {
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
  }
});
