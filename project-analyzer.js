const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===== ANALIZOR DE PROIECT VITE =====');
console.log('Acest script analizează configurația proiectului și identifică probleme potențiale.\n');

// Funcție pentru a citi un fișier JSON în siguranță
function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error(`Eroare la citirea ${path.basename(filePath)}: ${error.message}`);
  }
  return null;
}

// Analiză package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = readJsonSafe(packagePath);

if (!packageJson) {
  console.error('EROARE CRITICĂ: package.json nu există sau are un format invalid.');
  process.exit(1);
}

console.log('INFORMAȚII PROIECT:');
console.log(`Numele proiectului: ${packageJson.name || 'Nedefinit'}`);
console.log(`Versiunea: ${packageJson.version || 'Nedefinită'}`);

// Analiză dependințe
console.log('\nDEPENDINȚE:');
const hasDep = (name) => 
  (packageJson.dependencies && packageJson.dependencies[name]) || 
  (packageJson.devDependencies && packageJson.devDependencies[name]);

const viteInstalled = hasDep('vite');
console.log(`- Vite: ${viteInstalled ? 'Instalat' : 'LIPSĂ'}`);

// Analiză scripturi
console.log('\nSCRIPTURI:');
if (!packageJson.scripts) {
  console.log('AVERTISMENT: Nu există scripturi definite în package.json');
} else {
  Object.entries(packageJson.scripts).forEach(([name, script]) => {
    console.log(`- ${name}: ${script}`);
    
    // Verificăm configurațiile de bază
    if (script.includes('vite')) {
      const basePathMatch = script.match(/--base=([^\s]+)/);
      if (basePathMatch) {
        console.log(`  • Base path configurat: ${basePathMatch[1]}`);
      } else if (!script.includes('--base')) {
        console.log(`  • AVERTISMENT: Scriptul nu specifică un base path`);
      }
      
      const portMatch = script.match(/--port=([0-9]+)/);
      if (portMatch) {
        console.log(`  • Port configurat: ${portMatch[1]}`);
      }
    }
  });
}

// Analiză vite.config.js
const viteConfigPath = path.join(__dirname, 'vite.config.js');
console.log('\nCONFIGURAȚIE VITE:');
if (fs.existsSync(viteConfigPath)) {
  console.log('Fișierul vite.config.js există.');
  try {
    const configContent = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Verificăm base path în configurație
    const baseMatch = configContent.match(/base:\s*['"]([^'"]+)['"]/);
    if (baseMatch) {
      console.log(`- Base path în configurație: ${baseMatch[1]}`);
      
      // Comparăm cu base path din scripturi
      if (packageJson.scripts) {
        for (const [name, script] of Object.entries(packageJson.scripts)) {
          if (script.includes('vite')) {
            const scriptBaseMatch = script.match(/--base=([^\s]+)/);
            if (scriptBaseMatch && scriptBaseMatch[1] !== baseMatch[1]) {
              console.log(`  • INCONSISTENȚĂ: Base path din script (${scriptBaseMatch[1]}) diferă de cel din configurație (${baseMatch[1]})`);
            }
          }
        }
      }
    } else {
      console.log('- Nu s-a găsit configurare explicită pentru base path în vite.config.js');
    }
  } catch (error) {
    console.error(`Eroare la citirea vite.config.js: ${error.message}`);
  }
} else {
  console.log('vite.config.js nu există.');
}

// Verificare build output
const distPath = path.join(__dirname, 'dist');
console.log('\nANALIZĂ BUILD OUTPUT:');
if (fs.existsSync(distPath)) {
  console.log('Directorul dist există. Conținut:');
  const distFiles = fs.readdirSync(distPath);
  distFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.log(`- ${file}/ (director)`);
    } else {
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`- ${file} (${sizeKB} KB)`);
    }
  });
  
  // Verificăm index.html pentru referințe la assets
  const distIndexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(distIndexPath)) {
    try {
      const indexContent = fs.readFileSync(distIndexPath, 'utf8');
      const assetReferences = indexContent.match(/src=["']([^"']+)["']|href=["']([^"']+)["']/g) || [];
      
      console.log('\nReferințe în index.html:');
      assetReferences.forEach(ref => {
        console.log(`- ${ref}`);
      });
    } catch (error) {
      console.error(`Eroare la citirea dist/index.html: ${error.message}`);
    }
  }
} else {
  console.log('Directorul dist nu există. Rulați npm run build pentru a crea output-ul de producție.');
}

// Sugestii și recomandări
console.log('\nRECOMANDĂRI:');

// Verificăm dacă există inconsistențe de port între start-fixed.js și npm run dev
console.log('1. Pentru a asigura consistența portului:');
console.log('   - Adăugați "--port=3000" în scriptul "dev" din package.json');
console.log('   - SAU folosiți node start-fixed.js pentru dezvoltare');

console.log('2. Pentru a asigura consistența base path-ului:');
console.log(`   - Folosiți același base path (/${packageJson.name}/ sau /) în toate configurațiile`);

console.log('\nAcționați pe baza acestor recomandări pentru a evita discrepanțele între mediile de dezvoltare și producție.');
