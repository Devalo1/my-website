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
    
    // Run the standard build command with npx to ensure vite is available
    console.log('Running build command with npx...');
    execSync('NODE_ENV=production npx vite build', { stdio: 'inherit' });
  }

  // Ensure netlify.toml is in the dist folder
  console.log('Copying netlify.toml to dist folder...');
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join('dist', 'netlify.toml'));
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  
  // Create a fallback index.html if build fails
  console.log('Creating fallback index.html...');
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupul și Corbul</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      background-color: #fff8f0; 
      text-align: center; 
      padding: 50px; 
    }
    .card {
      background-color: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: 0 auto;
    }
    h1 { color: #6b4423; }
    .message { margin: 20px 0; }
    .link {
      display: inline-block;
      margin-top: 20px;
      background-color: #8b5a2b;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Lupul și Corbul</h1>
    <div class="message">
      <p>Site-ul este în construcție și va fi disponibil în curând.</p>
      <p>Vă mulțumim pentru răbdare!</p>
    </div>
    <a class="link" href="https://github.com/Devalo1/my-website">Vezi proiectul pe GitHub</a>
  </div>
</body>
</html>
  `;
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  fs.writeFileSync('dist/index.html', fallbackHtml);
  
  // Don't exit with error code so Netlify will still deploy the fallback page
  console.log('Fallback page created. Continuing deployment.');
}
