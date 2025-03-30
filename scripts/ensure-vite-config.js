import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// În ES Modules nu avem __dirname, deci îl definim manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Ștergem fișierele de configurație nedorite
const unwantedConfigFiles = [
  'vite.config.js',
  'vite.config.tsx.tsx',
  'vite.config.tsx'
];

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
  }
});

// Verifică și asigură existența vite.config.ts corect
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
} else {
  // Verifică conținutul vite.config.ts existent
  console.log('Verificarea configurației în vite.config.ts...');
  
  let configContent = fs.readFileSync(viteConfigTs, 'utf8');
  let modified = false;
  
  // Verifică dacă conține configurația base pentru GitHub Pages
  if (!configContent.includes("base: '/my-website/'")) {
    console.log('Adăugare configurație base pentru GitHub Pages...');
    configContent = configContent.replace(
      /defineConfig\(\s*{\s*/,
      "defineConfig({\n  base: '/my-website/', // Necesar pentru GitHub Pages\n  "
    );
    modified = true;
  }
  
  // Verifică dacă conține configurația server pentru dezvoltare locală
  if (!configContent.includes("server: {")) {
    console.log('Adăugare configurație server pentru dezvoltare locală...');
    configContent = configContent.replace(
      /}\s*\)\s*$/,
      ",\n  server: {\n    base: '/my-website/'\n  }\n})"
    );
    modified = true;
  }
  
  // Salvează modificările dacă există
  if (modified) {
    fs.writeFileSync(viteConfigTs, configContent, 'utf8');
    console.log('✅ vite.config.ts a fost actualizat cu succes.');
  } else {
    console.log('vite.config.ts este deja corect configurat.');
  }
}

// Verifică fișierul vite.config.ts
try {
  console.log('Verificarea configurației în vite.config.ts...');
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  
  if (fs.existsSync(viteConfigPath)) {
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Verifică dacă există chei duplicate
    const baseCount = (viteConfig.match(/base:/g) || []).length;
    
    if (baseCount > 1) {
      console.log('⚠️ S-au detectat chei duplicate! Se repară configurația...');
      
      // Încearcă să repare configurația înlocuind-o complet
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
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    host: true,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  publicDir: 'public'
})`;
      
      fs.writeFileSync(viteConfigPath, newConfig);
      console.log('✅ vite.config.ts a fost reparat complet.');
    }
  }
} catch (error) {
  console.error('❌ Eroare la verificarea/actualizarea vite.config.ts:', error);
  process.exit(1);
}

console.log('Verificare completă!');
