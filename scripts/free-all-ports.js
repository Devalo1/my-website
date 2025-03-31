/**
 * Aggressive Port Cleanup Utility - Release ALL Vite development ports
 */
import { execSync } from 'child_process';

// All common ports used by Vite
const VITE_PORTS = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 5173];

console.log('🔥 AGGRESSIVE PORT CLEANUP - Terminating ALL Vite processes on common ports...');

try {
  // First, try to kill all node processes (more aggressive)
  try {
    console.log('\n🔄 Attempting to terminate all Node.js processes...');
    execSync('taskkill /F /IM node.exe', { stdio: 'pipe' });
    console.log('✅ Successfully terminated all Node.js processes');
  } catch (error) {
    console.log('⚠️ Could not terminate all Node.js processes. Will try individual ports...');
  }

  // Then check each port individually to make sure
  VITE_PORTS.forEach(port => {
    try {
      console.log(`\nTerminating processes using port ${port}...`);
      
      // Find process using the port
      const findCommand = `netstat -ano | findstr :${port} | findstr LISTENING`;
      const result = execSync(findCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      
      if (result && result.trim()) {
        // Extract PID from the result - only proceed if we have a valid PID
        const lines = result.split('\n').filter(line => line.includes(`LISTENING`));
        
        if (lines.length > 0) {
          const processedPIDs = new Set(); // Track PIDs we've already processed
          
          lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            
            // Skip if we've already processed this PID
            if (pid && !processedPIDs.has(pid)) {
              processedPIDs.add(pid);
              
              console.log(`Port ${port} is in use by process ID: ${pid}`);
              
              try {
                // Just terminate the process without checking what it is
                execSync(`taskkill /F /PID ${pid}`, { encoding: 'utf8', stdio: 'pipe' });
                console.log(`✅ Successfully terminated process ${pid} using port ${port}`);
              } catch (killError) {
                console.error(`❌ Failed to terminate process on port ${port}:`, killError.message);
              }
            }
          });
        }
      } else {
        console.log(`✅ Port ${port} is already free`);
      }
    } catch (portError) {
      // Port is probably free
      console.log(`✅ Port ${port} is free`);
    }
  });
  
  console.log('\n✅ Aggressive port cleanup completed');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('\n❌ Error while freeing ports:', error.message);
}
