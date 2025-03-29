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
  // Only run on mobile devices
  if (window.innerWidth > 768) return;
  
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
        background: url('images/mobile-bg.jpg') center/cover no-repeat;
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
  
  // IMPLEMENT LAZY LOADING FOR IMAGES
  function setupLazyLoading() {
    const images = document.querySelectorAll('img:not(.critical-image)');
    
    images.forEach(img => {
      // Save original src and replace with placeholder
      if (img.src && !img.dataset.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.style.opacity = '0.1';
        img.style.transition = 'opacity 0.3s';
      }
    });
    
    // Setup intersection observer to load images when they enter viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => {
              img.style.opacity = '1';
              observer.unobserve(img);
            };
          }
        }
      });
    }, { rootMargin: '100px' });
    
    images.forEach(img => observer.observe(img));
  }
  
  // REDUCE ANIMATIONS AND TRANSITIONS
  function reduceAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation-duration: 0.001s !important;
        animation-delay: 0s !important;
        transition-duration: 0.001s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // OPTIMIZE BACKGROUND PROCESSING
  function optimizeBackgroundProcessing() {
    // Throttle scroll and resize events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function(e) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (typeof originalScrollHandler === 'function') {
          originalScrollHandler(e);
        }
      }, 100);
    };
    
    // Delay non-critical operations
    setTimeout(function() {
      // Load analytics, tracking, and other non-essential scripts
      const nonCriticalScripts = [
        'firebase-analytics.js'
      ];
      
      nonCriticalScripts.forEach(script => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      });
    }, 3000);
  }
  
  // Execute optimizations
  
  // First, immediate optimizations
  reduceAnimations();
  
  // Then, once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      replaceVideos();
      setupLazyLoading();
      optimizeBackgroundProcessing();
    });
  } else {
    // DOM already loaded
    replaceVideos();
    setupLazyLoading();
    optimizeBackgroundProcessing();
  }
  
  // Add a class to body for CSS optimizations
  document.body.classList.add('mobile-optimized');
})();
