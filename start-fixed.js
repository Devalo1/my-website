const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

console.log('===== PORNIREA APLICAȚIEI CU SETĂRI FIXE =====');

// Verificare port disponibil
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port)) && port < startPort + 100) {
    port++;
  }
  return port;
}

// Verificăm existența fișierelor esențiale
const essentialFiles = [
  { path: 'index.html', message: 'Fișierul index.html nu există. Acesta este necesar pentru o aplicație Vite.' },
  { path: 'package.json', message: 'Fișierul package.json nu există. Rulați "npm init" pentru a crea unul.' },
  { path: 'vite.config.js', required: false, message: 'Notă: vite.config.js nu există, dar nu este obligatoriu.' }
];

let missingRequired = false;
for (const file of essentialFiles) {
  const filePath = path.join(__dirname, file.path);
  if (!fs.existsSync(filePath)) {
    if (file.required !== false) {
      console.error(`EROARE: ${file.message}`);
      missingRequired = true;
    } else {
      console.warn(`AVERTISMENT: ${file.message}`);
    }
  }
}

if (missingRequired) {
  console.error('\nStructura proiectului Vite este incompletă. Verificați documentația: https://vitejs.dev/guide/');
  process.exit(1);
}

// Detectăm numele proiectului și configurăm base path-ul
let basePath = '/';
let projectName = '';

try {
  const packagePath = path.join(__dirname, 'package.json');
  let packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  projectName = packageJson.name || path.basename(__dirname);
  console.log(`Nume proiect detectat: ${projectName}`);
  
  // Ne asigurăm că scripturile sunt configurate corect
  let updated = false;
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
    updated = true;
  }
  
  // Detectăm fișierul de configurație Vite (TS sau JS)
  const viteConfigTsPath = path.join(__dirname, 'vite.config.ts');
  const viteConfigJsPath = path.join(__dirname, 'vite.config.js');
  const hasConfigTs = fs.existsSync(viteConfigTsPath);
  const hasConfigJs = fs.existsSync(viteConfigJsPath); 
  
  // Determinăm base path-ul din configurația Vite dacă există
  let configuredBasePath = null;
  if (hasConfigTs || hasConfigJs) {
    const configPath = hasConfigTs ? viteConfigTsPath : viteConfigJsPath;
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const basePathMatch = configContent.match(/base\s*:\s*['"]([^'"]+)['"]/);
      if (basePathMatch) {
        configuredBasePath = basePathMatch[1];
        console.log(`Base path găsit în ${path.basename(configPath)}: ${configuredBasePath}`);
      }
    } catch (e) {
      console.error(`Eroare la citirea fișierului de configurație Vite: ${e.message}`);
    }
  }
  
  // Folosim base path-ul din configurație dacă există, altfel bazat pe numele proiectului
  basePath = configuredBasePath || (projectName ? `/${projectName}/` : '/');
  
  console.log(`Base path final: "${basePath}"`);
  
  // Actualizăm scripturile pentru a folosi același base path
  const basePathConfig = `--base=${basePath}`;
  const portConfig = `--port=3000`;
  
  if (packageJson.scripts.build !== `vite build ${basePathConfig}`) {
    packageJson.scripts.build = `vite build ${basePathConfig}`;
    updated = true;
  }
  
  if (packageJson.scripts.dev !== `vite --host ${basePathConfig} ${portConfig}`) {
    packageJson.scripts.dev = `vite --host ${basePathConfig} ${portConfig}`;
    updated = true;
  }
  
  if (packageJson.scripts.preview && !packageJson.scripts.preview.includes('--base=')) {
    packageJson.scripts.preview = `vite preview ${basePathConfig}`;
    updated = true;
  }
  
  if (updated) {
    console.log('Actualizăm package.json cu scripturile corecte și base path consistent...');
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('package.json actualizat cu succes.');
  }
} catch (error) {
  console.error('Eroare la procesarea package.json:', error.message);
}

