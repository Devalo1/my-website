import React from 'react'; // Adăugăm importul pentru React

/**
 * Diagnostic utility to help troubleshoot routing and component loading issues
 */

export function runDiagnostics() {
  console.log('=============================================');
  console.log('RUNNING APPLICATION DIAGNOSTICS');
  console.log('=============================================');
  
  // Check environment
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Base URL:', import.meta.env.BASE_URL);
  
  // Check routes configuration
  if (window.location.pathname.includes('/my-website')) {
    console.log('Current path includes /my-website - this is expected');
  } else {
    console.warn('Current path does not include /my-website - this may cause routing issues');
  }
  
  // Check for React and ReactDOM
  console.log('React version:', React?.version || 'Not found');
  
  // Check for common modules
  const modules = [
    { name: 'React Router', check: () => typeof Route !== 'undefined' },
    { name: 'Firebase', check: () => typeof window.firebase !== 'undefined' }
  ];
  
  modules.forEach(module => {
    try {
      const isAvailable = module.check();
      console.log(`Module ${module.name}: ${isAvailable ? 'Available' : 'Not available'}`);
    } catch (e) {
      console.log(`Module ${module.name}: Error checking - ${e.message}`);
    }
  });
  
  console.log('=============================================');
  console.log('END DIAGNOSTICS');
  console.log('=============================================');
}

// Auto-run diagnostics
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runDiagnostics);
} else {
  runDiagnostics();
}

runDiagnostics();
