/**
 * Script simplificat pentru build pe Netlify
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

  // Forțează instalarea Vite și React Plugin ca dependințe globale
  console.log('Instalare Vite global pentru build...');
  execSync('npm install -g vite @vitejs/plugin-react', { stdio: 'inherit' });

  // Crează un index.html minim în directorul dist
  console.log('Creare pagină de bază...');
  const indexHtml = `
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
    <p>Bine ați venit la Lupul și Corbul! Site-ul nostru este în construcție, dar va fi disponibil în curând.</p>
    <p>Avem multe surprize pregătite pentru dumneavoastră.</p>
    <a href="https://github.com/Devalo1/my-website" class="btn">Vezi proiectul pe GitHub</a>
  </div>
</body>
</html>`;

  fs.writeFileSync('dist/index.html', indexHtml);

  // Crează un fișier _redirects pentru rutarea SPA
  console.log('Configurare rutare SPA...');
  fs.writeFileSync('dist/_redirects', '/* /index.html 200');

  // Copiază netlify.toml în directorul dist
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join('dist', 'netlify.toml'));
  }

  console.log('Build finalizat cu succes!');
} catch (error) {
  console.error('Eroare în timpul build-ului:', error);
  process.exit(1);
}
