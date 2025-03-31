/**
 * Asset Checker Utility
 * Verifies that images and other assets are loaded correctly
 * and provides fallbacks when needed
 */

// Function to check if an image exists at a given path
export async function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
}

// Function to verify and fix the background image
export function verifyBackgroundImage() {
  // Try various paths where the background image might be
  const possiblePaths = [
    '/my-website/images/cover.jpeg',
    './images/cover.jpeg',
    '/my-website/images/cover.jpg',
    '/my-website/background.jpg',
    '/my-website/public/images/cover.jpeg',
    './public/images/cover.jpeg',
    'images/cover.jpeg'
  ];
  
  let workingPath = null;
  let pathChecks = 0;
  
  // Create an image to test each path
  const testImage = new Image();
  testImage.onload = () => {
    workingPath = testImage.src;
    console.log('Background image loaded successfully.');
    
    // Dispatch event that background image is found
    const event = new CustomEvent('backgroundImageFound', { 
      detail: { path: workingPath } 
    });
    document.dispatchEvent(event);
    
    // Set the working path as a CSS variable for easy access
    document.documentElement.style.setProperty('--background-image-path', `url('${workingPath}')`);
  };
  
  testImage.onerror = () => {
    pathChecks++;
    if (pathChecks < possiblePaths.length) {
      // Try the next path
      testImage.src = possiblePaths[pathChecks];
    } else {
      console.error('Could not find a working path for the background image.');
      // Use a SVG gradient as fallback
      const svgFallback = `
        data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%238b5a2b'/%3E%3Cstop offset='1' stop-color='%236b4423'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff10' cx='12' cy='12' r='3'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)'/%3E%3C/svg%3E
      `;
      document.documentElement.style.setProperty('--background-image-path', `url("${svgFallback}")`);
    }
  };
  
  // Start the checking process with the first path
  testImage.src = possiblePaths[0];
  
  return !!workingPath;
}

