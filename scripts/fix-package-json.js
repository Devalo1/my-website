/**
 * Package.json Fixer Utility
 * This script validates and repairs the package.json file if it has become corrupted
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

console.log('🔧 Starting package.json repair utility...');

// Default package.json content as a fallback
const defaultPackageJson = {
  "name": "my-website",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --base=/my-website/",
    "check-files": "node scripts/check-missing-files.js",
    "check-resources": "node scripts/resource-checker.js",
    "free-ports": "node scripts/free-ports.js",
    "start-clean": "node scripts/run-dev.js",
    "build": "vite build --base=/my-website/",
    "lint": "eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "start": "node scripts/run-dev.js",
    "build-netlify": "vite build",
    "debug": "vite --debug --base=/my-website/",
    "fix-package": "node scripts/fix-package-json.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "glob": "^10.3.10",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
};

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.log('⚠️ package.json does not exist, creating new one...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(defaultPackageJson, null, 2));
  console.log('✅ Created new package.json file');
} else {
  // Try to read and parse the existing package.json
  try {
    console.log('Attempting to read existing package.json...');
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    
    // Validate JSON format
    try {
      const packageJson = JSON.parse(content);
      console.log('✅ package.json is valid JSON');
      
      // Check for essential properties
      let isModified = false;
      
      if (!packageJson.scripts) {
        console.log('⚠️ Missing scripts section, restoring default scripts...');
        packageJson.scripts = defaultPackageJson.scripts;
        isModified = true;
      }
      
      if (!packageJson.dependencies) {
        console.log('⚠️ Missing dependencies section, restoring default dependencies...');
        packageJson.dependencies = defaultPackageJson.dependencies;
        isModified = true;
      }
      
      if (!packageJson.devDependencies) {
        console.log('⚠️ Missing devDependencies section, restoring default devDependencies...');
        packageJson.devDependencies = defaultPackageJson.devDependencies;
        isModified = true;
      }
      
      // Save changes if needed
      if (isModified) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Updated package.json with missing sections');
      } else {
        console.log('✅ package.json is valid and complete');
      }
      
    } catch (jsonError) {
      console.error('❌ package.json contains invalid JSON: ', jsonError.message);
      console.log('Creating backup of corrupted file...');
      
      // Backup the corrupted file
      const backupPath = `${packageJsonPath}.backup-${Date.now()}`;
      fs.writeFileSync(backupPath, content);
      console.log(`✅ Backup created at: ${backupPath}`);
      
      // Write new package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(defaultPackageJson, null, 2));
      console.log('✅ Created new package.json file with default values');
    }
  } catch (readError) {
    console.error('❌ Error reading package.json: ', readError.message);
    console.log('Creating default package.json file...');
    fs.writeFileSync(packageJsonPath, JSON.stringify(defaultPackageJson, null, 2));
    console.log('✅ Created new package.json file with default values');
  }
}

console.log('\n✅ Package.json repair completed!');
console.log('You should now be able to run npm commands successfully');
