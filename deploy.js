const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===== PROCESUL DE DEPLOYMENT AL APLICAȚIEI =====');
console.log('Acest script construiește aplicația, corectează căile și pregătește distribuția.\n');

// Funcție pentru executarea comenzilor shell
function runCommand(command, description) {
  console.log(`\n> ${description}...`);
  console.log(`$ ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Eroare la executarea comenzii: ${error.message}`);
    return false;
  }
}

// Funcție pentru copierea recursivă a directorului
function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      copyFolderRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  Copiat: ${path.relative(__dirname, sourcePath)}`);
    }
  });
}

// Funcție pentru corectarea căilor în HTML
function fixHtmlPaths(filePath, basePath) {
  if (!fs.existsSync(filePath)) return;
  
  let html = fs.readFileSync(filePath, 'utf8');
  const originalHtml = html;
  
  // Corectăm referințele la CSS și JS
  html = html.replace(/(href|src)="(?!https?:\/\/|\/\/|mailto:|tel:|data:|#{3}|\/lupul-si-corbul\/)(.*?)"/g, 
                      `$1="${basePath}$2"`);
  
  // Exceptăm link-urile care încep deja cu basePath
  html = html.replace(new RegExp(`(href|src)="${basePath}${basePath}`, 'g'), 
                      `$1="${basePath}`);
  
  if (html !== originalHtml) {
    fs.writeFileSync(filePath, html);
    console.log(`  Corectat referințe în: ${path.relative(__dirname, filePath)}`);
  }
}

// Pasul 1: Actualizarea configurațiilor
console.log('PASUL 1: ACTUALIZAREA CONFIGURAȚIILOR');
if (runCommand('node fix-config.js', 'Actualizarea configurațiilor Vite')) {
  console.log('Configurații actualizate cu succes!');
} else {
  console.error('Eroare la actualizarea configurațiilor. Încercăm să continuăm oricum...');
}

// Pasul 2: Construirea aplicației
console.log('\nPASUL 2: CONSTRUIREA APLICAȚIEI');
if (!runCommand('npm run build', 'Construirea aplicației')) {
  console.error('Eroare la construirea aplicației. Procesul de deployment se va opri.');
  process.exit(1);
}

// Pasul 3: Copierea fișierelor statice suplimentare
console.log('\nPASUL 3: COPIEREA FIȘIERELOR STATICE');

// Obținem numele proiectului și basePath
let projectName = '';
let basePath = '/';
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  projectName = packageJson.name || path.basename(__dirname);
  basePath = `/${projectName}/`;
} catch (error) {
  console.error('Eroare la citirea package.json:', error.message);
}

// Directoarele care trebuie copiate
const staticDirs = ['public', 'assets', 'images', 'sounds', 'scripts'];
const distDir = path.join(__dirname, 'dist');

// Creăm directorul dist dacă nu există
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copiem directoarele statice
console.log('Copierea directoarelor statice:');
staticDirs.forEach(dir => {
  const sourceDir = path.join(__dirname, dir);
  const targetDir = path.join(distDir, dir);
  
  if (fs.existsSync(sourceDir)) {
    console.log(`\n> Copierea directorului ${dir}:`);
    copyFolderRecursive(sourceDir, targetDir);
  }
});

// Copiem fișierele HTML (exceptând index.html care e deja generat)
const htmlFiles = fs.readdirSync(__dirname).filter(file => 
  file.endsWith('.html') && file !== 'index.html'
);

if (htmlFiles.length > 0) {
  console.log('\n> Copierea fișierelor HTML suplimentare:');
  htmlFiles.forEach(file => {
    const source = path.join(__dirname, file);
    const target = path.join(distDir, file);
    fs.copyFileSync(source, target);
    console.log(`  Copiat: ${file}`);
    
    // Corectăm căile în fișierele HTML
    fixHtmlPaths(target, basePath);
  });
}

// Pasul 4: Verificarea fișierelor din dist și corectarea căilor
console.log('\nPASUL 4: VERIFICAREA ȘI CORECTAREA CĂILOR ÎN FIȘIERELE DIN DIST');

// Corectăm căile în index.html din dist
const indexHtmlPath = path.join(distDir, 'index.html');
fixHtmlPaths(indexHtmlPath, basePath);

// Verificăm toate fișierele HTML din dist recursiv
function processHtmlFilesInDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processHtmlFilesInDir(filePath);
    } else if (file.endsWith('.html')) {
      fixHtmlPaths(filePath, basePath);
    }
  });
}

processHtmlFilesInDir(distDir);

// Pasul 5: Adăugarea unui fișier .htaccess pentru SPA routing (pentru Apache)
console.log('\nPASUL 5: ADĂUGAREA FIȘIERULUI .HTACCESS PENTRU SPA ROUTING');
const htaccessContent = `# Activează motorul de rescriere
RewriteEngine On

# Dacă calea nu este un fișier sau director existent
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirecționează toate request-urile către index.html
RewriteRule ^(.*)$ ${basePath}index.html [QSA,L]
`;

fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
console.log('Fișier .htaccess creat pentru SPA routing.');

// Pasul 6: Crearea unui server de test pentru directorul dist
console.log('\nPASUL 6: CREAREA UNUI SERVER DE TEST');

// Creăm un fișier server.js în directorul dist
const serverContent = `const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Setăm base path-ul aplicației
const basePath = '${basePath}';

// Servim fișierele statice
app.use(basePath, express.static(__dirname));

// Pentru SPA, toate căile necunoscute trimit către index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(\`Server de test pornit la http://localhost:\${port}\${basePath}\`);
  console.log(\`Pentru a accesa de pe alte dispozitive: http://IP_LOCAL:\${port}\${basePath}\`);
});
`;

fs.writeFileSync(path.join(distDir, 'server.js'), serverContent);
console.log('Fișier server.js creat pentru testarea distribuției.');

// Pasul 7: Testarea opțională și instrucțiuni finale
console.log('\n===== DEPLOYMENT FINALIZAT CU SUCCES! =====');
console.log('\nPentru a testa distribuția:');
console.log('1. Instalați express: npm install express -g');
console.log(`2. Navigați în directorul dist: cd ${path.relative(process.cwd(), distDir)}`);
console.log('3. Porniți serverul: node server.js');
console.log(`4. Accesați aplicația în browser: http://localhost:5000${basePath}`);

console.log('\nPentru a verifica trimiterea pe un server de producție:');
console.log('1. Verificați ca toate căile din fișierele HTML să aibă prefixul corect.');
console.log(`2. Asigurați-vă că serverul este configurat pentru a servi aplicația la baza "${basePath}".`);
console.log('3. Pentru servere Apache, .htaccess-ul generat ar trebui să gestioneze corect rutarea SPA.');
console.log('4. Pentru alte servere (nginx, etc.), va trebui să configurați rutarea manual.');

console.log('\nAcum puteți copia întregul conținut al directorului "dist" pe serverul de producție.');
