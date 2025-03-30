/**
 * MOBILE PERFORMANCE OPTIMIZER
 * 
 * This script improves mobile performance by:
 * 1. Disabling heavy animations
 * 2. Replacing video with static images
 * 3. Implementing lazy loading for images
 * 4. Preventing unnecessary script execution
 */

(function() {
  
  console.log('Mobile optimization active');
  
  // REPLACE VIDEO BACKGROUNDS WITH STATIC IMAGES
  function replaceVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // Create placeholder with same dimensions
      const placeholder = document.createElement('div');
      placeholder.className = 'video-placeholder';
      placeholder.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('/my-website/images/mobile-bg.jpg') center/cover no-repeat;
        z-index: ${getComputedStyle(video).zIndex};
      `;
      
      // Replace video with static image
      if (video.parentNode) {
        video.parentNode.insertBefore(placeholder, video);
        video.style.display = 'none';
        video.pause();
        video.src = '';
        video.load();
      }
    });
  }
  
  // OPTIMIZE IMAGES
  function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" attribute to all images
      img.setAttribute('loading', 'lazy');
      
      // Add decoding="async" attribute
      img.setAttribute('decoding', 'async');
      
      // Ensure alt text for accessibility
      if (!img.alt) {
        img.alt = 'Imagine website';
      }
    });
  }
  
  // DETECT CURRENT PAGE
  function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('products')) return 'products';
    if (path.includes('ong')) return 'ong';
    if (path.includes('therapy')) return 'therapy';
    if (path.includes('contact')) return 'contact';
    return 'home';
  }
  
  // OPTIMIZE PAGE SPECIFIC ELEMENTS
  function optimizeCurrentPage() {
    const page = getCurrentPage();
    console.log(`Optimizing for page: ${page}`);
    
    // Add page-specific class to body for CSS targeting
    document.body.classList.add(`page-${page}-mobile`);
    
    switch (page) {
      case 'home':
        // Optimize home page
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
          heroSection.style.height = '300px';
        }
        break;
        
      case 'products':
        // Optimize products page
        const productCards = document.querySelectorAll('.produs-card');
        productCards.forEach(card => {
          // Reduce image quality for better performance
          const img = card.querySelector('img');
          if (img && !img.src.includes('placeholder')) {
            // Store original src for potential high-quality view
            img.dataset.highQualitySrc = img.src;
            
            // Use smaller placeholder for list view
            if (img.src.includes('product')) {
              img.src = img.src.replace(/\.(jpg|jpeg|png)/, '-small.$1');
            }
          }
        });
        break;
        
      case 'ong':
        // Optimize ONG page
        break;
        
      case 'therapy':
        // Optimize therapy page
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
          // Make form inputs larger for better touch experience
          const inputs = contactForm.querySelectorAll('input, textarea');
          inputs.forEach(input => {
            input.style.padding = '12px';
            input.style.fontSize = '16px'; // Prevent zoom on iOS
          });
        }
        break;
        
      case 'contact':
        // Optimize contact page
        break;
    }
  }
  
  // Optimize font loading
  function optimizeFonts() {
    // Add preconnect for Google Fonts if used
    const linkPreconnect = document.createElement('link');
    linkPreconnect.rel = 'preconnect';
    linkPreconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(linkPreconnect);
    
    // Add font-display: swap to any inline font styles
    const styleElements = document.querySelectorAll('style');
    styleElements.forEach(style => {
      if (style.textContent.includes('@font-face')) {
        style.textContent = style.textContent.replace(
          /@font-face\s*{([^}]*)}/g, 
          '@font-face{$1;font-display:swap;}'
        );
      }
    });
  }
  
  // Execute optimizations
  function runOptimizations() {
    replaceVideos();
    optimizeImages();
    optimizeCurrentPage();
    optimizeFonts();
    console.log('Mobile optimizations complete');
  }
  
  // Run optimizations on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }
})();
