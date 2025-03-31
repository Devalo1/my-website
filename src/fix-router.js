/**
 * Router Fix Script - Ensures React Router works correctly
 * with GitHub Pages and the base path configuration
 */

(function() {
  // Use DEBUG flag to control logging
  const DEBUG = false;
  
  if (DEBUG) console.log('Router fix script initialized');
  
  // Function to handle SPA routing on GitHub Pages
  function initRouter() {
    // Get the base path from the meta tag or default to '/my-website/'
    const basePath = document.querySelector('meta[name="base-path"]')?.content || '/my-website/';
    
    // Handle GitHub Pages redirect logic for SPA
    const redirectMatcher = /([^?]*)?\?\/(.+)/;
    const match = location.search.match(redirectMatcher);
    
    if (match) {
      const [, , path] = match;
      const url = basePath + path;
      
      if (DEBUG) console.log(`SPA redirect: ${url}`);
      history.replaceState(null, null, url);
    }
    
    // Make sure all anchor links in the app use the proper base path
    document.addEventListener('click', function(event) {
      // Find the nearest anchor element
      let target = event.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      
      // If we found an anchor with href attribute
      if (target && target.href) {
        const href = target.getAttribute('href');
        
        // Only process internal links (not starting with http, tel, mailto, etc.)
        if (href && !href.match(/^(https?:|mailto:|tel:|#|javascript:)/)) {
          // Ensure the link has the correct base path
          if (href.startsWith('/') && !href.startsWith(basePath)) {
            target.href = basePath + href.substring(1);
          }
        }
      }
    });
  }
  
  // Run router fix when DOM is loaded
  if (document.readyState !== 'loading') {
    initRouter();
  } else {
    document.addEventListener('DOMContentLoaded', initRouter);
  }
})();

/**
 * React Router Warning Suppressor
 * 
 * This utility silences the React Router v6 deprecation warnings about future features
 * that appear in the browser console.
 */

// Define a global flag to prevent executing this more than once
window.__ROUTER_WARNINGS_FIXED = window.__ROUTER_WARNINGS_FIXED || false;

if (!window.__ROUTER_WARNINGS_FIXED) {
  // Only log when in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Applying React Router warnings fix...');
  }
  
  try {
    // Method 1: Set global properties to silence warnings
    window.__reactRouterReactVersion = window.React?.version;
    window.__reactRouterIsSuppressed = true;
    window.__reactRouterIsSilent = true;
    window.__reactRouterDisableWarnings = true;
    
    // Method 2: Override the console.warn function to filter out specific Router warnings
    const originalWarn = console.warn;
    console.warn = function(...args) {
      // Filter out React Router deprecation warnings
      const message = args[0]?.toString() || '';
      if (message.includes('React Router') && 
          (message.includes('Future Flag Warning') || 
           message.includes('startTransition') || 
           message.includes('relativeSplatPath'))) {
        // Suppress these specific warnings
        return;
      }
      
      // Filter out vite command logging
      if (message.includes('npx vite --base=/my-website/')) {
        return;
      }
      
      // Pass through other warnings to the original function
      originalWarn.apply(console, args);
    };
    
    // Mark as fixed to prevent multiple executions
    window.__ROUTER_WARNINGS_FIXED = true;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('React Router warnings successfully suppressed');
    }
  } catch (error) {
    console.error('Failed to suppress React Router warnings:', error);
  }
}

// Export an empty object to support import statements
export default {};
