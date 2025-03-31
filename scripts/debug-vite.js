/**
 * Debug Vite - Script for troubleshooting development environment issues
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Starting Vite development troubleshooting...');

// 1. Check if npm command is running correctly
console.log('\n📦 Checking npm installation:');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm is installed (${npmVersion.trim()})`);
} catch (error) {
  console.error('❌ Error checking npm version:', error.message);
  console.log('⚠️ Make sure npm is installed and in your PATH');
}

// 2. Check package.json and scripts section
console.log('\n📄 Checking package.json configuration:');
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    console.log('✅ package.json exists');
    
    // Check scripts section
    if (packageJson.scripts) {
      console.log('Scripts defined in package.json:');
      Object.entries(packageJson.scripts).forEach(([name, script]) => {
        console.log(`   - ${name}: ${script}`);
      });
      
      if (packageJson.scripts.dev) {
        console.log('✅ "dev" script is defined');
      } else {
        console.log('❌ "dev" script is not defined!');
        console.log('⚠️ Add a "dev" script to package.json: "vite --base=/my-website/"');
      }
    } else {
      console.log('❌ No scripts section found in package.json!');
    }
  } else {
    console.log('❌ package.json not found!');
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// 3. Check vite.config.ts
console.log('\n⚙️ Checking Vite configuration:');
try {
  const viteConfigPath = path.join(rootDir, 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    console.log('✅ vite.config.ts exists');
    
    // Check for base path configuration
    if (viteConfig.includes("base: '/my-website/'")) {
      console.log('✅ Base path is correctly set to /my-website/');
    } else {
      console.log('⚠️ Base path might not be set correctly in vite.config.ts');
    }
  } else {
    console.log('❌ vite.config.ts not found!');
  }
} catch (error) {
  console.error('❌ Error checking vite.config.ts:', error.message);
}

// 4. Check node_modules
console.log('\n📂 Checking node_modules:');
try {
  const nodeModulesPath = path.join(rootDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules directory exists');
    
    // Check for vite in node_modules
    const vitePath = path.join(nodeModulesPath, 'vite');
    if (fs.existsSync(vitePath)) {
      console.log('✅ Vite is installed in node_modules');
    } else {
      console.log('❌ Vite is not installed in node_modules!');
      console.log('⚠️ Run "npm install" to install dependencies');
    }
  } else {
    console.log('❌ node_modules directory not found!');
    console.log('⚠️ Run "npm install" to install dependencies');
  }
} catch (error) {
  console.error('❌ Error checking node_modules:', error.message);
}

// 5. Try to start Vite in debug mode
console.log('\n🚀 Attempting to start Vite in debug mode:');
console.log('(This will run for 5 seconds and then exit)');

try {
  // Run vite with debug flags for 5 seconds
  const viteProcess = execSync('npx vite --debug --base=/my-website/ --logLevel=info', { 
    timeout: 5000,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Vite started successfully in debug mode');
  console.log('Debug output (first 10 lines):');
  
  // Show first 10 lines of output
  viteProcess.split('\n').slice(0, 10).forEach(line => {
    console.log(`   ${line}`);
  });
} catch (error) {
  if (error.status === null) {
    console.log('✅ Vite started but was terminated after timeout (expected)');
  } else {
    console.error('❌ Error starting Vite:', error.message);
    if (error.stdout) {
      console.log('Error output:');
      console.log(error.stdout.toString());
    }
  }
}

console.log('\n💡 SOLUTION RECOMMENDATIONS:');
console.log('1. Make sure you have a proper "dev" script in package.json: "vite --base=/my-website/"');
console.log('2. Run "npm install" to ensure all dependencies are installed');
console.log('3. Try running "npx vite --base=/my-website/" directly');
console.log('4. Clear cache: "npm cache clean --force" and try again');
console.log('5. For debugging, use: "npm run debug" or "npx vite --debug --base=/my-website/"');

console.log('\nTroubleshooting complete!');
