import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function fixCssUrls() {
  console.log('Fixing CSS URLs in all CSS files...');
  
  try {
    // Find all CSS files in src directory
    const cssFiles = await glob('src/**/*.css', { 
      cwd: rootDir,
      absolute: true 
    });
    
    console.log(`Found ${cssFiles.length} CSS files to process`);
    
    // Process each CSS file
    for (const filePath of cssFiles) {
      console.log(`Processing ${filePath}`);
      
      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Replace URLs with direct paths
      let newContent = content
        .replace(/url\(\s*var\(--cover-url\)\s*\)/g, "url('/my-website/images/cover.jpeg')")
        .replace(/url\(\s*var\(--background-url\)\s*\)/g, "url('/my-website/images/cover.jpeg')");
      
      // Replace any other URL vars you might have
      newContent = newContent
        .replace(/var\(--cover-url\)/g, "url('/my-website/images/cover.jpeg')")
        .replace(/var\(--background-url\)/g, "url('/my-website/images/cover.jpeg')");
      
      // Write the modified content back
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✓ Fixed URLs in ${path.basename(filePath)}`);
      } else {
        console.log(`✓ No changes needed in ${path.basename(filePath)}`);
      }
    }
    
    console.log('CSS URL fixing completed successfully!');
    
  } catch (error) {
    console.error('Error fixing CSS URLs:', error);
  }
}

// Run the function
fixCssUrls();
