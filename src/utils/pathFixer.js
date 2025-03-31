/**
 * Path Fixer Utility
 * Fixes common path issues including duplicate base paths and incorrect URLs
 */

// Fix duplicate paths in preload links
export function fixDuplicatePreloadPaths() {
  console.log('Path Fixer: Checking for duplicate paths in preload links...');
  
  // Find all preload links
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  let fixedCount = 0;
  
  preloadLinks.forEach(link => {
    // Check for duplicate base path pattern
    if (link.href && link.href.includes('/my-website/my-website/')) {
      const originalHref = link.href;
      
      // More aggressive approach: Remove and recreate the link instead of just changing href
      if (link.parentNode) {
        // Store the attributes we want to keep
        const as = link.getAttribute('as');
        const type = link.getAttribute('type');
        const importance = link.getAttribute('importance') || 'auto';
        
        // Create corrected path
        const correctedHref = link.href.replace(/\/my-website\/my-website\//g, '/my-website/');
        
        // Remove the problematic link
        link.parentNode.removeChild(link);
        
        // Create a new link with correct attributes
        const newLink = document.createElement('link');
        newLink.rel = 'preload';
        newLink.href = correctedHref;
        newLink.setAttribute('as', as || 'image');
        if (type) newLink.setAttribute('type', type);
        newLink.setAttribute('importance', importance);
        newLink.setAttribute('data-fixed', 'true');
        
        // Add the new link
        document.head.appendChild(newLink);
        
        console.log(`Path Fixer: Replaced problematic preload link:\nFrom: ${originalHref}\nTo: ${correctedHref}`);
        fixedCount++;
      }
    }
  });

  // If we found and fixed links, add a MutationObserver to catch any that might be added later
  if (fixedCount > 0) {
    setupPathObserver();
    console.log(`Path Fixer: Fixed ${fixedCount} preload links with duplicate paths`);
  } else {
    console.log('Path Fixer: No duplicate paths found in preload links');
  }

  return fixedCount;
}

// Add fixed-path attribute to image tags as needed
export function fixImageSrcPaths() {
  console.log('Path Fixer: Checking for duplicate paths in image sources...');
  
  // Find all image tags
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach(img => {
    // Skip already processed images
    if (img.hasAttribute('data-path-fixed')) return;
    
    // Check for duplicate base path pattern
    if (img.src && img.src.includes('/my-website/my-website/')) {
      const originalSrc = img.src;
      // Fix the URL by replacing duplicate path
      img.src = img.src.replace(/\/my-website\/my-website\//g, '/my-website/');
      img.setAttribute('data-path-fixed', 'true');
      console.log(`Path Fixer: Fixed duplicate path in image src:\nFrom: ${originalSrc}\nTo: ${img.src}`);
      fixedCount++;
    }
  });

  if (fixedCount > 0) {
    console.log(`Path Fixer: Fixed ${fixedCount} image sources with duplicate paths`);
  } else {
    console.log('Path Fixer: No duplicate paths found in image sources');
  }

  return fixedCount;
}

// Fix all background images in inline styles
export function fixBackgroundImagePaths() {
  console.log('Path Fixer: Checking for duplicate paths in background images...');
  
  // Get all elements with style attribute
  const elementsWithStyle = document.querySelectorAll('[style*="background"]');
  let fixedCount = 0;
  
  elementsWithStyle.forEach(el => {
    const style = el.getAttribute('style');
    if (style && style.includes('/my-website/my-website/')) {
      const newStyle = style.replace(/\/my-website\/my-website\//g, '/my-website/');
      el.setAttribute('style', newStyle);
      console.log('Path Fixer: Fixed duplicate path in inline style');
      fixedCount++;
    }
  });

  // Also check for CSS rules with background-image
  const styleSheets = Array.from(document.styleSheets);
  styleSheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules || []);
      rules.forEach(rule => {
        if (rule.style && rule.style.backgroundImage && 
            rule.style.backgroundImage.includes('/my-website/my-website/')) {
          rule.style.backgroundImage = rule.style.backgroundImage.replace(
            /\/my-website\/my-website\//g, '/my-website/'
          );
          fixedCount++;
        }
      });
    } catch (e) {
      // CORS may prevent accessing some stylesheets, which is okay
    }
  });

  if (fixedCount > 0) {
    console.log(`Path Fixer: Fixed ${fixedCount} background images with duplicate paths`);
  } else {
    console.log('Path Fixer: No duplicate paths found in background images');
  }

  return fixedCount;
}

