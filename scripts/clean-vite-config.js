import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// În ES Modules nu avem __dirname, deci îl definim manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Lista de fișiere de configurație nedorite
const unwantedConfigFiles = [
  'vite.config.js',
  'vite.config.tsx.tsx',
  'vite.config.tsx'
];

// Verifică și șterge fiecare fișier nedorit
unwantedConfigFiles.forEach(configFile => {
  const filePath = path.join(rootDir, configFile);
  
  if (fs.existsSync(filePath)) {
    console.log(`Se șterge ${configFile}...`);
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ ${configFile} a fost șters cu succes.`);
    } catch (error) {
      console.error(`❌ Eroare la ștergerea ${configFile}:`, error.message);
    }
  } else {
    console.log(`${configFile} nu există, nu este necesară ștergerea.`);
  }
});

// Verifică dacă vite.config.ts există, dacă nu, îl creează
const viteConfigTs = path.join(rootDir, 'vite.config.ts');

if (!fs.existsSync(viteConfigTs)) {
  console.log('Crearea fișierului vite.config.ts...');
  
  const configContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/',  // Necesar pentru GitHub Pages
  server: {
    // Acest lucru va asigura că în dezvoltare locală, calea de bază este aceeași
    base: '/my-website/'
  }
})
`;
  
  try {
    fs.writeFileSync(viteConfigTs, configContent, 'utf8');
    console.log('✅ vite.config.ts a fost creat cu succes.');
  } catch (error) {
    console.error('❌ Eroare la crearea vite.config.ts:', error.message);
  }
}

console.log('Proces complet! Acum ar trebui să aveți doar fișierul vite.config.ts corect.');
