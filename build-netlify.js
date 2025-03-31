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

  // Copy any required static files to public
  // This ensures all required assets are available
  console.log('Setting up required files...');

  // Running the actual build command
  console.log('Running build command...');
  if (isWindows) {
    // Windows-specific build process
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    // Linux-specific build for Netlify
    execSync('npx vite build', { stdio: 'inherit' });
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
  process.exit(1); // Exit with error to ensure we don't use placeholder
}