// Verificăm conținutul index.html pentru a ne asigura că are elementele de bază
try {
  const indexPath = path.join(__dirname, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (!indexContent.includes('<div id="app">') && !indexContent.includes('<div id="root">')) {
    console.warn('AVERTISMENT: index.html nu conține un element container (div#app sau div#root)');
  }
} catch (error) {
  console.error('Eroare la verificarea index.html:', error.message);
}

// Pornirea serverului Vite
(async () => {
  // Găsim un port disponibil începând cu 3000
  const preferredPort = 3000;
  const actualPort = await findAvailablePort(preferredPort);
  
  if (actualPort !== preferredPort) {
    console.log(`Portul ${preferredPort} este ocupat. Se folosește portul ${actualPort}.`);
  }

  // Verificăm dacă există un fișier de configurare Vite
  const viteConfigTsPath = path.join(__dirname, 'vite.config.ts');
  const viteConfigJsPath = path.join(__dirname, 'vite.config.js');
  const hasViteConfig = fs.existsSync(viteConfigTsPath) || fs.existsSync(viteConfigJsPath);
  
  console.log('\nPornire server Vite cu configurație' + (hasViteConfig ? ' extinsă' : ' forțată') + ':');
  console.log(`  - Port: ${actualPort} ${actualPort !== preferredPort ? '(alternativ)' : '(preferat)'}`);
  console.log(`  - Base URL: "${basePath}" ${projectName ? '(bazat pe numele proiectului)' : '(rădăcină)'}`);
  console.log('  - Host: toate interfețele');
  
  if (hasViteConfig) {
    console.log('  - Folosește configurația din fișierul vite.config.' + (fs.existsSync(viteConfigTsPath) ? 'ts' : 'js'));
  }

  console.log('\nDACĂ NU VEDEȚI SITE-UL:');
  console.log('1. Verificați că index.html există și are conținut valid');
  console.log('2. Verificați consola browserului pentru erori JavaScript');
  console.log('3. Verificați că aveți un fișier JavaScript principal referit în index.html');
  console.log('4. Asigurați-vă că aveți instalate toate dependențele cu "npm install"');
  console.log('5. Verificați că accesați URL-ul corect în browser (observați base path-ul de mai sus)');
  
  // Actualizăm și package.json pentru a adăuga portul preferat
  try {
    const packagePath = path.join(__dirname, 'package.json');
    let packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    let updated = false;
    
    // Adăugăm --port la scripturile existente dacă nu există deja
    const basePathConfig = `--base=${basePath}`;
    const portConfig = `--port=${preferredPort}`;
    
    if (packageJson.scripts && packageJson.scripts.dev && 
        !packageJson.scripts.dev.includes('--port=')) {
      packageJson.scripts.dev = `vite --host ${basePathConfig} ${portConfig}`;
      updated = true;
    }
    
    if (updated) {
      console.log('Actualizăm package.json pentru a include configurația portului...');
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('Eroare la actualizarea package.json:', error.message);
  }

  // Executăm comanda direct, dar respectăm configurația din fișier și suprascriem doar anumite setări
  const basePathArg = `--base=${basePath}`;
  const viteProcess = spawn('npx', [
    'vite',
    `--port=${actualPort}`,
    '--strictPort',
    basePathArg,
    '--host',
    '--clearScreen=false'
  ], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      // Forțăm utilizarea tuturor fișierelor statice
      VITE_COPY_PUBLIC_DIR: 'true',
      VITE_PRESERVE_SYMLINKS: 'true'
    }
  });

  viteProcess.on('error', (error) => {
    console.error('Eroare la pornirea Vite:', error.message);
  });

  viteProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Procesul Vite s-a închis cu codul: ${code}`);
    }
  });

  // Adăugăm un handler pentru SIGINT (Ctrl+C) pentru a închide procesul corect
  process.on('SIGINT', () => {
    viteProcess.kill('SIGINT');
    process.exit(0);
  });
})();
