import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to look for in files
const patterns = [
  /firebase\.initializeApp/,
  /import\s+.*firebase/,
  /require\(['"]firebase['"]/,
  /apiKey:/,
  /authDomain:/,
  /projectId:/,
  /FIREBASE_API_KEY/,
  /FIREBASE_AUTH_DOMAIN/
];

// File extensions to check
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html'];

function searchDirectory(dir) {
  console.log(`Searching in directory: ${dir}`);
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('node_modules') && !file.startsWith('.git')) {
        // Recursively search subdirectories
        searchDirectory(filePath);
      } else if (stat.isFile() && extensions.includes(path.extname(file).toLowerCase())) {
        // Check if file content matches any pattern
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            console.log(`Found potential Firebase configuration in: ${filePath}`);
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dir}:`, error.message);
  }
}

// Start searching from the root of your project
const rootDir = path.resolve('.');
console.log('=== Searching for Firebase Configuration Files ===');
console.log(`Starting search from: ${rootDir}`);
searchDirectory(rootDir);
