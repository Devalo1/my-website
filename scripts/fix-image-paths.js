import fs from 'fs';
import path from 'path';

// Function to check if a directory exists, create it if it doesn't
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// Function to copy a file if it exists at the source but not at the destination
function copyFileIfExists(sourcePath, destPath) {
  if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
    console.log(`Copying file from ${sourcePath} to ${destPath}`);
    fs.copyFileSync(sourcePath, destPath);
    return true;
  } else if (!fs.existsSync(sourcePath)) {
    console.log(`Source file doesn't exist: ${sourcePath}`);
    return false;
  }
  console.log(`Destination file already exists: ${destPath}`);
  return false;
}

// Main function to fix hero-bg.jpg path
function fixHeroBgImagePath() {
  const possibleSourcePaths = [
    path.resolve('public/images/placeholders/hero-bg.jpg'),
    path.resolve('src/images/placeholders/hero-bg.jpg'),
    path.resolve('src/assets/images/placeholders/hero-bg.jpg'),
    path.resolve('images/placeholders/hero-bg.jpg')
  ];

  const targetDirs = [
    path.resolve('public/images/placeholders'),
    path.resolve('dist/images/placeholders')
  ];

  // Ensure target directories exist
  targetDirs.forEach(dir => ensureDirectoryExists(dir));

  // Find the source file
  let sourceFile = null;
  for (const sourcePath of possibleSourcePaths) {
    if (fs.existsSync(sourcePath)) {
      sourceFile = sourcePath;
      break;
    }
  }

  if (!sourceFile) {
    console.log('Could not find hero-bg.jpg in any of the expected locations');
    
    // Create a placeholder image if needed
    const placeholderPath = path.resolve('public/images/placeholders/hero-bg.jpg');
    ensureDirectoryExists(path.dirname(placeholderPath));
    
    if (!fs.existsSync(placeholderPath)) {
      console.log('Creating a placeholder hero-bg.jpg');
      // Create a simple placeholder image (1x1 pixel transparent GIF)
      const placeholderContent = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      fs.writeFileSync(placeholderPath, placeholderContent);
      console.log(`Created placeholder at ${placeholderPath}`);
    }
    
    sourceFile = placeholderPath;
  }

  // Copy to target locations if needed
  for (const targetDir of targetDirs) {
    const targetPath = path.join(targetDir, 'hero-bg.jpg');
    copyFileIfExists(sourceFile, targetPath);
  }

  console.log('Image path fix completed');
}

// Run the function
fixHeroBgImagePath();