// Add new advanced path fixing function to handle more complex path issues
export function fixMultiLevelPaths() {
  console.log('Path Fixer: Checking for multi-level path issues...');
  
  // Find elements with src or href attributes that might have multi-level path issues
  const elementsWithPaths = document.querySelectorAll('[src], [href], [data-src]');
  let fixedCount = 0;
  
  elementsWithPaths.forEach(element => {
    // Handle src attributes (images, scripts, etc.)
    if (element.hasAttribute('src') && !element.hasAttribute('data-path-fixed-ml')) {
      const srcValue = element.getAttribute('src');
      if (srcValue && (srcValue.includes('/my-website/my-website/') || 
                       srcValue.includes('//my-website//') || 
                       srcValue.match(/\/my-website\/{2,}/))) {
        
        const originalSrc = srcValue;
        // Fix all forms of duplicate paths
        const correctedSrc = srcValue
          .replace(/\/my-website\/my-website\//g, '/my-website/')
          .replace(/\/my-website\/+/g, '/my-website/')
          .replace(/\/+/g, '/');
        
        element.setAttribute('src', correctedSrc);
        element.setAttribute('data-path-fixed-ml', 'true');
        console.log(`Path Fixer: Fixed complex path in src:\nFrom: ${originalSrc}\nTo: ${correctedSrc}`);
        fixedCount++;
      }
    }
    
    // Handle href attributes (links, stylesheets, etc.)
    if (element.hasAttribute('href') && !element.hasAttribute('data-path-fixed-ml')) {
      const hrefValue = element.getAttribute('href');
      if (hrefValue && (hrefValue.includes('/my-website/my-website/') || 
                        hrefValue.includes('//my-website//') ||
                        hrefValue.match(/\/my-website\/{2,}/))) {
        
        const originalHref = hrefValue;
        // Fix all forms of duplicate paths
        const correctedHref = hrefValue
          .replace(/\/my-website\/my-website\//g, '/my-website/')
          .replace(/\/my-website\/+/g, '/my-website/')
          .replace(/\/+/g, '/');
        
        element.setAttribute('href', correctedHref);
        element.setAttribute('data-path-fixed-ml', 'true');
        console.log(`Path Fixer: Fixed complex path in href:\nFrom: ${originalHref}\nTo: ${correctedHref}`);
        fixedCount++;
      }
    }
    
    // Handle data-src attributes (lazy loading images)
    if (element.hasAttribute('data-src') && !element.hasAttribute('data-path-fixed-ml')) {
      const dataSrcValue = element.getAttribute('data-src');
      if (dataSrcValue && (dataSrcValue.includes('/my-website/my-website/') || 
                          dataSrcValue.includes('//my-website//') ||
                          dataSrcValue.match(/\/my-website\/{2,}/))) {
        
        const originalDataSrc = dataSrcValue;
        // Fix all forms of duplicate paths
        const correctedDataSrc = dataSrcValue
          .replace(/\/my-website\/my-website\//g, '/my-website/')
          .replace(/\/my-website\/+/g, '/my-website/')
          .replace(/\/+/g, '/');
        
        element.setAttribute('data-src', correctedDataSrc);
        element.setAttribute('data-path-fixed-ml', 'true');
        console.log(`Path Fixer: Fixed complex path in data-src:\nFrom: ${originalDataSrc}\nTo: ${correctedDataSrc}`);
        fixedCount++;
      }
    }
  });
  
  if (fixedCount > 0) {
    console.log(`Path Fixer: Fixed ${fixedCount} elements with complex path issues`);
  } else {
    console.log('Path Fixer: No complex path issues found');
  }
  
  return fixedCount;
}

// Function to fix absolute vs relative path issues
export function fixRelativePaths() {
  console.log('Path Fixer: Checking for relative path issues...');
  
  const basePath = '/my-website/';
  const elementsWithPaths = document.querySelectorAll('[src], [href]');
  let fixedCount = 0;
  
  elementsWithPaths.forEach(element => {
    // Only process elements that haven't been fixed by other functions
    if (element.hasAttribute('data-path-fixed') || element.hasAttribute('data-path-fixed-ml')) {
      return;
    }
    
    // Check for relative paths that should be absolute
    if (element.hasAttribute('src')) {
      const srcValue = element.getAttribute('src');
      if (srcValue && srcValue.startsWith('./') && !srcValue.includes(basePath)) {
        const originalSrc = srcValue;
        const correctedSrc = basePath + srcValue.substring(2); // Remove './' and add basePath
        
        element.setAttribute('src', correctedSrc);
        element.setAttribute('data-path-fixed-rel', 'true');
        console.log(`Path Fixer: Fixed relative path in src:\nFrom: ${originalSrc}\nTo: ${correctedSrc}`);
        fixedCount++;
      }
    }
    
    if (element.hasAttribute('href')) {
      const hrefValue = element.getAttribute('href');
      if (hrefValue && hrefValue.startsWith('./') && !hrefValue.includes(basePath)) {
        const originalHref = hrefValue;
        const correctedHref = basePath + hrefValue.substring(2); // Remove './' and add basePath
        
        element.setAttribute('href', correctedHref);
        element.setAttribute('data-path-fixed-rel', 'true');
        console.log(`Path Fixer: Fixed relative path in href:\nFrom: ${originalHref}\nTo: ${correctedHref}`);
        fixedCount++;
      }
    }
  });
  
  if (fixedCount > 0) {
    console.log(`Path Fixer: Fixed ${fixedCount} elements with relative path issues`);
  } else {
    console.log('Path Fixer: No relative path issues found');
  }
  
  return fixedCount;
}

// Set up a MutationObserver to catch dynamically added elements with path issues
function setupPathObserver() {
  // Skip if observer already set up
  if (window.__pathFixerObserverActive) return;
  
  const observer = new MutationObserver(mutations => {
    let needsCheck = false;
    
    // Look for added nodes that might need fixing
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        needsCheck = true;
      }
    });
    
    if (needsCheck) {
      fixDuplicatePreloadPaths();
      fixImageSrcPaths();
      fixBackgroundImagePaths();
      fixMultiLevelPaths();
      fixRelativePaths();
    }
  });
  
  // Start observing document for changes
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'src', 'style']
  });
  
  window.__pathFixerObserverActive = true;
  console.log('Path Fixer: Observer set up to fix paths in newly added elements');
}

