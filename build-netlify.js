/**
 * Custom build script for Netlify deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set environment variables for Sharp to prevent compilation issues
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = 'true';
process.env.DISABLE_SHARP_INSTALLATION = 'true';

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

  // Run platform-specific commands
  if (isWindows) {
    // Windows-specific build commands
    console.log('Running Windows-specific build...');
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    // Linux-specific build commands for Netlify
    console.log('Running Linux-specific build for Netlify...');
    
    // First ensure all needed files exist
    console.log('Creating any required directories...');
    if (!fs.existsSync('public/images')) {
      fs.mkdirSync('public/images', { recursive: true });
    }
    
    // Run the standard build command without any Windows-specific dependencies
    console.log('Running build command...');
    execSync('NODE_ENV=production vite build', { stdio: 'inherit' });
  }

  // Ensure netlify.toml is in the dist folder
  console.log('Copying netlify.toml to dist folder...');
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join('dist', 'netlify.toml'));
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
