/**
 * Create Placeholder Images
 * This script generates placeholder images for critical missing files
 * Note: Since we can't directly create binary images, this creates data URLs
 * that can be used as a temporary measure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🖼️ Creating placeholder images...');

// Images to create
const requiredImages = [
  {
    path: 'public/images/cover.jpeg',
    width: 1920,
    height: 1080,
    color: '#8b5a2b',
    text: 'Lupul și Corbul - Background'
  },
  {
    path: 'public/images/Logo.png',
    width: 300,
    height: 100,
    color: '#6b4423',
    text: 'LOGO'
  }
];

// Create HTML files with data URLs as placeholders
requiredImages.forEach(image => {
  const fullPath = path.join(rootDir, image.path);
  const dirPath = path.dirname(fullPath);
  const htmlPath = `${fullPath}.html`;
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Create HTML placeholder
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Placeholder Image: ${path.basename(image.path)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
    }
    .container {
      text-align: center;
    }
    .placeholder {
      width: ${image.width}px;
      height: ${image.height}px;
      background-color: ${image.color};
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
    .instructions {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      margin-top: 0;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      overflow: auto;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="placeholder">${image.text}</div>
    <div class="instructions">
      <h1>Missing Image: ${path.basename(image.path)}</h1>
      <p>This is a placeholder for the missing image. Please create an actual image file at this location:</p>
      <pre>${image.path}</pre>
      <p>Recommended dimensions: ${image.width}x${image.height} pixels</p>
      <p>You can save this colored rectangle as an image by taking a screenshot.</p>
      <p><strong>Or you can use a placeholder service:</strong></p>
      <pre>https://via.placeholder.com/${image.width}x${image.height}/${image.color.replace('#', '')}/FFFFFF?text=${encodeURIComponent(image.text)}</pre>
    </div>
  </div>
</body>
</html>
`;

  fs.writeFileSync(htmlPath, html);
  console.log(`✅ Created HTML placeholder for ${image.path}`);
  
  // Create a placeholder.txt file with instructions
  const txtPath = `${fullPath}.placeholder.txt`;
  const instructions = `PLACEHOLDER FOR: ${path.basename(image.path)}
This is a placeholder file. Please replace with an actual image file.
Recommended dimensions: ${image.width}x${image.height} pixels

You can create a simple image at: https://placeholder.com/
Example URL: https://via.placeholder.com/${image.width}x${image.height}/${image.color.replace('#', '')}/FFFFFF?text=${encodeURIComponent(image.text)}

Alternatively, open the HTML file at ${path.basename(htmlPath)} in your browser and take a screenshot.
`;

  fs.writeFileSync(txtPath, instructions);
  console.log(`✅ Created instructions for ${image.path}`);
});

console.log('\n🎨 Placeholder images created successfully!');
console.log('Open the .html files in your browser to see the placeholders.');
console.log('Take a screenshot of the colored rectangles to create temporary images.');