// New function to ensure cover image preload is correct
function ensureCoverImagePreload() {
  // Check if we already have a correct preload
  const existingCorrectPreload = document.querySelector('link[rel="preload"][href="/my-website/images/cover.jpeg"][data-fixed="true"]');
  
  if (!existingCorrectPreload) {
    // Create a correct preload link for the cover image
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/my-website/images/cover.jpeg';
    preloadLink.as = 'image';
    preloadLink.type = 'image/jpeg';
    preloadLink.importance = 'high';
    preloadLink.setAttribute('data-fixed', 'true');
    document.head.appendChild(preloadLink);
    console.log('Path Fixer: Added correct cover image preload');
  }
  
  // Remove any preload with duplicate path for cover image
  const badPreloads = document.querySelectorAll('link[rel="preload"][href*="/my-website/my-website/images/cover.jpeg"]');
  if (badPreloads.length > 0) {
    badPreloads.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
        console.log('Path Fixer: Removed duplicate path cover image preload');
      }
    });
  }
}

// Run all path fixers
export function fixAllPaths() {
  console.log('Path Fixer: Running comprehensive path fix...');
  
  // Get the base path from meta tag or environment
  const basePath = document.querySelector('meta[name="base-path"]')?.getAttribute('content') || '/my-website/';
  
  // Find all links and update them
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith(basePath) && href !== '/') {
      link.setAttribute('href', `${basePath}${href.substring(1)}`);
    }
  });
  
  // Find all images and update their src
  document.querySelectorAll('img[src^="/"]').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith(basePath)) {
      img.setAttribute('src', `${basePath}${src.substring(1)}`);
    }
  });
  
  let totalFixed = 0;
  totalFixed += fixDuplicatePreloadPaths();
  totalFixed += fixImageSrcPaths();
  totalFixed += fixBackgroundImagePaths();
  totalFixed += fixMultiLevelPaths(); // Add new multi-level path fixing
  totalFixed += fixRelativePaths(); // Add new relative path fixing
  
  // If we fixed any paths, set up the observer
  if (totalFixed > 0) {
    setupPathObserver();
  }
  
  return totalFixed;
}

// Add path status checker for debugging
export function getPathStatus() {
  const brokenImages = [];
  const suspiciousPaths = [];
  
  // Check images
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete || img.naturalHeight === 0) {
      brokenImages.push({
        element: 'img',
        src: img.src,
        alt: img.alt || 'No alt text'
      });
    }
    
    if (img.src && (img.src.includes('//') || img.src.includes('/my-website/my-website/'))) {
      suspiciousPaths.push({
        element: 'img',
        path: img.src
      });
    }
  });
  
  // Check CSS background images
  document.querySelectorAll('[style*="background"]').forEach(el => {
    const style = el.getAttribute('style');
    if (style && (style.includes('//') || style.includes('/my-website/my-website/'))) {
      suspiciousPaths.push({
        element: 'element with background style',
        path: style
      });
    }
  });
  
  // Check links
  document.querySelectorAll('link[rel="preload"]').forEach(link => {
    if (link.href && (link.href.includes('//') || link.href.includes('/my-website/my-website/'))) {
      suspiciousPaths.push({
        element: 'preload link',
        path: link.href
      });
    }
  });
  
  return {
    brokenImages,
    suspiciousPaths,
    totalBroken: brokenImages.length,
    totalSuspicious: suspiciousPaths.length
  };
}

// Auto-run on script load if in browser environment
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllPaths);
  } else {
    fixAllPaths();
  }
  
  // Also fix on load to catch any late additions
  window.addEventListener('load', fixAllPaths);
}
