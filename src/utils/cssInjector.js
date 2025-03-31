/**
 * CSS Injector Utility
 * Injects critical CSS styles directly into the document at runtime
 */

// Main function to inject critical CSS
export function injectCriticalStyles() {
  // Create a style element if it doesn't exist
  let styleEl = document.getElementById('critical-css-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'critical-css-styles';
    document.head.appendChild(styleEl);
  }

  // Define critical styles that should be applied immediately
  // These ensure background images and layout are correctly displayed
  // even before external CSS files are loaded
  const criticalStyles = `
    /* Essential body styles to ensure background image works */
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      min-width: 320px;
      background-color: #242424; /* Fallback color */
      background-image: url('/my-website/images/cover.jpeg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", 
                   Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", 
                   "Helvetica Neue", sans-serif;
    }

    /* Root container styles */
    #root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* Basic app layout */
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
    }

    /* Content area */
    .content {
      flex: 1;
      padding: 2rem;
      z-index: 1;
      position: relative;
    }

    /* Card styles */
    .content-card {
      background-color: rgba(255, 248, 240, 0.9);
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    /* Ensure images don't overflow */
    img {
      max-width: 100%;
      height: auto;
    }

    /* Default button styling */
    .btn {
      background-color: #6b4423;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    .btn:hover {
      background-color: #8b5a2b;
    }

    /* Basic header styling */
    header {
      background-color: rgba(255, 248, 240, 0.9);
      padding: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 100;
    }

    /* Fix for background image in Firefox */
    @-moz-document url-prefix() {
      body {
        background-attachment: scroll;
      }
    }
  `;

  // Apply the styles
  styleEl.textContent = criticalStyles;
  console.log('Critical CSS styles injected successfully');

  // Return the style element in case it needs to be modified elsewhere
  return styleEl;
}

// Auto-inject when the DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCriticalStyles);
  } else {
    injectCriticalStyles();
  }
}

// Export default for easier imports
export default { injectCriticalStyles };
