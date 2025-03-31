/**
 * SVG to Image Converter
 * This script helps convert SVG placeholder files to actual image files (PNG, JPEG)
 * Note: This requires the 'sharp' library for image processing
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(publicDir, 'images');

console.log('🖼️ SVG to Image Converter');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Created images directory');
}

// Install sharp if not installed
try {
  execSync('npm list sharp', { cwd: rootDir, stdio: 'pipe' });
  console.log('✅ Sharp library is already installed');
} catch (error) {
  console.log('⚠️ Sharp library not found, installing...');
  try {
    execSync('npm install sharp --save-dev', { 
      cwd: rootDir,
      stdio: 'inherit' 
    });
    console.log('✅ Sharp library installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Sharp library:', installError.message);
    console.log('Please manually install Sharp: npm install sharp --save-dev');
    process.exit(1);
  }
}

// Import sharp dynamically after ensuring it's installed
import('sharp').then(async ({ default: sharp }) => {
  // Create cover.jpeg from SVG - Fix SVG syntax
  const coverSvg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5a2b" />
        <stop offset="100%" stop-color="#6b4423" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGradient)"/>
    <text x="50%" y="50%" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Lupul si Corbul</text>
    <text x="50%" y="58%" font-family="Arial" font-size="32" text-anchor="middle" fill="#fff8f0">Prajituri artizanale &amp; Suplimente naturale</text>
  </svg>`;

  try {
    await sharp(Buffer.from(coverSvg))
      .jpeg({ quality: 90 })
      .toFile(path.join(imagesDir, 'cover.jpeg'));
    console.log('✅ Created cover.jpeg');
  } catch (error) {
    console.error('❌ Failed to create cover.jpeg:', error.message);
    // Create a fallback by saving the SVG directly
    fs.writeFileSync(
      path.join(imagesDir, 'cover.svg'), 
      coverSvg,
      'utf8'
    );
    console.log('✅ Created cover.svg as fallback');
  }

  // Create Logo.png from SVG
  const logoSvg = `<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/>
    <text x="50%" y="60%" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
  </svg>`;

  try {
    await sharp(Buffer.from(logoSvg))
      .png()
      .toFile(path.join(imagesDir, 'Logo.png'));
    console.log('✅ Created Logo.png');
  } catch (error) {
    console.error('❌ Failed to create Logo.png:', error.message);
    // Create a fallback by saving the SVG directly
    fs.writeFileSync(
      path.join(imagesDir, 'Logo.svg'), 
      logoSvg,
      'utf8'
    );
    console.log('✅ Created Logo.svg as fallback');
  }

  console.log('\n🎉 Image conversion completed!');
}).catch(error => {
  console.error('❌ Error importing Sharp library:', error.message);
  console.log('Creating SVG files instead of optimized images');
  
  // Create SVG files directly if Sharp fails - Fix SVG syntax
  const coverSvg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5a2b" />
        <stop offset="100%" stop-color="#6b4423" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGradient)"/>
    <text x="50%" y="50%" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Lupul si Corbul</text>
    <text x="50%" y="58%" font-family="Arial" font-size="32" text-anchor="middle" fill="#fff8f0">Prajituri artizanale &amp; Suplimente naturale</text>
  </svg>`;
  
  const logoSvg = `<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/>
    <text x="50%" y="60%" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
  </svg>`;
  
  fs.writeFileSync(path.join(imagesDir, 'cover.svg'), coverSvg, 'utf8');
  fs.writeFileSync(path.join(imagesDir, 'Logo.svg'), logoSvg, 'utf8');
  
  console.log('✅ Created cover.svg and Logo.svg directly');
});
