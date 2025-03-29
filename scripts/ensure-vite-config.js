import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// În ES Modules nu avem __dirname, deci îl definim manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calea către fișierul vite.config.tsx
const configPath = path.resolve(__dirname, '..', 'vite.config.tsx');

// Verifică dacă fișierul există
if (fs.existsSync(configPath)) {
  console.log('Verificare vite.config.tsx...');
  
  // Citește conținutul fișierului
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verifică dacă conține deja configurația pentru base
  if (!configContent.includes("base: '/my-website/'")) {
    console.log('Adăugare configurație base pentru GitHub Pages...');
    
    // Găsește linia cu defineConfig și adaugă base
    configContent = configContent.replace(
      /defineConfig\(\s*{\s*/,
      "defineConfig({\n  base: '/my-website/', // Path pentru GitHub Pages\n  "
    );
    
    // Scrie modificările în fișier
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('vite.config.tsx a fost actualizat cu success!');
  } else {
    console.log('vite.config.tsx are deja configurația base: /my-website/');
  }
} else {
  console.log('EROARE: vite.config.tsx nu a fost găsit!');
  console.log('Creare fișier vite.config.tsx cu setări pentru GitHub Pages...');
  
  // Conținutul fișierului nou
  const newConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-website/', // Path pentru GitHub Pages
});
`;
  
  // Creare fișier nou
  fs.writeFileSync(configPath, newConfigContent, 'utf8');
  console.log('vite.config.tsx a fost creat cu success!');
}

console.log('Verificare completă!');
