/**
 * Resource Checker - Ensures critical assets exist and are loadable
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Starting website resource check...');

// Check critical image files
const criticalImages = [
  'public/images/cover.jpeg',
  'public/images/Logo.png',
  'public/images/profi.png',
  'public/images/bag.png'
];

console.log('\n📷 Checking critical images:');
criticalImages.forEach(imagePath => {
  const fullPath = path.join(rootDir, imagePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${imagePath} exists (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`❌ ${imagePath} is MISSING`);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   Created directory: ${dir}`);
    }
    
    // Create a placeholder image if it doesn't exist
    if (imagePath.includes('cover.jpeg')) {
      createPlaceholderImage(fullPath, 1920, 1080);
      console.log(`   Created placeholder for cover.jpeg`);
    } else if (imagePath.includes('Logo.png')) {
      createPlaceholderImage(fullPath, 200, 100, 'Logo');
      console.log(`   Created placeholder for Logo.png`);
    } else if (imagePath.includes('profi.png')) {
      createPlaceholderImage(fullPath, 50, 50, 'User');
      console.log(`   Created placeholder for profi.png`);
    } else if (imagePath.includes('bag.png')) {
      createPlaceholderImage(fullPath, 50, 50, 'Cart');
      console.log(`   Created placeholder for bag.png`);
    }
  }
});

// Check key JavaScript files
const criticalScripts = [
  'src/components/auth.js',
  'src/components/responsive.js',
  'src/components/ultra-fix.js',
  'src/services/firebase-config.js'
];

console.log('\n📜 Checking critical scripts:');
criticalScripts.forEach(scriptPath => {
  const fullPath = path.join(rootDir, scriptPath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${scriptPath} exists`);
  } else {
    console.log(`❌ ${scriptPath} is MISSING`);
  }
});

// Check critical CSS files
const criticalStyles = [
  'src/styles/styles.css',
  'src/styles/global.css',
  'src/index.css',
  'src/App.css'
];

console.log('\n🎨 Checking critical CSS files:');
criticalStyles.forEach(stylePath => {
  const fullPath = path.join(rootDir, stylePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${stylePath} exists`);
  } else {
    console.log(`❌ ${stylePath} is MISSING`);
  }
});

// Check React components
const criticalComponents = [
  'src/App.tsx',
  'src/main.tsx',
  'src/pages/Acasa.tsx',
  'src/pages/LupulSiCorbul.tsx',
  'src/pages/Consiliere.tsx',
  'src/pages/TerapiaPersonalizata.tsx',
  'src/pages/Contact.tsx'
];

console.log('\n🧩 Checking React components:');
criticalComponents.forEach(componentPath => {
  const fullPath = path.join(rootDir, componentPath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${componentPath} exists`);
  } else {
    console.log(`❌ ${componentPath} is MISSING`);
  }
});

// Create a placeholder image
function createPlaceholderImage(filePath, width, height, text = null) {
  // We can only create a text file placeholder with instructions
  const placeholderContent = `PLACEHOLDER FOR: ${path.basename(filePath)}
This is a placeholder file. Please replace with an actual image file.
Recommended dimensions: ${width}x${height} pixels
${text ? `Suggested content: ${text}` : ''}

You can create a simple image at: https://placeholder.com/
Example URL: https://via.placeholder.com/${width}x${height}.png?text=${text || 'Image'}
`;

  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write placeholder file
  const placeholderFilePath = filePath + '.placeholder';
  fs.writeFileSync(placeholderFilePath, placeholderContent);
}

console.log('\n✅ Resource check completed');
console.log('Please ensure all missing resources are added before running the app');
