import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the public images directory
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const distImagesDir = path.join(__dirname, '..', 'dist', 'images');

// Ensure the images directories exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

if (!fs.existsSync(distImagesDir)) {
  fs.mkdirSync(distImagesDir, { recursive: true });
  console.log(`Created directory: ${distImagesDir}`);
}

// Path to the cover images
const publicCoverPath = path.join(imagesDir, 'cover.jpeg');
const distCoverPath = path.join(distImagesDir, 'cover.jpeg');

// Create a fallback SVG image content
const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <rect width="100%" height="100%" fill="#8b5a2b"/>
  <text x="50%" y="50%" font-family="Arial" font-size="48" text-anchor="middle" fill="white">Background Image</text>
</svg>`;

// Check and handle public directory image
if (!fs.existsSync(publicCoverPath)) {
  console.log('Cover image not found in public directory. Creating a fallback...');
  fs.writeFileSync(path.join(imagesDir, 'cover.svg'), fallbackSvg);
  console.log(`SVG fallback created in public directory`);
} else {
  console.log(`Cover image found in public directory: ${publicCoverPath}`);
}

// Ensure the image exists in the dist directory too
if (!fs.existsSync(distCoverPath)) {
  console.log('Cover image not found in dist directory. Copying or creating...');
  
  if (fs.existsSync(publicCoverPath)) {
    // Copy from public to dist if available
    fs.copyFileSync(publicCoverPath, distCoverPath);
    console.log(`Copied cover.jpeg from public to dist directory`);
  } else {
    // Create the SVG in dist directory
    fs.writeFileSync(path.join(distImagesDir, 'cover.svg'), fallbackSvg);
    console.log(`SVG fallback created in dist directory`);
  }
}

console.log('Cover image verification completed');
