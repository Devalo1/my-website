const express = require('express');
const path = require('path');
const fs = require('fs');

// Determinăm numele proiectului pentru base path
let projectName = '';
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  projectName = packageJson.name || path.basename(__dirname);
} catch (error) {
  console.error('Eroare la citirea package.json:', error.message);
  process.exit(1);
}

const basePath = `/${projectName}/`;
const app = express();
const port = process.env.PORT || 3000;

// Verificăm dacă aplicația a fost construită
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('Eroare: Directorul "dist" nu există. Rulați mai întâi "npm run build".');
  process.exit(1);
}

console.log(`Servim aplicația de la base path: ${basePath}`);

// Servim fișierele statice din dist cu base path
app.use(basePath, express.static(distDir));

// Pentru SPA, toate căile necunoscute trimit către index.html
app.get(`${basePath}*`, (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Redirecționăm rădăcina către base path
app.get('/', (req, res) => {
  res.redirect(basePath);
});

// Pornire server
app.listen(port, '0.0.0.0', () => {
  console.log(`===== SERVER PENTRU TESTAREA APLICAȚIEI =====`);
  console.log(`Server pornit la adresa:`);
  console.log(`  - Local: http://localhost:${port}${basePath}`);
  console.log(`  - Network: http://<ip-local>:${port}${basePath}`);
  console.log(`\nPentru a opri serverul: Ctrl+C`);
});
