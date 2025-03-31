/**
 * Background Fix Utility
 * Comprehensive solution for background image issues
 */

import { injectCriticalStyles } from './cssInjector';
import { verifyBackgroundImage, verifyCoverImage } from './assetChecker';

// Master function to apply all background fixes
export function applyBackgroundFixes() {
  console.log('Applying comprehensive background image fixes...');
  
  // Step 1: Inject critical CSS for backgrounds
  injectCriticalStyles();
  
  // Step 2: Verify background images and use fallbacks if needed
  const imageVerified = verifyBackgroundImage();
  
  // Step 3: Preload the background image for faster loading
  preloadBackgroundImage();
  
  // Step 4: Apply direct body background as fallback if verification failed
  if (!imageVerified) {
    applyDirectBodyBackground();
  }
  
  // Step 5: Set up continuous monitoring for background image loading
  setupBackgroundLoadingMonitor();
  
  console.log('Background image fixes applied successfully');
  
  return true;
}

// Helper function to preload background image
function preloadBackgroundImage() {
  // Check if there's already a preload link for our cover image
  const existingPreload = document.querySelector('link[rel="preload"][href="/my-website/images/cover.jpeg"]');
  
  if (!existingPreload) {
    // Create a preload link
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/my-website/images/cover.jpeg';
    preloadLink.as = 'image';
    preloadLink.type = 'image/jpeg';
    preloadLink.importance = 'high'; // Mark as high importance
    document.head.appendChild(preloadLink);
    
    console.log('Added preload link for cover image');
  } else {
    console.log('Correct preload link for cover image already exists');
  }
}

// Helper function to apply background directly to body if needed
export function applyDirectBodyBackground() {
  // Apply the background directly to body with inline style
  document.body.style.backgroundImage = 'url("/my-website/images/cover.jpeg")';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
  
  // Try to load the image to see if it works
  const img = new Image();
  img.onload = () => {
    console.log('Direct body background image loaded successfully');
  };
  img.onerror = () => {
    console.warn('Direct body background image failed to load, trying SVG fallback');
    // If JPEG fails, try an SVG fallback
    const svgFallback = `
      data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%238b5a2b'/%3E%3Cstop offset='1' stop-color='%236b4423'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff10' cx='12' cy='12' r='3'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)'/%3E%3C/svg%3E
    `;
    document.body.style.backgroundImage = `url("${svgFallback}")`;
  };
  img.src = '/my-website/images/cover.jpeg';
}

// Helper function to set up continuous monitoring
function setupBackgroundLoadingMonitor() {
  // Set up an interval to check if the background image is loaded properly
  let checkCount = 0;
  const maxChecks = 10;
  
  const checkInterval = setInterval(() => {
    checkCount++;
    
    // Check if there's a computed background image on body or any container
    const bodyStyle = window.getComputedStyle(document.body);
    const bodyBg = bodyStyle.backgroundImage;
    
    if (bodyBg && bodyBg !== 'none' && !bodyBg.includes('linear-gradient')) {
      console.log('Background image detected in computed style');
      clearInterval(checkInterval);
    } else if (checkCount >= maxChecks) {
      console.log('Background checks completed, applying final fixes if needed');
      // One last verification
      verifyBackgroundImage();
      verifyCoverImage();
      clearInterval(checkInterval);
    }
  }, 1000);
  
  // Also check when all resources are loaded
  window.addEventListener('load', () => {
    verifyBackgroundImage();
    clearInterval(checkInterval);
  });
}

// Export default for easier imports
export default { applyBackgroundFixes, applyDirectBodyBackground };
