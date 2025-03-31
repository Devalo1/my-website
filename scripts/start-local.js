/**
 * Start Local Development Server with improved error handling
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting development server with enhanced checks...');

// Check if the required configuration files exist
function checkRequiredFiles() {
  console.log('\n📋 Checking required files...');
  
  const requiredFiles = [
    'vite.config.ts',
    'package.json',
    'src/main.tsx',
    'index.html'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found ${file}`);
    } else {
      console.log(`❌ Missing ${file}`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// Free up used ports
function freeUpPorts() {
  console.log('\n🔌 Checking for ports in use...');
  try {
    // Run the free-ports script
    execSync('node scripts/free-ports.js', { 
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log('✅ Ports checked and freed if necessary');
    return true;
  } catch (error) {
    console.error('❌ Error freeing ports:', error.message);
    return false;
  }
}

// Start the development server
function startDevServer() {
  console.log('\n🚀 Starting development server...');
  console.log('Local URL will be: http://localhost:3000/my-website/');
  
  try {
    // Run the Vite dev server
    execSync('npm run dev', {
      cwd: rootDir,
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    console.error('❌ Error starting development server:', error.message);
    return false;
  }
}

// Main execution
(async function() {
  // Check required files
  if (!checkRequiredFiles()) {
    console.error('\n❌ Missing required files. Please fix these issues before continuing.');
    process.exit(1);
  }
  
  // Free up ports
  if (!freeUpPorts()) {
    if (confirm('Continue anyway? [y/N] ').toLowerCase() !== 'y') {
      process.exit(1);
    }
  }
  
  // Start dev server
  if (!startDevServer()) {
    console.error('\n❌ Failed to start development server.');
    process.exit(1);
  }
})();

/**
 * Simple confirm function for CLI
 */
function confirm(question) {
  process.stdout.write(question);
  const response = process.stdin.read();
  return response ? response.toString().trim() : '';
}
