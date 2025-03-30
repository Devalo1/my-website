import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obține directorul curent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Depanare completă a aplicației...');

// 1. Verifică structura proiectului
console.log('\n📁 Verificare structură proiect:');
const requiredDirs = [
  'src',
  'src/styles',
  'src/assets',
  'public',
  'public/images'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Directorul ${dir} lipsește!`);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`   ✅ Directorul ${dir} a fost creat automat.`);
  } else {
    console.log(`✅ Directorul ${dir} există.`);
  }
});

// 2. Verifică fișiere critice
console.log('\n📄 Verificare fișiere critice:');
const criticalFiles = [
  { path: 'src/App.tsx', required: true },
  { path: 'src/main.tsx', required: true },
  { path: 'src/styles/styles.css', required: true },
  { path: 'index.html', required: true },
  { path: 'vite.config.ts', required: true },
  { path: 'public/images/cover.jpeg', required: false }
];

criticalFiles.forEach(file => {
  const filePath = path.join(rootDir, file.path);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fișierul ${file.path} lipsește!`);
    
    if (file.required) {
      console.log(`   ⚠️ Acesta este un fișier necesar, aplicația nu poate funcționa fără el.`);
    }
  } else {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.log(`⚠️ Fișierul ${file.path} există dar este gol!`);
    } else {
      console.log(`✅ Fișierul ${file.path} există și are conținut (${stats.size} bytes).`);
    }
  }
});

// 3. Verifică și actualizează fișierul index.html
console.log('\n📝 Verificare index.html:');
const indexPath = path.join(rootDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Verifică dacă index.html conține elementul root
  if (!indexContent.includes('<div id="root"></div>')) {
    console.log(`⚠️ Fișierul index.html nu conține elementul root sau este incorect!`);
    
    // Creează un nou index.html corect
    const newIndexContent = `<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Lupul și Corbul - Prăjituri artizanale și suplimente naturale">
    <title>Lupul și Corbul - Prăjituri & Suplimente</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    
    fs.writeFileSync(indexPath, newIndexContent);
    console.log(`   ✅ Fișierul index.html a fost reparat.`);
  } else {
    console.log(`✅ Fișierul index.html conține elementul root corect.`);
  }
} else {
  console.log(`❌ Fișierul index.html lipsește!`);
  
  // Creează index.html
  const newIndexContent = `<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Lupul și Corbul - Prăjituri artizanale și suplimente naturale">
    <title>Lupul și Corbul - Prăjituri & Suplimente</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  
  fs.writeFileSync(indexPath, newIndexContent);
  console.log(`   ✅ Fișierul index.html a fost creat.`);
}

// 4. Verifică și generează imaginile necesare
try {
  console.log('\n🖼️ Verificare și generare imagini...');
  if (!fs.existsSync(path.join(rootDir, 'public', 'images'))) {
    fs.mkdirSync(path.join(rootDir, 'public', 'images'), { recursive: true });
  }
  
  const placeholderSVG = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#8b5a2b"/>
    <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="white">Lupul și Corbul</text>
  </svg>`;
  
  const coverPath = path.join(rootDir, 'public', 'images', 'cover.jpeg');
  if (!fs.existsSync(coverPath)) {
    fs.writeFileSync(coverPath, placeholderSVG);
    console.log('✅ Imagine cover.jpeg generată');
  }
  
  const products = ['product1.jpg', 'product2.jpg', 'product3.jpg'];
  products.forEach(prod => {
    const prodPath = path.join(rootDir, 'public', 'images', prod);
    if (!fs.existsSync(prodPath)) {
      fs.writeFileSync(prodPath, placeholderSVG);
      console.log(`✅ Imagine ${prod} generată`);
    }
  });
} catch (error) {
  console.error('❌ Eroare la generarea imaginilor:', error);
}

// 5. Verifică vite.config.ts
try {
  console.log('\n⚙️ Verificare configurație Vite...');
  const viteConfigPath = path.join(rootDir, 'vite.config.ts');
  
  if (fs.existsSync(viteConfigPath)) {
    const config = fs.readFileSync(viteConfigPath, 'utf8');
    if (config.includes('base:') && config.match(/base:/g).length > 1) {
      console.log('❌ Detecție cheie duplicată "base" în vite.config.ts');
      
      // Rescrie configurația pentru a elimina duplicările
      const newConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/',
  build: {
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
})`;
      
      fs.writeFileSync(viteConfigPath, newConfig);
      console.log('✅ vite.config.ts reparat');
    } else {
      console.log('✅ vite.config.ts verificat, nu au fost găsite probleme');
    }
  } else {
    console.log('❌ vite.config.ts lipsește - se creează unul nou...');
    // Creează un fișier de configurație nou
    const newConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-website/'
})`;
    
    fs.writeFileSync(viteConfigPath, newConfig);
    console.log('✅ vite.config.ts creat');
  }
} catch (error) {
  console.error('❌ Eroare la verificarea vite.config.ts:', error);
}

// 6. Curăță proiectul și eliberează porturile
console.log('\n🧹 Curățare și eliberare resurse:');

try {
  // Eliberăm porturile ocupate
  console.log('   Eliberare porturi...');
  const ports = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 5173, 5174, 5175];
  
  if (process.platform === 'win32') {
    for (const port of ports) {
      try {
        execSync(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do taskkill /F /PID %a`, { stdio: 'ignore' });
      } catch (e) {}
    }
  } else {
    for (const port of ports) {
      try {
        execSync(`lsof -i :${port} -t | xargs kill -9`, { stdio: 'ignore' });
      } catch (e) {}
    }
  }
  
  console.log('   ✅ Porturile au fost eliberate.');
  
  // Șterge cache-ul Vite
  if (fs.existsSync(path.join(rootDir, 'node_modules', '.vite'))) {
    fs.rmSync(path.join(rootDir, 'node_modules', '.vite'), { recursive: true, force: true });
    console.log('   ✅ Cache-ul Vite a fost șters.');
  }
  
  // Curăță directorul node_modules
  console.log('   Vrei să ștergi și să reinstalezi node_modules? (va dura mai mult) [y/N]');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('   ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log('   Ștergere node_modules...');
        fs.rmSync(path.join(rootDir, 'node_modules'), { recursive: true, force: true });
        console.log('   ✅ node_modules a fost șters.');
        
        console.log('   Reinstalare pachete npm...');
        execSync('npm install', { stdio: 'inherit', cwd: rootDir });
        console.log('   ✅ Pachetele npm au fost reinstalate.');
      } catch (error) {
        console.error('   ❌ Eroare la manipularea node_modules:', error);
      }
    }
    
    // Final și recomandări
    console.log('\n🚀 Depanare completă! Recomandări pentru a porni aplicația:');
    console.log('1. Rulează: npm run dev-with-images');
    console.log('2. În browser, deschide consola (F12) pentru a vedea eventualele erori');
    console.log('3. Dacă aplicația tot nu funcționează, încearcă să pornești un proiect nou');
    console.log('\nVerifică versiunile de Node.js și npm:');
    console.log('- Node.js: ' + process.version);
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log('- npm: ' + npmVersion);
    } catch (e) {
      console.log('- npm: nu s-a putut determina versiunea');
    }
    
    readline.close();
  });
  
} catch (error) {
  console.error('\n❌ Eroare în timpul procesului de depanare:', error);
}
