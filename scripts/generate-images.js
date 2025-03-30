import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obține directorul curent în ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🎨 Generez imagini pentru site...');

// SVG pentru o imagine de fundal simplă
const generateCoverSVG = () => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5a2b;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#6b4423;stop-opacity:0.9" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <text x="50%" y="50%" font-family="Arial" font-size="48" fill="#ffffff" text-anchor="middle">Lupul și Corbul</text>
</svg>`;

// SVG pentru imaginile produselor
const generateProductSVG = (title, color) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${color}" />
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle">${title}</text>
</svg>`;

// Generează și salvează imaginea de fundal
const generateCoverImage = () => {
  const srcAssetsDir = path.resolve(rootDir, 'src/assets');
  const publicImagesDir = path.resolve(rootDir, 'public/images');
  
  if (!fs.existsSync(srcAssetsDir)) {
    fs.mkdirSync(srcAssetsDir, { recursive: true });
  }
  
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  
  const srcCoverPath = path.join(srcAssetsDir, 'cover.jpeg');
  const publicCoverPath = path.join(publicImagesDir, 'cover.jpeg');
  
  // Convertim SVG în "JPEG" (nu este un JPEG real, dar vom numi fișierul .jpeg)
  const svgData = generateCoverSVG();
  
  // Salvăm SVG cu extensia .jpeg în ambele locații
  fs.writeFileSync(srcCoverPath, svgData);
  fs.writeFileSync(publicCoverPath, svgData);
  
  console.log('✅ Imagine cover.jpeg generată în src/assets și public/images');
};

// Generează și salvează imaginile produselor
const generateProductImages = () => {
  const publicImagesDir = path.resolve(rootDir, 'public/images');
  
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  
  const products = [
    { name: 'product1.jpg', title: 'Prăjituri tradiționale', color: '#8b5a2b' },
    { name: 'product2.jpg', title: 'Suplimente naturale', color: '#6b4423' },
    { name: 'product3.jpg', title: 'Pachete personalizate', color: '#a67c52' }
  ];
  
  products.forEach(product => {
    const productPath = path.join(publicImagesDir, product.name);
    const svgData = generateProductSVG(product.title, product.color);
    fs.writeFileSync(productPath, svgData);
    console.log(`✅ Imagine ${product.name} generată în public/images`);
  });
};

// Generează și salvează toate imaginile
generateCoverImage();
generateProductImages();

console.log('✅ Toate imaginile au fost generate cu succes!');
console.log('Acum poți rula npm run dev pentru a vedea site-ul cu imaginile încărcate.');
