import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obține directorul curent în ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Crează un fișier _redirects pentru Netlify
const redirectsContent = `
# Redirecționări pentru SPA (Single Page Application)
/*    /index.html   200
`;

try {
  // Rulează build cu flag-ul pentru Netlify
  console.log('Construiesc proiectul pentru Netlify...');
  process.env.BASE_PATH = '/'; // Setează baza pentru Netlify
  execSync('npm run build-netlify', { stdio: 'inherit', cwd: rootDir });

  // Creează fișierul _redirects în directorul dist
  const redirectsPath = path.join(rootDir, 'dist', '_redirects');
  fs.writeFileSync(redirectsPath, redirectsContent);
  console.log('✅ Fișierul _redirects a fost creat pentru redirecționarea SPA');

  console.log('✅ Proiectul a fost construit cu succes pentru Netlify!');
  console.log('Pentru a publica pe Netlify:');
  console.log('1. Conectează-te la Netlify (netlify.com)');
  console.log('2. Creează un nou site și alege "Deploy manually"');
  console.log('3. Încarcă directorul "dist" generat');
} catch (error) {
  console.error('❌ A apărut o eroare în timpul build-ului:', error);
  process.exit(1);
}
