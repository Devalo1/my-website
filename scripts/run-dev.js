/**
 * Enhanced Dev Server Launcher
 * This script ensures proper port cleanup and resource verification
 * before starting the development server
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Enhanced development server starter...');

// Check and create critical directories
const criticalDirs = [
  'public/images',
  'src/assets',
  'src/components',
  'src/styles',
  'src/pages',
  'src/utils'
];

console.log('\n📁 Checking critical directories...');
criticalDirs.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Run the resource checker
console.log('\n🔍 Checking resources...');
try {
  execSync('node scripts/resource-checker.js', { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('Error checking resources:', error.message);
}

// Free up ports
console.log('\n🔌 Freeing up ports...');
try {
  execSync('node scripts/free-ports.js', { 
    cwd: rootDir,
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('Error freeing ports:', error.message);
}

// Start the dev server without echoing the command
console.log('\n🌐 Starting development server...');
try {
  // Use an option to hide the command itself
  execSync('npx vite --base=/my-website/', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' } // Ensure colored output
  });
} catch (error) {
}
