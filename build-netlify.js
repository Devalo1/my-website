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
  // Create placeholder images directory
  console.log('Creating placeholder images...');
  const imagesDir = path.join('dist', 'images');
  fs.mkdirSync(imagesDir, { recursive: true });
  
  // Create SVG placeholder images (no Sharp needed)
  const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <rect width="100%" height="100%" fill="#8b5a2b"/>
    <text x="50%" y="50%" font-family="Arial" font-size="72" text-anchor="middle" fill="white">Lupul si Corbul</text>
  </svg>`;
  
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
    <rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/>
    <text x="50%" y="60%" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
  </svg>`;
  
  // Write all necessary image files (as SVG)
  fs.writeFileSync(path.join(imagesDir, 'cover.svg'), coverSvg);
  fs.writeFileSync(path.join(imagesDir, 'cover.jpeg'), coverSvg); // Using SVG content with .jpeg extension
  fs.writeFileSync(path.join(imagesDir, 'Logo.svg'), logoSvg);
  fs.writeFileSync(path.join(imagesDir, 'Logo.png'), logoSvg); // Using SVG content with .png extension
  
  // Copy image files from public directory if they exist
  const publicImagesDir = path.join('public', 'images');
  if (fs.existsSync(publicImagesDir)) {
    console.log('Copying public images...');
    try {
      const files = fs.readdirSync(publicImagesDir);
      for (const file of files) {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.svg')) {
          const sourcePath = path.join(publicImagesDir, file);
          const destPath = path.join(imagesDir, file);
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${file}`);
        }
      }
    } catch (err) {
      console.warn('Warning copying images:', err);
    }
  }
  
  // Run Vite build without using Sharp
  console.log('Building site with Vite...');
  execSync('SHARP_IGNORE_GLOBAL_LIBVIPS=1 DISABLE_SHARP=true vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SHARP_IGNORE_GLOBAL_LIBVIPS: "1",
      DISABLE_SHARP: "true"
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
