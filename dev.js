// Script simplu pentru a porni dezvoltarea
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Verifică dacă toate fișierele necesare există
function checkRequiredFiles() {
  const required = [
    'src/main.tsx',
    'src/App.tsx',
    'index.html',
  ];
  
  let missing = false;
  for (const file of required) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      console.error(`EROARE: Fișierul ${file} lipsește!`);
      missing = true;
    }
  }
  
  if (missing) {
    console.error('Reparați erorile de mai sus înainte de a continua.');
    process.exit(1);
  }
}

// Pornește dezvoltarea
function startDevelopment() {
  try {
    console.log('Verificarea fișierelor necesare...');
    checkRequiredFiles();
    
    console.log('Pornirea server-ului de dezvoltare...');
    console.log('URL: http://localhost:3000/');
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Eroare la pornirea dezvoltării:', error.message);
  }
}

startDevelopment();
