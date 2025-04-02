const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== REPARARE DEPENDENȚE REACT ===');

// Verifică dacă există erori în package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('✅ package.json este valid');
  
  // Verifică versiunile React
  const reactVersion = packageJson.dependencies.react;
  const reactDomVersion = packageJson.dependencies['react-dom'];
  
  console.log(`Versiune React: ${reactVersion}`);
  console.log(`Versiune React DOM: ${reactDomVersion}`);
  
  // Sugerează modificări dacă versiunile nu sunt fixate
  if (reactVersion.startsWith('^') || reactDomVersion.startsWith('^')) {
    console.log('⚠️ Recomandare: Fixează versiunile React la 18.2.0');
    
    // Actualizează package.json
    packageJson.dependencies.react = '18.2.0';
    packageJson.dependencies['react-dom'] = '18.2.0';
    
    // Scrie înapoi în fișier
    fs.writeFileSync(
      path.join(__dirname, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );
    
    console.log('✅ package.json actualizat cu versiuni fixe pentru React');
  }
} catch (error) {
  console.error('❌ Eroare la procesarea package.json:', error.message);
}

// Repararea dependențelor
console.log('\n=== REPARAREA DEPENDENȚELOR ===');
console.log('Ștergere node_modules și package-lock.json...');

try {
  // Ștergere node_modules și package-lock.json
  if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
  }
  
  if (fs.existsSync(path.join(__dirname, 'package-lock.json'))) {
    execSync('del package-lock.json', { stdio: 'inherit' });
  }
  
  // Curățare cache npm
  console.log('Curățare cache npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Instalare dependențe
  console.log('Instalare dependențe...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Verificare instalare
  console.log('\n=== VERIFICARE INSTALARE ===');
  execSync('npm list react react-dom', { stdio: 'inherit' });
  
  console.log('\n✅ Reparare finalizată. Încearcă să pornești aplicația:');
  console.log('  npm run dev');
} catch (error) {
  console.error(`❌ Eroare în timpul reparării: ${error.message}`);
}
