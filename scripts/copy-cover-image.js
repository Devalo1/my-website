/**
 * Script pentru copierea imaginii de fundal din src/assets în public/images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obține calea directorului curent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======= COPY COVER IMAGE SCRIPT =======');
console.log(`Director rădăcină: ${rootDir}`);

// Lista posibilelor surse pentru imaginea de fundal
const possibleSources = [
  path.join(rootDir, 'src', 'assets', 'cover.jpg'),
  path.join(rootDir, 'src', 'assets', 'cover.jpeg'),
  path.join(rootDir, 'public', 'cover.jpg'),
  path.join(rootDir, 'public', 'cover.jpeg')
];

// Directoarele destinație pentru copiere
const destinations = [
  path.join(rootDir, 'public', 'images'),
  path.join(rootDir, 'dist', 'images')
];

// Verifică și creează directoarele destinație
for (const destDir of destinations) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Creat director: ${destDir}`);
  }
}

// Verifică fiecare sursă posibilă și copiază prima imagine validă găsită
let sourceFound = false;

for (const sourcePath of possibleSources) {
  if (fs.existsSync(sourcePath)) {
    console.log(`Sursă găsită: ${sourcePath}`);
    sourceFound = true;

    // Copiază în fiecare destinație
    for (const destDir of destinations) {
      const destPath = path.join(destDir, 'cover.jpeg');
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Imagine copiată cu succes la: ${destPath}`);
      } catch (err) {
        console.error(`❌ Eroare la copierea imaginii în ${destPath}:`, err);
      }
    }

    break; // Oprire după prima sursă validă
  }
}

if (!sourceFound) {
  console.error('❌ EROARE: Nu s-a găsit nicio imagine sursă validă!');
  console.log('Locații verificate:');
  possibleSources.forEach(path => console.log(` - ${path}`));
  
  // Creare imagine placeholder dacă nu există sursă
  for (const destDir of destinations) {
    const placeholderPath = path.join(destDir, 'cover.jpeg.placeholder');
    const content = `MISSING COVER IMAGE
    
Please place a cover.jpg or cover.jpeg file in one of these locations:
- src/assets/
- public/

Then run: npm run copy-cover`;

    try {
      fs.writeFileSync(placeholderPath, content);
      console.log(`✅ Fișier placeholder creat: ${placeholderPath}`);
    } catch (err) {
      console.error(`❌ Eroare la crearea fișierului placeholder în ${placeholderPath}:`, err);
    }
  }
}

console.log('======= SCRIPT TERMINAT =======');
