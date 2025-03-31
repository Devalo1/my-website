/**
 * Custom build script for Netlify deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variable to skip installation of optional dependencies
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = 'true';

console.log('Starting Netlify build process...');

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
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
