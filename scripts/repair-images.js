/**
 * Image Repair Utility
 * 
 * This script will verify and fix any corrupted image files by:
 * 1. Checking if image files exist but are empty or corrupted
 * 2. Regenerating SVG files from templates
 * 3. Running the convert-images script to regenerate binary files
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'public', 'images');

console.log('🔧 Starting image repair utility...');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Created images directory');
}

// Define critical images
const criticalImages = [
  { 
    path: path.join(imagesDir, 'cover.svg'),
    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5a2b" />
      <stop offset="100%" stop-color="#6b4423" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGradient)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Lupul si Corbul</text>
  <text x="50%" y="58%" font-family="Arial" font-size="32" text-anchor="middle" fill="#fff8f0">Prajituri artizanale &amp; Suplimente naturale</text>
</svg>`
  },
  {
    path: path.join(imagesDir, 'Logo.svg'),
    content: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
  <rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/>
  <text x="50%" y="60%" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
</svg>`
  }
];

// Create or fix the SVG files
criticalImages.forEach(({ path: filePath, content }) => {
  const fileName = path.basename(filePath);
  
  // Check if file exists and is valid
  let needsRepair = true;
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (fileContent.includes('<svg') && fileContent.length > 100) {
        console.log(`✅ ${fileName} appears to be valid`);
        needsRepair = false;
      } else {
        console.log(`⚠️ ${fileName} exists but appears to be corrupted`);
      }
    } catch (error) {
      console.log(`⚠️ Error reading ${fileName}: ${error.message}`);
    }
  } else {
    console.log(`❌ ${fileName} does not exist`);
  }
  
  // Create or repair file if needed
  if (needsRepair) {
    try {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Successfully created/repaired ${fileName}`);
      
      // Create case variant
      const baseName = path.basename(filePath, path.extname(filePath));
      const ext = path.extname(filePath);
      const variantName = baseName === baseName.toLowerCase() ? 
        baseName.charAt(0).toUpperCase() + baseName.slice(1) : 
        baseName.toLowerCase();
      const variantPath = path.join(path.dirname(filePath), `${variantName}${ext}`);
      
      fs.writeFileSync(variantPath, content);
      console.log(`✅ Also created case variant: ${variantName}${ext}`);
    } catch (error) {
      console.error(`❌ Failed to create/repair ${fileName}: ${error.message}`);
    }
  }
});

// Run convert-images to create binary files from SVGs
console.log('\n🔄 Running convert-images script to generate binary files...');
try {
  execSync('npm run convert-images', { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('❌ Error running convert-images script:', error.message);
}

console.log('\n✅ Image repair process completed');
console.log('If you still have issues with images, try running:');
console.log('  npm run ensure-images');
console.log('  npm run dev');
