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
  // Fix for duplicate path - ensure we don't add /my-website/ twice
  const baseUrl = '/my-website';
  const imgPath = '/images/cover.jpeg';
  const imgUrl = baseUrl + imgPath;
  
  // Check for any existing preload links for this image (with any path)
  const existingPreloadsWithDuplicatePath = document.querySelectorAll('link[rel="preload"][href*="/my-website/my-website/"]');
  
  // Remove ALL preload links with incorrect duplicated paths
  existingPreloadsWithDuplicatePath.forEach(link => {
    console.log('Found and removing incorrect preload link with duplicated path:', link.href);
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  });
  
  // Get the correct preload links for our cover image
  const correctPreloads = document.querySelectorAll(`link[rel="preload"][href="${imgUrl}"]`);
  
  // Only preload if not already done correctly in HTML
  if (correctPreloads.length === 0) {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = imgUrl;
    preloadLink.as = 'image';
    preloadLink.type = 'image/jpeg';
    preloadLink.setAttribute('data-added-by', 'backgroundFix');
    document.head.appendChild(preloadLink);
    console.log('Background image preload directive added with correct path:', imgUrl);
  } else {
    console.log('Correct preload link for cover image already exists');
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
