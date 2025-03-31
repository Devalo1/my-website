/**
 * Mobile Optimization Script
 * Applies performance optimizations specifically for mobile devices
 */

(function() {
  // Check if we're on a mobile device
  const isMobile = window.innerWidth <= 768 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) {
    console.log('Mobile optimizations skipped: not a mobile device');
    return;
  }
  
  console.log('Applying mobile optimizations...');
  
  // List of optimizations applied
  const appliedOptimizations = [];
  
  // 1. Reduce image quality for faster loading
  function optimizeImages() {
    const images = document.querySelectorAll('img:not([data-mobile-optimized])');
    
    images.forEach(img => {
      // Skip small images and SVGs
      if (img.src.includes('.svg') || img.width < 100) return;
      
      // Mark as processed
      img.setAttribute('data-mobile-optimized', 'true');
      
      // Add loading="lazy" attribute for images below the fold
      if (!isElementInViewport(img)) {
        img.loading = 'lazy';
      }
      
      // Add event listeners for error handling
      img.addEventListener('error', () => {
        // If image fails to load, try a different format or show a placeholder
        if (img.src.includes('.jpg') || img.src.includes('.jpeg')) {
          // Try WebP version if available
          const webpSrc = img.src.replace(/\.(jpg|jpeg)$/, '.webp');
          const testImg = new Image();
          testImg.onload = () => { img.src = webpSrc; };
          testImg.src = webpSrc;
        }
      });
    });
    
    appliedOptimizations.push('Image optimization with lazy loading');
  }
  
  // 2. Reduce CSS animations for better performance
  function reduceAnimations() {
    // Create a style element to disable heavy animations
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        *, *::before, *::after {
          animation-duration: 0.001s !important;
          animation-delay: 0s !important;
          transition-duration: 0.001s !important;
          transition-delay: 0s !important;
        }
        
        /* Allow specific light animations (like menu toggle) */
        .menu-toggle, .navigation-menu-v7, .menu-overlay-v7 {
          transition-duration: 0.3s !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    appliedOptimizations.push('Reduced animations');
  }
  
  // 3. Simplify DOM by removing non-essential elements on mobile
  function simplifyDOM() {
    // Find and remove decorative elements not needed on mobile
    const decorativeElements = document.querySelectorAll('.decorative, .desktop-only, .background-animation');
    decorativeElements.forEach(el => {
      el.style.display = 'none';
    });
    
    // Simplify complex layouts
    const complexLayouts = document.querySelectorAll('.complex-grid, .masonry-layout');
    complexLayouts.forEach(layout => {
      layout.style.display = 'flex';
      layout.style.flexDirection = 'column';
    });
    
    appliedOptimizations.push('Simplified DOM structure');
  }
  
  // 4. Reduce text content length on mobile
  function simplifyContent() {
    // Find long paragraphs and add a "Read more" button
    const longParagraphs = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.length > 200);
    
    longParagraphs.forEach(p => {
      if (p.hasAttribute('data-simplified')) return;
      
      const originalText = p.textContent;
      const shortText = originalText.substring(0, 200) + '...';
      
      p.setAttribute('data-original-text', originalText);
      p.setAttribute('data-simplified', 'true');
      p.textContent = shortText;
      
      // Add read more button
      const readMore = document.createElement('button');
      readMore.className = 'read-more-btn';
      readMore.textContent = 'Citește mai mult';
      readMore.style.display = 'block';
      readMore.style.margin = '10px 0';
      readMore.style.padding = '5px 10px';
      readMore.style.background = '#6b4423';
      readMore.style.color = 'white';
      readMore.style.border = 'none';
      readMore.style.borderRadius = '4px';
      
      let expanded = false;
      readMore.addEventListener('click', () => {
        if (expanded) {
          p.textContent = shortText;
          readMore.textContent = 'Citește mai mult';
          expanded = false;
        } else {
          p.textContent = originalText;
          readMore.textContent = 'Citește mai puțin';
          expanded = true;
        }
      });
      
      p.parentNode.insertBefore(readMore, p.nextSibling);
    });
    
    appliedOptimizations.push('Content simplification');
  }
  
  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Run optimizations after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }
  
  function runOptimizations() {
    // Apply all optimizations
    optimizeImages();
    reduceAnimations();
    simplifyDOM();
    simplifyContent();
    
    // Mark mobile optimizations as applied
    window.mobileOptimizationsApplied = true;
    
    // Dispatch event to notify other scripts
    const event = new CustomEvent('mobileOptimizationsApplied', {
      detail: { optimizations: appliedOptimizations }
    });
    document.dispatchEvent(event);
    
    console.log('Mobile optimizations applied:', appliedOptimizations);
  }
})();
