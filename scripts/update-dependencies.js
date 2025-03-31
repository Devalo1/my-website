/**
 * Dependency Updater - Helper script to update packages to compatible versions
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Starting dependency update process...');

// Packages to update with specific versions
const packagesToUpdate = {
  // Dependencies
  'react-router-dom': '^6.3.0',  // Stable version without future flags
  
  // DevDependencies
  'glob': '^10.3.10',  // Latest version without deprecation
  'rimraf': '^5.0.5',  // Latest version without deprecation
  '@humanwhocodes/config-array': '@latest'
};

// Read package.json
const packageJsonPath = path.join(rootDir, 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ Read package.json successfully');
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Update versions in package.json
console.log('\n📦 Updating package versions in package.json:');
let updates = 0;

for (const [pkg, version] of Object.entries(packagesToUpdate)) {
  if (packageJson.dependencies && pkg in packageJson.dependencies) {
    console.log(`Updating dependency: ${pkg} -> ${version}`);
    packageJson.dependencies[pkg] = version;
    updates++;
  } else if (packageJson.devDependencies && pkg in packageJson.devDependencies) {
    console.log(`Updating devDependency: ${pkg} -> ${version}`);
    packageJson.devDependencies[pkg] = version;
    updates++;
  }
}

// Write updated package.json
if (updates > 0) {
  try {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated ${updates} package versions in package.json`);
  } catch (error) {
    console.error('❌ Error writing package.json:', error.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️ No packages needed updates');
}

// Install the updated dependencies
console.log('\n🔄 Running npm install to apply changes...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Dependencies updated successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n✅ Dependency update completed');
