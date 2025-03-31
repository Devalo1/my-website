/**
 * Missing Files Checker - Detects and optionally creates missing referenced files
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob'; // Updated import for glob v10+

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Checking for missing referenced files...');

// Find all JS/TS/JSX/TSX files - Updated glob syntax for v10+
const sourceFiles = await glob(`${rootDir}/src/**/*.{js,jsx,ts,tsx}`);
const requiredFiles = new Set();

// Regular expressions to match imports
const cssImportRegex = /import\s+['"](.+\.css)['"];?/g;
const imageImportRegex = /import\s+.+\s+from\s+['"](.+\.(jpg|jpeg|png|svg|gif))(\?.*)?['"];?/g;

// Scan files for imports
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find CSS imports
  let match;
  while ((match = cssImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    const fullPath = path.resolve(path.dirname(file), importPath);
    requiredFiles.add({ file, importPath, fullPath, type: 'css' });
  }
  
  // Find image imports
  while ((match = imageImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    const fullPath = path.resolve(path.dirname(file), importPath);
    requiredFiles.add({ file, importPath, fullPath, type: 'image' });
  }
}

console.log(`Found ${requiredFiles.size} imported files to check`);

// Check if files exist
const missingFiles = Array.from(requiredFiles).filter(({ fullPath }) => !fs.existsSync(fullPath));

if (missingFiles.length === 0) {
  console.log('✅ All imported files exist!');
} else {
  console.log(`❌ Found ${missingFiles.length} missing files:`);
  
  missingFiles.forEach(({ file, importPath, fullPath, type }) => {
    console.log(`Missing ${type} file: ${importPath} (imported in ${file})`);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created directory: ${dir}`);
    }
    
    // Create placeholder file based on type
    if (type === 'css') {
      fs.writeFileSync(fullPath, `/* Generated placeholder for ${path.basename(fullPath)} */\n\n/* Add your styles here */\n`);
      console.log(`  Created placeholder CSS file: ${fullPath}`);
    } else if (type === 'image') {
      // Create a text file with instructions for images
      fs.writeFileSync(`${fullPath}.placeholder`, `This is a placeholder for the missing image: ${path.basename(fullPath)}\nPlease provide an actual image file.`);
      console.log(`  Created placeholder note for image: ${fullPath}.placeholder`);
    }
  });
}

console.log('\n✅ Check completed');
