const fs = require('fs');
const path = require('path');

// Crează directorul dacă nu există
const publicImagesDir = path.resolve(__dirname, '../public/images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copiază imaginea din src/assets în public/images
const srcImagePath = path.resolve(__dirname, '../src/assets/cover.jpeg');
const destImagePath = path.resolve(__dirname, '../public/images/cover.jpeg');

try {
  if (fs.existsSync(srcImagePath)) {
    fs.copyFileSync(srcImagePath, destImagePath);
    console.log('✅ Imaginea a fost copiată cu succes în directorul public/images');
  } else {
    console.error('❌ Fișierul sursă nu există:', srcImagePath);
    
    // Creăm directorul pentru imagini în src/assets dacă nu există
    const srcAssetsDir = path.resolve(__dirname, '../src/assets');
    if (!fs.existsSync(srcAssetsDir)) {
      fs.mkdirSync(srcAssetsDir, { recursive: true });
      console.log('✅ Directorul src/assets a fost creat');
    }
    
    console.log('⚠️ Trebuie să pui imaginea cover.jpeg în directorul src/assets');
  }
} catch (error) {
  console.error('❌ Eroare la copierea imaginii:', error);
}
