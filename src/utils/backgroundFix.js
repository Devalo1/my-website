/**
 * Comprehensive fix for background image issues
 * This utility combines all the fixes we've created to ensure
 * the background image displays correctly in all environments
 */

import { injectCriticalStyles } from './cssInjector';
import { verifyBackgroundImage, verifyCoverImage } from './assetChecker';

/**
 * Apply all background fixes in the correct order
 */
export function applyBackgroundFixes() {
  console.log('Applying comprehensive background image fixes...');
  
  // Step 1: Inject critical CSS styles
  injectCriticalStyles();
  
  // Step 2: Verify background images exist
  verifyBackgroundImage();
  verifyCoverImage();
  
  // Step 3: Preload the background image
  preloadBackgroundImage();
  
  // Step 4: Listen for DOM content loaded to reapply fixes
  document.addEventListener('DOMContentLoaded', () => {
    injectCriticalStyles();
    checkBackgroundRendering();
  });
  
  // Step 5: Final check after full page load
  window.addEventListener('load', () => {
    checkBackgroundRendering();
  });
  
  console.log('Background image fixes applied successfully');
}

/**
 * Preload the background image for faster rendering
 */
function preloadBackgroundImage() {
  const imgUrl = '/my-website/images/cover.jpeg';
  
  // Only preload if not already done in HTML
  if (!document.querySelector(`link[rel="preload"][href="${imgUrl}"]`)) {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = imgUrl;
    preloadLink.as = 'image';
    preloadLink.type = 'image/jpeg';
    document.head.appendChild(preloadLink);
    console.log('Background image preload directive added');
  }
}

/**
 * Check if the background is properly rendered and apply fixes if not
 */
function checkBackgroundRendering() {
  // Wait a small amount of time to see if background is applied
  setTimeout(() => {
    const computedBg = window.getComputedStyle(document.body).backgroundImage;
    
    if (!computedBg || computedBg === 'none' || !computedBg.includes('cover.jpeg')) {
      console.warn('Background image not properly applied, applying fallback');
      applyDirectBodyBackground();
    }
  }, 500);
}

/**
 * Set up direct background image for the body
 * This is a last resort fallback
 */
export function applyDirectBodyBackground() {
  document.body.style.backgroundImage = "url('/my-website/images/cover.jpeg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
  console.log('Direct body background applied');
  
  // If the image still fails to load, try the SVG fallback
  const testImg = new Image();
  testImg.onerror = () => {
    document.body.style.backgroundImage = "url('/my-website/images/cover.svg')";
    console.log('Switched to SVG fallback background');
  };
  testImg.src = '/my-website/images/cover.jpeg';
}
