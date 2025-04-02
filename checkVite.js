const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Verifică prezența fișierelor esențiale
function checkFiles() {
  const requiredFiles = [
    'index.html',
    'vite.config.ts',
    'src/main.tsx',
    'src/App.tsx',
    'src/styles/App.css',
    'src/styles/index.css'
  ];

  const missingFiles = [];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      missingFiles.push(file);
    }
  }
  
  return missingFiles;
}

// Verifică configurațiile Vite
function checkViteConfig() {
  try {
    const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
    const issues = [];
    
    if (!viteConfig.includes("base:")) {
      issues.push('Base path nu este configurat în vite.config.ts');
    }
    
    if (!viteConfig.includes("plugins: [react()]")) {
      issues.push('Plugin-ul React nu este configurat corect');
    }
    
    return issues;
  } catch (error) {
    return ['Nu s-a putut citi vite.config.ts: ' + error.message];
  }
}

// Rulează verificarea
function runCheck() {
  console.log('===== VERIFICARE CONFIGURAȚIE VITE =====');
  
  const missingFiles = checkFiles();
  if (missingFiles.length > 0) {
    console.error('❌ Fișiere lipsă:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
  } else {
    console.log('✅ Toate fișierele esențiale există');
  }
  
  const configIssues = checkViteConfig();
  if (configIssues.length > 0) {
    console.error('❌ Probleme cu vite.config.ts:');
    configIssues.forEach(issue => console.error(`   - ${issue}`));
  } else {
    console.log('✅ Configurația Vite pare corectă');
  }
  
  console.log('\n===== INFORMAȚII DESPRE PACHETE =====');
  try {
    const packageInfo = execSync('npm list vite react react-dom').toString();
    console.log(packageInfo);
  } catch (error) {
    console.error('❌ Nu s-a putut obține informații despre pachete:', error.message);
  }
  
  console.log('\n===== SUGESTII =====');
  if (missingFiles.length > 0 || configIssues.length > 0) {
    console.log('1. Rulează "npm run reinstall" pentru a reinstala și reconfigura proiectul');
    console.log('2. Asigură-te că toate fișierele necesare au conținutul corect');
    console.log('3. Verifică package.json să aibă scripturile "start", "dev" și "build" configurate pentru Vite');
  } else {
    console.log('Configurația pare corectă. Încearcă următoarele:');
    console.log('1. Rulează "npm run dev" sau "npm start" pentru a porni serverul de dezvoltare');
    console.log('2. Deschide http://localhost:3000 (nu 5173/my-website)');
    console.log('3. Verifică consola browserului pentru erori');
  }
}

runCheck();
