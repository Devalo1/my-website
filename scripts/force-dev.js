import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 Forțare start server dezvoltare...');

try {
  // Încercăm să oprim toate procesele node pentru a elibera porturile
  console.log('Oprirea proceselor Node.js care pot bloca porturile...');
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
    } else {
      execSync('pkill -f node', { stdio: 'ignore' });
    }
  } catch (e) {
    // Ignorăm erorile - poate că nu există procese active
  }

  // Curățăm cache-ul
  console.log('Curățare cache Vite...');
  const viteCache = path.resolve(process.cwd(), 'node_modules', '.vite');
  if (fs.existsSync(viteCache)) {
    fs.rmSync(viteCache, { recursive: true, force: true });
  }

  // Generăm imagini
  console.log('Generare imagini pentru site...');
  
  // Asigură-te că directoarele există
  const publicImagesDir = path.resolve(process.cwd(), 'public/images');
  const srcAssetsDir = path.resolve(process.cwd(), 'src/assets');
  
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  if (!fs.existsSync(srcAssetsDir)) {
    fs.mkdirSync(srcAssetsDir, { recursive: true });
  }
  
  // Creează imagine cover simplă
  const coverSVG = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#8b5a2b"/>
    <text x="50%" y="50%" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Lupul și Corbul</text>
  </svg>`;
  
  fs.writeFileSync(path.join(publicImagesDir, 'cover.jpeg'), coverSVG);
  fs.writeFileSync(path.join(srcAssetsDir, 'cover.jpeg'), coverSVG);
  
  // Pornește serverul cu toate flag-urile necesare
  console.log('Pornire server dezvoltare...');
  execSync('vite --force --clearScreen=false --base=/my-website/', { 
    stdio: 'inherit',
    env: { ...process.env, VITE_CLEAR_SCREEN: 'false' }
  });
} catch (error) {
  console.error('❌ Eroare:', error);
}
