/**
 * Script de build pentru Netlify cu suport îmbunătățit pentru resurse
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Netlify build process...');

try {
  // Asigură-te că directorul dist există
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  console.log('Verificare și pregătire resurse esențiale...');
  
  // Asigură-te că folderul public/images există
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }
  
  // Copiază imaginea din src/assets la public/images dacă nu există deja
  const coverSrcPath = path.join(__dirname, 'src', 'assets', 'cover.jpg');
  const coverDestPath = path.join(__dirname, 'public', 'images', 'cover.jpeg');

  if (fs.existsSync(coverSrcPath) && !fs.existsSync(coverDestPath)) {
    console.log('Copiez imaginea de fundal din src/assets la public/images...');
    fs.copyFileSync(coverSrcPath, coverDestPath);
    console.log('Imagine de fundal copiată cu succes!');
  }
  
  // Verifică și copiază imaginea de background dacă există
  console.log('Verificare resurse de background...');
  
  const backgroundVideoSource = path.join(__dirname, 'public', 'background.mp4');
  const backgroundImageSource = path.join(__dirname, 'public', 'images', 'cover.jpeg');
  
  // Verificare fișier background.mp4
  if (fs.existsSync(backgroundVideoSource)) {
    console.log('Background video găsit: background.mp4');
  } else {
    console.log('Background video nu a fost găsit. Se va utiliza imaginea de fundal.');
  }
  
  // Verificare imagine de fundal
  if (fs.existsSync(backgroundImageSource)) {
    console.log('Imagine de fundal găsită: cover.jpeg');
  } else {
    console.log('AVERTISMENT: Imagine de fundal lipsă!');
    
    // Creează o imagine de fundal placeholder dacă nu există
    const placeholderText = `IMPORTANT: Missing critical image - cover.jpeg

This file should be a JPEG image used as the main background for the website.
Please create an actual cover.jpeg file in this directory.`;
    
    fs.writeFileSync(path.join(__dirname, 'public', 'images', 'cover.jpeg.placeholder'), placeholderText);
    console.log('Am creat un placeholder pentru cover.jpeg');
  }

  // Instalează dependențele necesare pentru build
  console.log('Instalare dependențe pentru build...');
  execSync('npm install --no-save vite @vitejs/plugin-react', { stdio: 'inherit' });
  
  // Verifică și creează vite.config.js dacă nu există
  if (!fs.existsSync('vite.config.js') && !fs.existsSync('vite.config.ts')) {
    console.log('Creez vite.config.js');
    const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    // Excludem explicit 'vite' din bundle pentru a preveni erorile
    rollupOptions: {
      external: ['vite']
    }
  },
  base: '/',
});
`;
    fs.writeFileSync('vite.config.js', viteConfig);
  }

  // Construiește aplicația React completă
  console.log('Construiesc aplicația React...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('Build Vite completat cu succes!');
  } catch (buildError) {
    console.error('Eroare în build Vite:', buildError);
    throw buildError;
  }

  // Verifică dacă folderul dist conține index.html
  if (!fs.existsSync('dist/index.html')) {
    console.error('EROARE: index.html nu a fost generat în dist/');
    throw new Error('Build incomplet - index.html lipsește');
  }

  // Copiem resursele importante
  console.log('Copierea resurselor statice în dist...');
  
  // Crează _redirects pentru rutarea SPA
  fs.writeFileSync('dist/_redirects', '/* /index.html 200');
  console.log('Fișier _redirects creat pentru rutare SPA');

  // Copiază netlify.toml în directorul dist
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join('dist', 'netlify.toml'));
    console.log('netlify.toml copiat în dist/');
  }
  
  // Crează folderul dist/images dacă nu există
  if (!fs.existsSync('dist/images')) {
    fs.mkdirSync('dist/images', { recursive: true });
  }
  
  // Copiază imaginile esențiale dacă nu sunt deja copiate de Vite
  if (fs.existsSync('public/images/cover.jpeg') && !fs.existsSync('dist/images/cover.jpeg')) {
    fs.copyFileSync('public/images/cover.jpeg', 'dist/images/cover.jpeg');
    console.log('cover.jpeg copiat în dist/images/');
  }
  
  // Copiază background video dacă există
  if (fs.existsSync('public/background.mp4') && !fs.existsSync('dist/background.mp4')) {
    fs.copyFileSync('public/background.mp4', 'dist/background.mp4');
    console.log('background.mp4 copiat în dist/');
  }

  console.log('Build finalizat cu succes! Toate resursele au fost procesate.');
} catch (error) {
  console.error('Eroare în timpul build-ului:', error);
  
  // Creăm o pagină de fallback doar dacă build-ul principal eșuează
  console.log('Creând pagină de fallback...');
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Creează folderul dist/images dacă nu există
  if (!fs.existsSync('dist/images')) {
    fs.mkdirSync('dist/images', { recursive: true });
  }
  
  // Copiază totuși imaginea de fundal dacă există
  if (fs.existsSync('public/images/cover.jpeg')) {
    fs.copyFileSync('public/images/cover.jpeg', 'dist/images/cover.jpeg');
    console.log('cover.jpeg copiat în dist/images/ pentru pagina de fallback');
  }
  
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupul și Corbul</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      background: #6b4423 url('/images/cover.jpeg') center/cover no-repeat fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .container {
      background: rgba(0, 0, 0, 0.6);
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 600px;
      backdrop-filter: blur(10px);
    }
    h1 { color: #fff; margin-bottom: 1rem; font-size: 2.5rem; }
    p { color: #eee; line-height: 1.6; font-size: 1.1rem; }
    .btn {
      display: inline-block;
      background: #8b5a2b;
      color: white;
      padding: 12px 24px;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 1.5rem;
      transition: all 0.3s;
      font-size: 1rem;
      border: 2px solid transparent;
    }
    .btn:hover { 
      background: #6b4423; 
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      border-color: rgba(255,255,255,0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Lupul și Corbul</h1>
    <p>Site-ul nostru este momentan în construcție și va fi disponibil în curând cu o experiență completă.</p>
    <p>Între timp, puteți să ne vizitați proiectul pe GitHub pentru a urmări progresul nostru.</p>
    <a href="https://github.com/Devalo1/my-website" class="btn">Vezi proiectul pe GitHub</a>
  </div>
</body>
</html>`;

  fs.writeFileSync('dist/index.html', fallbackHtml);
  fs.writeFileSync('dist/_redirects', '/* /index.html 200');
  
  console.log('Pagină de fallback creată, continuăm deploy-ul');
}
