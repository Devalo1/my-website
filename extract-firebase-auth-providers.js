import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of files that likely contain auth provider configurations
const potentialFiles = [
  './src/services/firebase-config.js',
  './src/components/auth.js',
  './js/firebase-config.ts',
  './firebase-auth-compat.js',
  './public/scripts/firebase-auth-compat.js',
  './dist/scripts/firebase-auth-compat.js'
];

// Patterns to identify auth providers
const providerPatterns = [
  { name: 'Email/Password', patterns: [
    /createUserWithEmailAndPassword/,
    /signInWithEmailAndPassword/,
    /EmailAuthProvider/
  ]},
  { name: 'Google', patterns: [
    /GoogleAuthProvider/,
    /signInWithPopup.*Google/,
    /googleProvider/,
    /auth\.signInWithPopup\(new firebase\.auth\.GoogleAuthProvider\(\)\)/
  ]},
  { name: 'Facebook', patterns: [
    /FacebookAuthProvider/,
    /signInWithPopup.*Facebook/,
    /facebookProvider/
  ]},
  { name: 'Twitter', patterns: [
    /TwitterAuthProvider/,
    /signInWithPopup.*Twitter/,
    /twitterProvider/
  ]},
  { name: 'GitHub', patterns: [
    /GithubAuthProvider/,
    /signInWithPopup.*Github/,
    /githubProvider/
  ]},
  { name: 'Phone', patterns: [
    /PhoneAuthProvider/,
    /signInWithPhoneNumber/
  ]},
  { name: 'Anonymous', patterns: [
    /signInAnonymously/
  ]},
  { name: 'Custom Auth', patterns: [
    /signInWithCustomToken/
  ]}
];

// Function to check file for auth providers
function checkFileForProviders(filePath) {
  console.log(`Checking file: ${filePath}`);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`  File not found: ${filePath}`);
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const foundProviders = [];
    
    for (const provider of providerPatterns) {
      for (const pattern of provider.patterns) {
        if (pattern.test(content)) {
          foundProviders.push(provider.name);
          break; // Found this provider, no need to check other patterns
        }
      }
    }
    
    return foundProviders;
  } catch (error) {
    console.error(`  Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Function to extract Firebase app info
function extractFirebaseAppInfo(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for Firebase config object
    const configMatch = content.match(/(?:firebase\.initializeApp|initializeApp)\s*\(\s*{([^}]+)}/s);
    if (!configMatch) return null;
    
    const configText = configMatch[1];
    
    // Extract individual properties
    const projectIdMatch = configText.match(/projectId\s*:\s*["']([^"']+)["']/);
    const authDomainMatch = configText.match(/authDomain\s*:\s*["']([^"']+)["']/);
    const appIdMatch = configText.match(/appId\s*:\s*["']([^"']+)["']/);
    
    return {
      projectId: projectIdMatch ? projectIdMatch[1] : 'Not found',
      authDomain: authDomainMatch ? authDomainMatch[1] : 'Not found',
      appId: appIdMatch ? appIdMatch[1] : 'Not found'
    };
  } catch (error) {
    console.error(`  Error extracting app info from ${filePath}:`, error.message);
    return null;
  }
}

// Main function
async function extractFirebaseInfo() {
  console.log('=== Firebase Authentication Providers Detection ===\n');
  
  // Check for firebase config files
  let appInfo = null;
  for (const file of potentialFiles) {
    const filePath = path.resolve(__dirname, file);
    const info = extractFirebaseAppInfo(filePath);
    if (info) {
      appInfo = info;
      console.log(`Firebase Application Info (from ${file}):`);
      console.log(`  Project ID: ${info.projectId}`);
      console.log(`  Auth Domain: ${info.authDomain}`);
      console.log(`  App ID: ${info.appId}`);
      console.log('');
      break;
    }
  }
  
  if (!appInfo) {
    console.log('Could not find Firebase application configuration details.');
    console.log('');
  }
  
  // Check for auth providers
  console.log('Detected Authentication Providers:');
  const allProviders = new Set();
  
  for (const file of potentialFiles) {
    const filePath = path.resolve(__dirname, file);
    const providers = checkFileForProviders(filePath);
    
    if (providers.length > 0) {
      console.log(`  In ${file}:`);
      providers.forEach(provider => {
        console.log(`    - ${provider}`);
        allProviders.add(provider);
      });
    }
  }
  
  if (allProviders.size === 0) {
    console.log('  No authentication providers detected in the scanned files.');
    console.log('\nNote: This script can only detect providers in the files it analyzes.');
    console.log('For the most accurate information, check the Firebase Console:');
    console.log('https://console.firebase.google.com/');
  } else {
    console.log('\nSummary of detected authentication providers:');
    [...allProviders].sort().forEach(provider => {
      console.log(`  - ${provider}`);
    });
  }
}

// Run the extraction
extractFirebaseInfo();
