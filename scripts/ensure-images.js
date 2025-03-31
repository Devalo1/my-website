/**
 * Ensure Images Utility
 * 
 * This script copies image files to ensure both lowercase and uppercase
 * variants exist to avoid case-sensitivity issues across different systems
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'public', 'images');

console.log('🔍 Ensuring all image variants exist (case-sensitivity check)...');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Created images directory');
}

// List of images to check and ensure both cases exist
const imagesToCheck = [
  // Format: [filename, extension]
  ['Logo', 'svg'],
  ['Logo', 'png'],
  ['cover', 'jpeg'],
  ['cover', 'svg'],
  ['profi', 'png'],
  ['bag', 'png']
];

// Additional check to verify file size is non-zero
function isValidFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > 0;
  } catch (error) {
    return false;
  }
}

// Process each image
imagesToCheck.forEach(([name, ext]) => {
  const lowercase = name.toLowerCase();
  const uppercase = name.charAt(0).toUpperCase() + name.slice(1);
  
  const lowercasePath = path.join(imagesDir, `${lowercase}.${ext}`);
  const uppercasePath = path.join(imagesDir, `${uppercase}.${ext}`);
  
  // Check if either variant exists and is valid
  const lowercaseExists = fs.existsSync(lowercasePath) && isValidFile(lowercasePath);
  const uppercaseExists = fs.existsSync(uppercasePath) && isValidFile(uppercasePath);
  
  if (lowercaseExists && !uppercaseExists) {
    // Copy lowercase to uppercase
    fs.copyFileSync(lowercasePath, uppercasePath);
    console.log(`✅ Copied ${lowercase}.${ext} to ${uppercase}.${ext}`);
  } else if (uppercaseExists && !lowercaseExists) {
    // Copy uppercase to lowercase
    fs.copyFileSync(uppercasePath, lowercasePath);
    console.log(`✅ Copied ${uppercase}.${ext} to ${lowercase}.${ext}`);
  } else if (!lowercaseExists && !uppercaseExists) {
    // Neither exists or is valid, create a placeholder
    console.log(`⚠️ Valid files for ${lowercase}.${ext} and ${uppercase}.${ext} not found`);
    
    // Create placeholder based on file type
    if (ext === 'svg') {
      const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle">Placeholder ${name}</text>
      </svg>`;
      fs.writeFileSync(lowercasePath, placeholderSvg);
      fs.writeFileSync(uppercasePath, placeholderSvg);
      console.log(`  Created placeholder SVG for both variants`);
    } else if (ext === 'jpeg' || ext === 'jpg' || ext === 'png') {
      // For binary files, we can only create placeholder notes
      console.log(`  Binary file types need to be created with the convert-images script`);
      console.log(`  Run: npm run convert-images`);
    } else {
      // Create placeholder text for other formats
      const placeholderText = `Placeholder for ${name}.${ext}. This should be replaced with an actual image.`;
      fs.writeFileSync(`${lowercasePath}.placeholder`, placeholderText);
      fs.writeFileSync(`${uppercasePath}.placeholder`, placeholderText);
      console.log(`  Created placeholder notes for both variants`);
    }
  } else {
    // Both exist and are valid
    console.log(`✓ Both ${lowercase}.${ext} and ${uppercase}.${ext} already exist`);
  }
});

console.log('\n✅ All image variants have been checked and ensured!');
console.log('If you see 404 errors in the console, run:');
console.log('  npm run convert-images');
console.log('to regenerate any corrupted image files.');