// Function to inject placeholder images when real images are missing
export function injectPlaceholders() {
  console.log('Se injectează placeholdere pentru imagini lipsă');
  
  // Check for broken images
  document.querySelectorAll('img').forEach(img => {
    // Skip if the image already has an error handler
    if (img.hasAttribute('data-placeholder-handled')) return;
    
    // Mark as handled
    img.setAttribute('data-placeholder-handled', 'true');
    
    // Add error handler
    img.addEventListener('error', () => {
      const alt = img.alt || 'Image';
      const width = img.width || 200;
      const height = img.height || 200;
      
      // Generate SVG placeholder with text
      const svgPlaceholder = `
        data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f1f1f1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23888'%3E${alt}%3C/text%3E%3C/svg%3E
      `;
      
      // Set the placeholder as source
      img.src = svgPlaceholder;
    });
  });
  
  // Check background cover image
  checkImageExists('/my-website/images/cover.jpeg').then(exists => {
    if (exists) {
      console.log('Imaginea Background Cover există și se încarcă corect');
    } else {
      console.warn('Imaginea Background Cover nu există sau nu se încarcă corect');
      // Apply a fallback background
      document.body.style.background = 'linear-gradient(135deg, #8b5a2b 0%, #6b4423 100%)';
    }
  });
  
  // Check logo image
  checkImageExists('/my-website/images/Logo.svg').then(exists => {
    if (!exists) {
      // Create a SVG fallback for logo
      const logoFallback = `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22100%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23fff8f0%22%20rx%3D%2210%22%20ry%3D%2210%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20fill%3D%22%236b4423%22%3ELupul%20si%20Corbul%3C%2Ftext%3E%3C%2Fsvg%3E`;
      console.log(`Fallback pentru Logo găsit: ${logoFallback}`);
      
      // Replace all Logo.svg references
      document.querySelectorAll('img[src*="Logo.svg"]').forEach(img => {
        img.src = logoFallback;
      });
    }
  });
  
  // Check profile icon
  checkImageExists('/my-website/images/profi.png').then(exists => {
    if (exists) {
      console.log('Imaginea Profile Icon există și se încarcă corect');
    } else {
      // Try alternative paths
      const altPaths = [
        '/my-website/images/profi.jpg',
        './images/profi.png',
        './public/images/profi.png'
      ];
      
      let checked = 0;
      function checkNext() {
        if (checked >= altPaths.length) {
          // Create SVG placeholder for profile
          const profileFallback = `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2225%22%20r%3D%2223%22%20fill%3D%22%23f1f1f1%22%20stroke%3D%22%236b4423%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2218%22%20r%3D%227%22%20fill%3D%22%236b4423%22%2F%3E%3Cpath%20d%3D%22M25%2C28%20C18%2C28%2013%2C32%2013%2C38%20L37%2C38%20C37%2C32%2032%2C28%2025%2C28%20Z%22%20fill%3D%22%236b4423%22%2F%3E%3C%2Fsvg%3E`;
          
          // Replace all profile icon references
          document.querySelectorAll('img[src*="profi"]').forEach(img => {
            img.src = profileFallback;
          });
          return;
        }
        
        checkImageExists(altPaths[checked]).then(found => {
          if (found) {
            // Replace all profile icon references with working path
            document.querySelectorAll('img[src*="profi"]').forEach(img => {
              img.src = altPaths[checked];
            });
          } else {
            checked++;
            checkNext();
          }
        });
      }
      
      checkNext();
    }
  });
  
  // Check other logo options
  checkImageExists('/my-website/images/Logo.svg').then(exists => {
    if (!exists) {
      // Try alternative logo URLs
      const altLogoPaths = [
        'http://localhost:5174/my-website/images/Logo.svg',
        'http://localhost:5174/my-website/images/logo.png'
      ];
      
      altLogoPaths.forEach(path => {
        console.log(`Fallback pentru Logo găsit: ${path}`);
      });
    }
  });
  
  // Check cart icon
  checkImageExists('/my-website/images/bag.png').then(exists => {
    if (exists) {
      console.log('Imaginea Cart Icon există și se încarcă corect');
    } else {
      // SVG fallback for cart icon
      const cartFallback = `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%3E%3Cpath%20d%3D%22M20%2C15%20L20%2C10%20L30%2C10%20L30%2C15%20L40%2C15%20L40%2C40%20L10%2C40%20L10%2C15%20Z%22%20fill%3D%22none%22%20stroke%3D%22%236b4423%22%20stroke-width%3D%222%22%2F%3E%3C%2Fsvg%3E`;
      
      // Replace all cart icon references
      document.querySelectorAll('img[src*="bag.png"]').forEach(img => {
        img.src = cartFallback;
      });
    }
  });
}

// Function to verify cover image
export function verifyCoverImage() {
  checkImageExists('/my-website/images/cover.jpeg').then(exists => {
    if (exists) {
      console.log('Cover image loaded successfully.');
    } else {
      console.warn('Cover image failed to load, checking alternatives...');
      
      // Try alternative paths
      const altPaths = [
        './images/cover.jpeg',
        '/images/cover.jpeg',
        '/my-website/cover.jpg',
        '/my-website/public/images/cover.jpeg'
      ];
      
      let found = false;
      
      Promise.all(altPaths.map(path => checkImageExists(path)))
        .then(results => {
          const workingPathIndex = results.findIndex(result => result);
          
          if (workingPathIndex >= 0) {
            const workingPath = altPaths[workingPathIndex];
            console.log(`Found working cover image at ${workingPath}`);
            
            // Update background image
            document.body.style.backgroundImage = `url('${workingPath}')`;
            found = true;
          }
          
          if (!found) {
            console.error('No working cover image found, using SVG fallback');
            // Use SVG fallback
            const svgFallback = `
              data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%238b5a2b'/%3E%3Cstop offset='1' stop-color='%236b4423'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff10' cx='12' cy='12' r='3'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)'/%3E%3C/svg%3E
            `;
            document.body.style.backgroundImage = `url("${svgFallback}")`;
          }
        });
    }
  });
}

// Export default for easier imports
export default {
  checkImageExists,
  verifyBackgroundImage,
  injectPlaceholders,
  verifyCoverImage
};
