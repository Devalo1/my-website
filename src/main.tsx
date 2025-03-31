import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import router fix BEFORE importing routes to suppress warnings early
import './fix-router.js';

// Import path fixer early to fix duplicate paths
import { fixAllPaths } from './utils/pathFixer.js';

// Fix duplicate paths immediately
fixAllPaths();

// Import styles in the correct order
import './styles/reset.css'; // Reset CSS should come first
import './index.css';
import './styles/global.css';
import './styles/styles.css';
import './styles/main.css';
import './styles/css-reset.css'; // Import the CSS reset file

// Import utility for checking resources
import { verifyBackgroundImage, injectPlaceholders, verifyCoverImage } from './utils/assetChecker';
import { injectCriticalStyles } from './utils/cssInjector'; // Import critical styles injector

// Import the consolidated background fix utility
import { applyBackgroundFixes } from './utils/backgroundFix';

// Import diagnostics utility
import './utils/diagnostics';

// Add this near the top of the file after imports
if (process.env.NODE_ENV === 'development') {
  // Suppress React DevTools warning in development
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
      return; // Suppress this specific warning
    }
    originalConsoleWarn(...args);
  };
}

// Apply styles immediately
injectCriticalStyles();

// Apply all background fixes at startup
applyBackgroundFixes();

// Add event listener to ensure styles are applied after DOM load
document.addEventListener('DOMContentLoaded', () => {
  injectCriticalStyles();
});

// Suppress React Router warnings by setting globals to disable them
// TypeScript now knows about these properties due to our global.d.ts file
window.__reactRouterReactVersion = React.version;
window.__reactRouterIsSuppressed = true;
window.__reactRouterIsSilent = true;
window.__reactRouterDisableWarnings = true;

// Load global scripts with error handling
const loadGlobalScripts = () => {
  // Create a safe script loader with proper types
  const loadScript = (src: string, callback: () => void, errorCallback: (event: string | Event) => void) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = errorCallback; // Adjusted type
    document.head.appendChild(script);
  };

  // Check if Firebase is already loaded
  if (window.firebase) {
    console.log('Firebase already loaded, using existing instance');
    loadSecondaryScripts();
  } else {
    // Load Firebase App first with retry mechanism
    const loadFirebase = (retryCount = 0) => {
      loadScript(
        'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
        () => {
          console.log('Firebase App loaded successfully');

          // Then load Firebase Auth
          loadScript(
            'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js',
            () => {
              console.log('Firebase Auth loaded successfully');

              // Load Firestore to avoid the mock
              loadScript(
                'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js',
                () => {
                  console.log('Firebase Firestore loaded successfully');
                  loadSecondaryScripts();
                },
                (err) => {
                  console.error('Failed to load Firebase Firestore:', err);
                  loadSecondaryScripts(); // Continue anyway
                }
              );
            },
            (err) => {
              console.error('Failed to load Firebase Auth:', err);
              loadSecondaryScripts(); // Continue anyway
            }
          );
        },
        (err) => {
          console.error('Failed to load Firebase App:', err);
          if (retryCount < 2) {
            console.log(`Retrying Firebase load (attempt ${retryCount + 1})...`);
            setTimeout(() => loadFirebase(retryCount + 1), 1000);
          } else {
            loadSecondaryScripts(); // Continue anyway after retries
          }
        }
      );
    };

    loadFirebase();
  }

  // Load our custom scripts
  function loadSecondaryScripts() {
    // First verify and fix background image
    verifyBackgroundImage();

    // Create a debug tool for missing resources
    if (process.env.NODE_ENV !== 'production') {
      setTimeout(injectPlaceholders, 2000);
    }

    // Load custom scripts with dynamic imports
    // Load Firebase config first
    import('./services/firebase-config')
      .then(() => {
        console.log('Firebase config loaded successfully');
        return import('./components/auth');
      })
      .then(() => {
        console.log('Auth script loaded successfully');
        return import('./components/responsive');
      })
      .then(() => {
        console.log('Responsive script loaded successfully');
        return import('./components/ultra-fix');
      })
      .then(() => {
        console.log('Ultra-fix compatibility script loaded successfully');
      })
      .catch((err) => {
        console.error('Error loading scripts:', err);
      });
  }
};

// Execute script loading
loadGlobalScripts();

// Verify the cover image during app initialization
verifyCoverImage();

// Determine the base URL from Vite environment or default to '/my-website/'
const BASE_URL = import.meta.env.BASE_URL || '/my-website/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
