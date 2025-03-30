// Script simplu pentru a repara site-ul și a genera imaginile necesare
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Reparare site...');

// Obține directorul curent
const rootDir = process.cwd();

// 1. Repară vite.config.ts pentru a elimina cheile duplicate
const fixViteConfig = () => {
  console.log('\n1. Reparare configurație Vite...');
  const viteConfigPath = path.join(rootDir, 'vite.config.ts');
  
  const correctConfig = `import { defineConfig } from 'vite'
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
    host: true,
    port: 3000
  }
})`;

  try {
    fs.writeFileSync(viteConfigPath, correctConfig);
    console.log('✅ vite.config.ts a fost reparat');
  } catch (error) {
    console.error('❌ Eroare la repararea vite.config.ts:', error);
  }
};

// 2. Generează imaginile necesare
const generateImages = () => {
  console.log('\n2. Generare imagini necesare...');
  
  // Asigură-te că directorul public/images există
  const imagesDir = path.join(rootDir, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Generează imagine de copertă
  const coverPath = path.join(imagesDir, 'cover.jpeg');
  const coverSVG = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#8b5a2b"/>
    <text x="50%" y="50%" font-size="72" text-anchor="middle" fill="white">Lupul și Corbul</text>
  </svg>`;
  
  fs.writeFileSync(coverPath, coverSVG);
  console.log('✅ Imagine cover.jpeg creată');
  
  // Generează placeholder
  const placeholderPath = path.join(imagesDir, 'placeholder.jpeg');
  const placeholderSVG = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#6b4423"/>
    <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="white">Imagine lipsă</text>
  </svg>`;
  
  fs.writeFileSync(placeholderPath, placeholderSVG);
  console.log('✅ Imagine placeholder.jpeg creată');
  
  // Generează imaginile produselor
  const products = [
    { name: 'product1.jpg', title: 'Prăjituri tradiționale', color: '#8b5a2b' },
    { name: 'product2.jpg', title: 'Suplimente naturale', color: '#6b4423' },
    { name: 'product3.jpg', title: 'Pachete personalizate', color: '#a67c52' }
  ];
  
  products.forEach(product => {
    const productPath = path.join(imagesDir, product.name);
    const productSVG = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${product.color}"/>
      <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="white">${product.title}</text>
    </svg>`;
    
    fs.writeFileSync(productPath, productSVG);
    console.log(`✅ Imagine ${product.name} creată`);
  });
};

// 3. Adaugă imagini în directorul src/assets pentru referințe
const setupSrcAssets = () => {
  console.log('\n3. Configurare director src/assets...');
  
  // Creează directorul dacă nu există
  const srcAssetsDir = path.join(rootDir, 'src', 'assets');
  if (!fs.existsSync(srcAssetsDir)) {
    fs.mkdirSync(srcAssetsDir, { recursive: true });
  }
  
  // Copiază imaginea de copertă în src/assets
  const coverSrc = path.join(rootDir, 'public', 'images', 'cover.jpeg');
  const coverDest = path.join(srcAssetsDir, 'cover.jpeg');
  
  if (fs.existsSync(coverSrc)) {
    fs.copyFileSync(coverSrc, coverDest);
    console.log('✅ Imagine cover.jpeg copiată în src/assets');
  }
};

// 4. Curăță cache-ul pentru a asigura o încărcare proaspătă
const cleanCache = () => {
  console.log('\n4. Curățare cache Vite...');
  try {
    // Șterge .vite din node_modules
    const viteCachePath = path.join(rootDir, 'node_modules', '.vite');
    if (fs.existsSync(viteCachePath)) {
      fs.rmSync(viteCachePath, { recursive: true, force: true });
      console.log('✅ Cache-ul Vite a fost șters');
    }
  } catch (error) {
    console.error('❌ Eroare la ștergerea cache-ului:', error);
  }
};

// Execută toate funcțiile
try {
  fixViteConfig();
  generateImages();
  setupSrcAssets();
  cleanCache();
  
  console.log('\n✅ Site-ul a fost reparat cu succes!');
  console.log('\nAcum poți rula npm run dev pentru a porni serverul.');
} catch (error) {
  console.error('\n❌ Eroare la repararea site-ului:', error);
}
