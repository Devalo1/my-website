import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('🚀 Starting Netlify build process...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
  console.log('Created dist directory');
}

try {
  // Create placeholder instead of using Sharp
  console.log('Creating placeholder images...');
  const imagesDir = path.join('dist', 'images');
  fs.mkdirSync(imagesDir, { recursive: true });
  
  // Create SVG placeholder images (no Sharp needed)
  const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <rect width="100%" height="100%" fill="#8b5a2b"/>
    <text x="50%" y="50%" font-family="Arial" font-size="72" text-anchor="middle" fill="white">Lupul si Corbul</text>
  </svg>`;
  
  fs.writeFileSync(path.join(imagesDir, 'cover.svg'), coverSvg);
  fs.writeFileSync(path.join(imagesDir, 'cover.jpeg'), coverSvg); // Using SVG content with .jpeg extension
  
  // Run Vite build without using Sharp
  console.log('Building site with Vite...');
  execSync('vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
