/**
 * Custom build script for Netlify deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect platform for platform-specific handling
const isWindows = process.platform === 'win32';

console.log('Starting Netlify build process...');
console.log(`Running on platform: ${process.platform}`);

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Ensure public directory exists for images/assets
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }

  // Setup build environment - critical for proper module resolution
  console.log('Setting up build environment...');
  
  // Make sure vite is available in node_modules - don't specify version
  console.log('Installing required packages...');
  execSync('npm install vite @vitejs/plugin-react --no-save', { stdio: 'inherit' });
  
  // Create a simplified vite.config.js file just for the build
  console.log('Creating simplified build config...');
  const tempConfig = `
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import path from 'path';
    
    export default defineConfig({
      plugins: [react()],
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: true
      },
      base: '/',
    });
  `;
  
  fs.writeFileSync('vite.config.js', tempConfig);

  // Running the actual build command with the temp config
  console.log('Running build command...');
  if (isWindows) {
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    // Important fix: Use npx without --no-install to let it find the local vite
    // Remove version specification that doesn't exist (vite@6.2.3)
    console.log('Using npx to find local vite installation...');
    execSync('npx vite build --config vite.config.js', { stdio: 'inherit' });
  }

  // Copy netlify.toml to dist folder to ensure redirects work
  console.log('Copying netlify.toml to dist folder...');
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join('dist', 'netlify.toml'));
  }

  // Create a _redirects file for Netlify SPA routing
  console.log('Creating _redirects file for SPA routing...');
  fs.writeFileSync('dist/_redirects', '/* /index.html 200');

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  console.error('Creating fallback page...');
  
  // Create a simple fallback page
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupul și Corbul</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; }
    .message { max-width: 500px; margin: 0 auto; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    h1 { color: #6b4423; }
  </style>
</head>
<body>
  <div class="message">
    <h1>Lupul și Corbul</h1>
    <p>Site-ul este în curs de actualizare și va fi disponibil în curând.</p>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync('dist/index.html', fallbackHtml);
  
  // Still exit with error so Netlify knows the build had an issue
  process.exit(1);
}
