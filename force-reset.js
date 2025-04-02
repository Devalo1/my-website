const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== RESETARE CONFIGURAȚIE VITE ===');

try {
  // Actualizăm configurația vite.config.ts
  const configPath = path.join(__dirname, 'vite.config.ts');
  let viteConfig = fs.readFileSync(configPath, 'utf8');
  
  // Asigurăm-ne că baza este setată corect
  if (!viteConfig.includes("base: '/'")) {
    viteConfig = viteConfig.replace(/base:.*['"][^'"]*['"],?/g, "");
    
    // Adăugăm base: '/' înainte de optimizeDeps
    if (viteConfig.includes('optimizeDeps')) {
      viteConfig = viteConfig.replace(
        /(\s*)(optimizeDeps)/,
        "$1// Calea de bază fixată pentru routing corect\n$1base: '/',\n$1$2"
      );
    } else {
      viteConfig = viteConfig.replace(
        /(\s*)\}\);/,
        "$1  // Calea de bază fixată pentru routing corect\n$1  base: '/',\n$1});"
      );
    }
    
    fs.writeFileSync(configPath, viteConfig, 'utf8');
    console.log('✅ Base path actualizat la: /');
  }
  
  // Forțăm portul 3000
  if (!viteConfig.includes('port: 3000')) {
    console.log('⚠️ Configurația portului 3000 lipsește sau este incorectă');
    
    if (viteConfig.includes('server:')) {
      viteConfig = viteConfig.replace(
        /server:\s*{([^}]*)}/,
        'server: {\n    port: 3000,\n    strictPort: true,\n    host: true,$1}'
      );
    } else {
      viteConfig = viteConfig.replace(
        /plugins:\s*\[[^\]]*\],/,
        'plugins: [react()],\n  server: {\n    port: 3000,\n    strictPort: true,\n    host: true\n  },'
      );
    }
    
    fs.writeFileSync(configPath, viteConfig, 'utf8');
    console.log('✅ Configurație port actualizată: 3000 (strict)');
  }
  
  console.log('\n=== CURĂȚARE ȘI RESETARE ===');

  // Terminăm procesele node.exe
  try {
    execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
  } catch (e) {
    console.log('Nu există procese node.exe active');
  }

  // Resetăm cache-ul
  console.log('Ștergere .vite din node_modules...');
  try {
    if (fs.existsSync(path.join(__dirname, 'node_modules', '.vite'))) {
      execSync('rmdir /s /q node_modules\\.vite', { stdio: 'inherit' });
    }
  } catch (e) {
    console.log('Nu s-a putut șterge .vite');
  }

  // Curățăm cache-ul npm
  console.log('Curățare cache npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  console.log('\n=== REPORNIRE SERVER ===');
  console.log('Serverul va porni la http://localhost:3000/ (fără /my-website/)');
  console.log('Pornire server...');
  
  execSync('npm run dev -- --force --port=3000 --strictPort', { stdio: 'inherit' });
} catch (error) {
  console.error(`\n❌ Eroare: ${error.message}`);
  console.log('\nÎncearcă să rulezi manual:');
  console.log('npm run dev -- --port=3000 --strictPort');
}
