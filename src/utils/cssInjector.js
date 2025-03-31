/**
 * A utility to inject critical CSS variables at runtime
 */
export function injectCriticalStyles() {
  // Create a style element
  const style = document.createElement('style');
  
  // Define the CSS with hardcoded paths
  style.textContent = `
    :root {
      --cover-url: url('/my-website/images/cover.jpeg') !important;
      --background-url: url('/my-website/images/cover.jpeg') !important;
    }
    
    body {
      background-image: url('/my-website/images/cover.jpeg') !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      background-attachment: fixed !important;
    }
    
    .background-image {
      background-image: url('/my-website/images/cover.jpeg') !important;
    }
    
    .site-cover {
      background-image: url('/my-website/images/cover.jpeg') !important;
    }
    
    .home-container {
      background-image: url('/my-website/images/cover.jpeg') !important;
    }
  `;
  
  // Append to head
  document.head.appendChild(style);
  console.log('Critical CSS styles injected successfully');
}
