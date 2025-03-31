/**
 * Port management utility - Release ports used by Vite
 */
import { execSync } from 'child_process';

// Common ports used by Vite
const VITE_PORTS = [3000, 3001, 3002, 3003, 3004, 3005];

console.log('🔍 Checking for processes using Vite development ports...');

try {
  // Windows command to find processes using the ports
  VITE_PORTS.forEach(port => {
    try {
      console.log(`\nChecking port ${port}...`);
      
      // Find process using the port
      const findCommand = `netstat -ano | findstr :${port} | findstr LISTENING`;
      const result = execSync(findCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      
      if (result.trim()) {
        // Extract PID from the result - only proceed if we have a valid PID
        const lines = result.split('\n').filter(line => line.includes(`LISTENING`));
        
        if (lines.length > 0) {
          const processedPIDs = new Set(); // Track PIDs we've already processed
          
          lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            
            // Skip if we've already processed this PID
            if (processedPIDs.has(pid)) return;
            processedPIDs.add(pid);
            
            console.log(`Port ${port} is in use by process ID: ${pid}`);
            
            try {
              // Get process name
              const tasklistCommand = `tasklist /fi "PID eq ${pid}" /fo list`;
              const taskInfo = execSync(tasklistCommand, { encoding: 'utf8' });
              console.log(`Process details:\n${taskInfo}`);
              
              if (taskInfo.includes('node.exe') || taskInfo.includes('vite')) {
                // Terminate the process
                console.log(`Terminating process ${pid}...`);
                execSync(`taskkill /F /PID ${pid}`, { encoding: 'utf8' });
                console.log(`✅ Successfully released port ${port}`);
              } else {
                console.log(`⚠️ Process is not a Node.js or Vite process, skipping termination`);
              }
            } catch (killError) {
              // Skip error message for process not found (already terminated)
              if (!killError.message.includes('not found')) {
                console.error(`❌ Failed to terminate process on port ${port}:`, killError.message);
              }
            }
          });
        } else {
          console.log(`No LISTENING process found on port ${port}`);
        }
      } else {
        console.log(`✅ Port ${port} is free`);
      }
    } catch (portError) {
      // No error needed if command returns empty (port is free)
      if (portError.status !== 1) {
        console.log(`✅ Port ${port} is free`);
      } else {
        console.error(`Error checking port ${port}:`, portError.message);
      }
    }
  });
  
  console.log('\n✅ Port check and cleanup completed');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('\n❌ Error while checking ports:', error.message);
}
