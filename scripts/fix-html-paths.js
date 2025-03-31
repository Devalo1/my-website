import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the HTML file in the dist directory
const htmlFilePath = path.join(__dirname, '..', 'dist', 'index.html');

console.log('Fixing HTML paths in:', htmlFilePath);

// Read the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading HTML file:', err);
    return;
  }

  // Replace any variable references in inline styles with direct paths
  let modifiedHtml = data.replace(/var\(--cover-url\)/g, "url('/my-website/images/cover.jpeg')");
  modifiedHtml = modifiedHtml.replace(/var\(--background-url\)/g, "url('/my-website/images/cover.jpeg')");
  
  // Add a direct style tag for the background image
  const styleTag = `
  <style>
    body {
      background-image: url('/my-website/images/cover.jpeg') !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      background-attachment: fixed !important;
    }
    
    .background-image {
      background-image: url('/my-website/images/cover.jpeg') !important;
    }
    
    .site-cover {
      background-image: url('/my-website/images/cover.jpeg') !important;
    }
    
    .home-container {
      background-image: url('/my-website/images/cover.jpeg') !important;
    }
  </style>
  `;
  
  // Insert the style tag after the opening head tag
  modifiedHtml = modifiedHtml.replace('<head>', '<head>' + styleTag);

  // Write the modified HTML back to the file
  fs.writeFile(htmlFilePath, modifiedHtml, 'utf8', (err) => {
    if (err) {
      console.error('Error writing HTML file:', err);
      return;
    }
    console.log('HTML file successfully updated with direct image paths');
  });
});
