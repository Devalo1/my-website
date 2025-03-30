import { execSync } from 'child_process';

// Porturile pe care le folosește aplicația noastră
const ports = [3000, 3001, 3002, 3003, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180];

console.log('🔥 Eliberare porturi pentru dezvoltare...');

try {
  if (process.platform === 'win32') {
    // Windows
    for (const port of ports) {
      try {
        execSync(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do taskkill /F /PID %a`, { stdio: 'ignore' });
        console.log(`✅ Port ${port} eliberat`);
      } catch (e) {
        console.log(`ℹ️ Portul ${port} nu este în uz`);
      }
    }
  } else {
    // Linux/Mac
    for (const port of ports) {
      try {
        execSync(`lsof -i :${port} -t | xargs kill -9`, { stdio: 'ignore' });
        console.log(`✅ Port ${port} eliberat`);
      } catch (e) {
        console.log(`ℹ️ Portul ${port} nu este în uz`);
      }
    }
  }
  console.log('✅ Toate porturile au fost eliberate!');
} catch (error) {
  console.error('❌ Eroare la eliberarea porturilor:', error);
}
