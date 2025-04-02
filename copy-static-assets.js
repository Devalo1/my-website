const fs = require('fs');
const path = require('path');

console.log('===== COPIERE FIȘIERE STATICE =====');
console.log('Acest script asigură că toate fișierele statice sunt corect copiate în directorul dist.\n');

// Helper pentru copierea recursivă a directoarelor
function copyFolderRecursiveSync(source, target) {
  // Creăm directorul țintă dacă nu există
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Citim conținutul directorului sursă
  const files = fs.readdirSync(source);

  // Copiem fiecare fișier/director
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    // Verificăm dacă este director sau fișier
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Recursiv pentru directoare
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else {
      // Copiem fișierul
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copiat: ${path.relative(__dirname, sourcePath)} -> ${path.relative(__dirname, targetPath)}`);
    }
  });
}

// Directoarele care trebuie copiate (relative la rădăcina proiectului)
const staticDirs = [
  'public',
  'assets',
  'images',
  'sounds',
  'scripts'
];

// Verificăm dacă directorul dist există
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Directorul dist nu există. Rulați mai întâi "npm run build".');
  process.exit(1);
}

// Parcurgem toate directoarele și le copiem în dist dacă există
let copiedCount = 0;
staticDirs.forEach(dir => {
  const sourceDir = path.join(__dirname, dir);
  const targetDir = path.join(distDir, dir);
  
  if (fs.existsSync(sourceDir)) {
    console.log(`\nCopierea directorului ${dir}:`);
    copyFolderRecursiveSync(sourceDir, targetDir);
    copiedCount++;
  } else {
    console.log(`Directorul ${dir} nu există și nu va fi copiat.`);
  }
});

// Copiază și fișierele HTML individuale din rădăcină
const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html') && file !== 'index.html');
if (htmlFiles.length > 0) {
  console.log('\nCopierea fișierelor HTML:');
  htmlFiles.forEach(file => {
    const sourceFile = path.join(__dirname, file);
    const targetFile = path.join(distDir, file);
    
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`Copiat: ${file} -> dist/${file}`);
    copiedCount++;
  });
}

console.log(`\nProcesul de copiere a fișierelor statice a fost ${copiedCount > 0 ? 'finalizat' : 'executat, dar nu s-au găsit fișiere de copiat'}.`);
console.log('Verificați directorul dist pentru a vă asigura că toate fișierele necesare sunt incluse.');
console.log('\nDacă site-ul tot nu funcționează corect, rulaţi "npm run build" din nou pentru a reconstrui aplicația.');
