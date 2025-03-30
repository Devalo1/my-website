// filepath: c:\Proiect\my-website\scripts\build.js
import { exec } from 'child_process';

console.log('Building project...');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});