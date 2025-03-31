// This script prevents Sharp installation errors on Netlify by skipping it in CI

if (process.env.NETLIFY === 'true') {
  console.log('⚠️ Running on Netlify - setting up environment to avoid Sharp installation issues');
  process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = "1";
  process.env.DISABLE_SHARP = "true";
  
  // For debugging
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
}

// Ensure the script exits successfully without referencing cmd.exe
process.exit(0);
