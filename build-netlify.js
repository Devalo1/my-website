/**
 * Script de build pentru Netlify - construiește aplicația React completă
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
  
  // Asigură-te că index.html există în public
  if (!fs.existsSync('public/index.html')) {
    console.log('Creez index.html în directorul public');
    const publicIndexHtml = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupul și Corbul</title>
  <link rel="icon" type="image/svg+xml" href="/images/Logo.svg" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;
    
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }
    fs.writeFileSync('public/index.html', publicIndexHtml);
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
    sourcemap: true
  },
  base: '/',
});
`;
    fs.writeFileSync('vite.config.js', viteConfig);
  }

  // Construiește aplicația React completă
  console.log('Construiesc aplicația React...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Crează _redirects pentru rutarea SPA
  console.log('Configurare rutare SPA...');
  fs.writeFileSync('dist/_redirects', '/* /index.html 200');

  // Copiază netlify.toml în directorul dist
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join('dist', 'netlify.toml'));
  }

  console.log('Build finalizat cu succes!');
} catch (error) {
  console.error('Eroare în timpul build-ului:', error);
  
  // Creăm o pagină de fallback doar dacă build-ul principal eșuează
  console.log('Creând pagină de fallback...');
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
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
      background: #f5f5f5; 
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 600px;
    }
    h1 { color: #6b4423; margin-bottom: 1rem; }
    p { color: #333; line-height: 1.6; }
    .btn {
      display: inline-block;
      background: #8b5a2b;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 1rem;
      transition: background 0.3s;
    }
    .btn:hover { background: #6b4423; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Lupul și Corbul</h1>
    <p>A apărut o eroare în timpul build-ului, dar vom rezolva curând.</p>
    <p>Reveniți mai târziu pentru a vedea site-ul complet.</p>
    <a href="https://github.com/Devalo1/my-website" class="btn">Vezi proiectul pe GitHub</a>
  </div>
</body>
</html>`;

  fs.writeFileSync('dist/index.html', fallbackHtml);
  fs.writeFileSync('dist/_redirects', '/* /index.html 200');
  
  // Permite continuarea deploy-ului cu pagina de fallback
  console.log('Pagină de fallback creată, continuăm deploy-ul');
}
