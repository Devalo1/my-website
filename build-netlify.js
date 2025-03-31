/**
 * Custom build script for Netlify deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables for Sharp to prevent compilation issues
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = 'true';
process.env.DISABLE_SHARP_INSTALLATION = 'true';

// Detect platform for platform-specific handling
const isWindows = process.platform === 'win32';

console.log('Starting Netlify build process...');
console.log(`Running on platform: ${process.platform}`);

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Install dependencies with platform-specific flags
  if (!isWindows) {
    console.log('Installing dependencies with Linux-specific settings...');
    execSync('npm ci --no-optional --ignore-scripts', { stdio: 'inherit' });
  }

  // Run the build command
  console.log('Running build command...');
  execSync('npm run build', { stdio: 'inherit' });

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
