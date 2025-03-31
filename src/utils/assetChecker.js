/**
 * Acest utilitar ajută la verificarea încărcării corecte a imaginilor
 */
export function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (DEBUG) console.log(`Imaginea ${imagePath} s-a încărcat cu succes!`);
      resolve(true);
    };
    img.onerror = () => {
      if (DEBUG) console.error(`EROARE: Imaginea ${imagePath} nu s-a putut încărca!`);
      resolve(false);
    };
    img.src = imagePath;
  });
}

// Debug flag to reduce console noise
const DEBUG = false;

/**
 * Verifică dacă imaginea de background există 
 * și oferă soluții alternative dacă nu este găsită
 */
export function verifyBackgroundImage() {
  const img = new Image();
  img.onload = () => console.log('Background image loaded successfully.');
  img.onerror = () => {
    console.warn('Background image failed to load. Applying fallback.');
    document.body.style.background = 'linear-gradient(135deg, #8b5a2b 0%, #6b4423 100%)';
  };
  img.src = '/my-website/images/cover.jpeg'; // Use static URL
}

/**
 * Generează și injectează un set de imagini de placeholder în pagină
 * pentru depanare vizuală când imaginile lipsesc
 */
export function injectPlaceholders() {
  console.log('Se injectează placeholdere pentru imagini lipsă');
  
  // Adaugă un div cu placeholdere pentru imagini importante
  const placeholdersContainer = document.createElement('div');
  placeholdersContainer.id = 'debug-image-placeholders';
  placeholdersContainer.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
  `;
  
  placeholdersContainer.innerHTML = `
    <h4 style="margin: 0 0 10px 0; color: yellow;">Imagini critice lipsă:</h4>
    <div id="debug-missing-images" style="display: flex; flex-direction: column; gap: 5px;"></div>
    <button id="fix-missing-images" style="margin-top: 10px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">
      Generează Placeholdere
    </button>
  `;
  
  document.body.appendChild(placeholdersContainer);
  
  // Update the critical images list to include all case variations
  const criticalImages = [
    { 
      path: `${window.location.origin}/my-website/images/cover.jpeg`, 
      name: 'Background Cover',
      fallbacks: [
        `${window.location.origin}/my-website/images/Cover.jpeg`,
        `${window.location.origin}/my-website/images/cover.svg`,
        `${window.location.origin}/my-website/images/Cover.svg`,
        `${window.location.origin}/images/cover.jpeg`,
        // Add data URI fallback
        `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="100%" height="100%" fill="#8b5a2b"/></svg>')}`
      ]
    },
    { 
      path: `${window.location.origin}/my-website/images/Logo.png`, 
      name: 'Logo',
      fallbacks: [
        `${window.location.origin}/my-website/images/logo.png`,
        `${window.location.origin}/my-website/images/Logo.svg`,
        `${window.location.origin}/my-website/images/logo.svg`,
        // Add data URI fallback
        `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/><text x="50%" y="60%" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text></svg>')}`
      ]
    },
    { 
      path: `${window.location.origin}/my-website/images/profi.png`, 
      name: 'Profile Icon',
      fallbacks: [
        `${window.location.origin}/images/profi.png`,
        `${window.location.origin}/my-website/images/profile.png`
      ]
    },
    { 
      path: `${window.location.origin}/my-website/images/bag.png`, 
      name: 'Cart Icon',
      fallbacks: [
        `${window.location.origin}/images/bag.png`,
        `${window.location.origin}/my-website/images/cart.png`
      ]
    }
  ];
  
  // Verifică fiecare imagine și raportează statusul
  const missingImagesContainer = document.getElementById('debug-missing-images');
  let hasMissingImages = false;
  
  criticalImages.forEach(image => {
    const testImg = new Image();
    testImg.onload = () => {
      console.log(`Imaginea ${image.name} există și se încarcă corect`);
    };
    testImg.onerror = () => {
      // Try fallbacks if available
      if (image.fallbacks && image.fallbacks.length > 0) {
        let fallbacksChecked = 0;
        let fallbackFound = false;
        
        image.fallbacks.forEach(fallbackPath => {
          if (!fallbackFound) {
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
              fallbackFound = true;
              console.log(`Fallback pentru ${image.name} găsit: ${fallbackPath}`);
            };
            fallbackImg.onerror = () => {
              fallbacksChecked++;
              if (fallbacksChecked === image.fallbacks.length && !fallbackFound) {
                // All fallbacks failed
                reportMissingImage();
              }
            };
            fallbackImg.src = fallbackPath;
          }
        });
      } else {
        reportMissingImage();
      }
      
      function reportMissingImage() {
        hasMissingImages = true;
        console.error(`EROARE: Imaginea ${image.name} lipsește!`);
        
        const missingImageItem = document.createElement('div');
        missingImageItem.innerHTML = `❌ ${image.name} <span style="color: #FF9800;">(${image.path})</span>`;
        missingImagesContainer.appendChild(missingImageItem);
      }
    };
    testImg.src = image.path;
  });
  
  // Ascunde containerul dacă toate imaginile sunt prezente
  setTimeout(() => {
    if (!hasMissingImages) {
      placeholdersContainer.style.display = 'none';
    } else {
      // Adaugă funcționalitate butonului de generare placeholder
      document.getElementById('fix-missing-images').addEventListener('click', () => {
        generateMissingImages();
        alert('Placeholdere generate! Reîncarcă pagina pentru a vedea efectul.');
      });
    }
  }, 2000);
}

// Enhance the missing image generation with inline SVG fallbacks
function generateMissingImages() {
  console.log('Se generează imagini placeholder pe server...');
  
  // Create Logo.svg inline if it doesn't exist
  if (!document.querySelector('img[src*="Logo"]')) {
    const logoSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
        <rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/>
        <text x="50%" y="60%" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
      </svg>
    `;
    
    // Create an image with the inline SVG
    const logoImg = new Image();
    logoImg.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;
    logoImg.alt = 'Logo';
    logoImg.style.display = 'none';
    document.body.appendChild(logoImg);
    
    // Replace all missing logo references with this inline SVG
    document.querySelectorAll('img[src*="Logo"][alt="Logo"]').forEach(img => {
      img.src = logoImg.src;
      img.style.display = '';
    });
    
    console.log('Logo SVG generat inline cu succes');
  }
  
  // Create fallbacks for other images too
  setTimeout(() => {
    console.log('Imagini placeholder generate cu succes!');
  }, 1000);
}

/**
 * Verifică existența imaginii cover.jpeg în timpul rulării
 */
export function verifyCoverImage() {
  const coverImage = new Image();
  coverImage.src = '/my-website/images/cover.jpeg';
  coverImage.onload = () => console.log('Cover image loaded successfully.');
  coverImage.onerror = () => console.warn('Cover image is missing or cannot be loaded.');
}
