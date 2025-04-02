const fs = require('fs');
const path = require('path');

console.log('===== CORECTARE CONFIGURAȚIE VITE =====');
console.log('Acest script aliniază toate configurațiile de base path pentru proiect.\n');

// Obținem numele proiectului din package.json
let projectName = '';
try {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  projectName = packageJson.name || path.basename(__dirname);
  console.log(`Nume proiect detectat: ${projectName}`);
} catch (error) {
  console.error('Eroare la citirea package.json:', error.message);
  process.exit(1);
}

// Base path-ul care va fi folosit peste tot
const basePath = `/${projectName}/`;
console.log(`Se va folosi base path-ul: "${basePath}"`);

// Detectăm dacă proiectul folosește TypeScript (verifică vite.config.ts)
const viteConfigTsPath = path.join(__dirname, 'vite.config.ts');
const viteConfigJsPath = path.join(__dirname, 'vite.config.js');
const useTypeScript = fs.existsSync(viteConfigTsPath);
const configPath = useTypeScript ? viteConfigTsPath : viteConfigJsPath;

// Verificăm dacă există vreo configurație Vite
const hasViteConfig = useTypeScript || fs.existsSync(viteConfigJsPath);

if (hasViteConfig) {
  console.log(`Folosim configurația Vite în format ${useTypeScript ? 'TypeScript' : 'JavaScript'}`);
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    const baseRegex = /(base\s*:\s*)['"]([^'"]+)['"]/;
    
    if (baseRegex.test(configContent)) {
      // Înlocuim base path-ul existent
      const oldBasePath = configContent.match(baseRegex)[2];
      console.log(`Înlocuim base path în ${path.basename(configPath)}: "${oldBasePath}" -> "${basePath}"`);
      configContent = configContent.replace(baseRegex, `$1'${basePath}'`);
    } else {
      // Adăugăm configurația base path dacă nu există
      console.log(`Adăugăm configurație base path în ${path.basename(configPath)}`);
      
      // Verificăm dacă există un export default
      if (configContent.includes('export default')) {
        configContent = configContent.replace(
          /export default (\{|defineConfig\(\{)/,
          `export default $1\n  base: '${basePath}',`
        );
      } else {
        // Adăugăm un export default nou
        configContent += `\nexport default defineConfig({\n  base: '${basePath}'\n});\n`;
      }
    }
    
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log(`${path.basename(configPath)} actualizat cu succes.`);
    
    // Dacă există și cealaltă versiune de configurație, o ștergem pentru a evita conflictele
    if (fs.existsSync(viteConfigJsPath) && useTypeScript) {
      console.log(`Ștergem ${path.basename(viteConfigJsPath)} pentru a evita conflictele cu ${path.basename(viteConfigTsPath)}`);
      fs.unlinkSync(viteConfigJsPath);
    } else if (fs.existsSync(viteConfigTsPath) && !useTypeScript) {
      console.log(`Ștergem ${path.basename(viteConfigTsPath)} pentru a evita conflictele cu ${path.basename(viteConfigJsPath)}`);
      fs.unlinkSync(viteConfigTsPath);
    }
  } catch (error) {
    console.error(`Eroare la actualizarea ${path.basename(configPath)}: ${error.message}`);
  }
} else {
  // Creăm un nou fișier de configurație, preferând TypeScript dacă există fișiere .ts în proiect
  const hasTypeScript = fs.readdirSync(__dirname).some(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  const newConfigPath = hasTypeScript ? viteConfigTsPath : viteConfigJsPath;
  const configFormat = hasTypeScript ? 'TypeScript' : 'JavaScript';
  
  console.log(`Creăm un nou fișier ${path.basename(newConfigPath)} (format: ${configFormat})`);
  
  // Verificăm dacă proiectul folosește React
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const hasReact = packageJson.dependencies && (packageJson.dependencies.react || packageJson.devDependencies?.react);
  
  const reactPlugin = hasReact ? `\nimport react from '@vitejs/plugin-react'` : '';
  const pluginsConfig = hasReact ? `\n  plugins: [react()],` : '';
  
  const newConfig = `import { defineConfig } from 'vite'${reactPlugin}

// https://vitejs.dev/config/
export default defineConfig({${pluginsConfig}
  base: '${basePath}',
  
  // Ensure all static assets are properly served
  publicDir: 'public',
  
  // Adăugăm suport pentru fișierele statice (HTML, imagini, etc.)
  assetsInclude: ['**/*.html', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.mp3', '**/*.wav'],
  
  // Optimizări pentru build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    // Asigurăm că toate fișierele statice sunt copiate corect
    copyPublicDir: true
  },
  
  // Rezolvăm problemele cu rutarea SPA
  server: {
    historyApiFallback: true
  }
})
`;

  fs.writeFileSync(newConfigPath, newConfig, 'utf8');
  console.log(`${path.basename(newConfigPath)} creat cu succes.`);
  
  // Instalăm plugin-ul React dacă e necesar și nu e deja instalat
  if (hasReact && !packageJson.devDependencies?.['@vitejs/plugin-react']) {
    console.log('Instalăm plugin-ul React pentru Vite...');
    require('child_process').execSync('npm install -D @vitejs/plugin-react', { stdio: 'inherit' });
  }
}

// Actualizăm package.json
try {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  let updated = false;
  const basePathArg = `--base=${basePath}`;
  
  // Verificăm și actualizăm toate scripturile care folosesc vite
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach(scriptName => {
      const script = packageJson.scripts[scriptName];
      
      if (script.includes('vite')) {
        // Înlocuim --base=X existent sau adăugăm --base=X nou
        const baseRegex = /--base=[^\s]+/;
        if (baseRegex.test(script)) {
          const oldArg = script.match(baseRegex)[0];
          if (oldArg !== basePathArg) {
            packageJson.scripts[scriptName] = script.replace(baseRegex, basePathArg);
            updated = true;
          }
        } else {
          // Adăugăm --base=X la scriptul vite
          packageJson.scripts[scriptName] = script.replace('vite', `vite ${basePathArg}`);
          updated = true;
        }
      }
    });
  }
  
  if (updated) {
    console.log('Actualizăm package.json cu base path consistent...');
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('package.json actualizat cu succes.');
  } else {
    console.log('package.json este deja configurat corect.');
  }
} catch (error) {
  console.error('Eroare la actualizarea package.json:', error.message);
}

console.log('\nCONFIGURAȚIE FINALIZATĂ');
console.log('------------------------');
console.log('1. Acum toate configurațiile folosesc base path-ul consistent:');
console.log(`   - vite.config.js sau vite.config.ts: "${basePath}"`);
console.log(`   - Scripturi în package.json: "${basePath}"`);
console.log('2. Rulați acum:');
console.log('   - npm run build: pentru a construi aplicația cu noua configurație');
console.log('   - npm run dev: pentru a porni serverul de dezvoltare');
console.log('   - node start-fixed.js: pentru a porni serverul forțând configurația');
