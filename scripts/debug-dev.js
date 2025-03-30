import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obține directorul curent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Începere depanare mod dezvoltare...');

// 1. Verifică existența fișierelor critice
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'src/styles/styles.css',
  'public/images/placeholder.jpeg',
  'index.html'
];

console.log('\n📁 Verificare fișiere critice:');
criticalFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} există`);
  } else {
    console.log(`❌ ${file} lipsește!`);
  }
});

// 2. Verifică configurația Vite
console.log('\n⚙️ Verificare configurație Vite:');
try {
  const viteConfig = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  console.log('✅ vite.config.ts există');
  
  // Verifică pentru cheile duplicate
  if ((viteConfig.match(/base:/g) || []).length > 1) {
    console.log('⚠️ AVERTISMENT: Configurația Vite conține chei "base" duplicate!');
  }
} catch (error) {
  console.log('❌ Eroare la citirea vite.config.ts:', error);
}

// 3. Încearcă să ruleze un build de test
console.log('\n🔨 Rulare build de test...');
try {
  execSync('npx vite build --outDir=.debug-build', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Build de test reușit');
  
  // Curăță după build-ul de test
  fs.rmSync(path.join(rootDir, '.debug-build'), { recursive: true, force: true });
} catch (error) {
  console.log('❌ Build-ul de test a eșuat:', error);
}

console.log('\n🚀 Instrucțiuni de remediere:');
console.log('1. Verifică consolă în browser pentru erori JavaScript (F12)');
console.log('2. Asigură-te că path-urile către resurse sunt corecte');
console.log('3. Încearcă să ștergi directorul node_modules și să rulezi npm install');
console.log('4. Șterge cache-ul browserului cu Ctrl+F5');
