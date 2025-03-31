import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

console.log('Verifying build output...');

// List of critical files to check
const criticalFiles = [
  'index.html',
  'images/cover.jpeg',    // Primary background image
  'images/cover.svg',     // SVG fallback (may not exist if JPEG exists)
  'assets/index-*.css',   // Main CSS file (wildcard for hash)
  'assets/index-*.js',    // Main JS file (wildcard for hash)
];

const isSuccessful = criticalFiles.every(file => {
  // Handle wildcard filenames
  if (file.includes('*')) {
    const [dir, pattern] = file.split('/');
    const basePattern = pattern.split('*')[0];
    const files = fs.readdirSync(path.join(distDir, dir));
    const found = files.some(f => f.startsWith(basePattern));
    
    if (!found) {
      console.error(`❌ No matching file found for pattern: ${file}`);
      return false;
    }
    
    console.log(`✅ Found matching file for: ${file}`);
    return true;
  }
  
  // Special case for SVG fallback - only required if JPEG doesn't exist
  if (file === 'images/cover.svg') {
    const jpegExists = fs.existsSync(path.join(distDir, 'images/cover.jpeg'));
    if (jpegExists) {
      console.log(`ℹ️ SVG fallback not required (JPEG exists)`);
      return true;
    }
  }
  
  // Regular file check
  const exists = fs.existsSync(path.join(distDir, file));
  if (!exists) {
    console.error(`❌ Missing critical file: ${file}`);
    return false;
  }
  
  console.log(`✅ Found critical file: ${file}`);
  return true;
});

// Check CSS file content for background image URL
const cssFiles = fs.readdirSync(path.join(distDir, 'assets'))
  .filter(file => file.endsWith('.css'));

if (cssFiles.length > 0) {
  const cssContent = fs.readFileSync(path.join(distDir, 'assets', cssFiles[0]), 'utf8');
  if (cssContent.includes('/my-website/images/cover.jpeg')) {
    console.log('✅ CSS contains direct background image URL');
  } else {
    console.warn('⚠️ CSS might not contain direct background image URL');
  }
}

// Check HTML file for inline background styles
const htmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
if (htmlContent.includes('background-image: url')) {
  console.log('✅ HTML contains inline background styles');
} else {
  console.warn('⚠️ HTML does not contain inline background styles');
}

if (isSuccessful) {
  console.log('\n✅ Build verification successful!');
  console.log('Your app is ready to be deployed.');
} else {
  console.error('\n❌ Build verification failed!');
  console.error('Some critical files are missing - please check the errors above.');
  process.exit(1);
}
