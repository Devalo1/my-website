const fs = require('fs');
const path = require('path');

// Directorii care trebuie create
const directories = [
  'public/images',
  'public/sounds',
  'src/assets',
  'src/components'
];

// Creare directoare
directories.forEach(dir => {
  const fullPath = path.resolve(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Director creat: ${dir}`);
  } else {
    console.log(`ℹ️ Directorul există deja: ${dir}`);
  }
});

// Creare fișier imagine placeholder dacă nu există
const placeholderImage = path.resolve(__dirname, '../public/images/placeholder.jpeg');
if (!fs.existsSync(placeholderImage)) {
  // Creăm o imagine placeholder de 1x1 pixel (foarte mică)
  const base64Img = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gODAK/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8AwKKKK6z//9k=';
  const data = base64Img.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(placeholderImage, Buffer.from(data, 'base64'));
  console.log(`✅ Imagine placeholder creată: public/images/placeholder.jpeg`);
} else {
  console.log(`ℹ️ Imaginea placeholder există deja`);
}

// Creare fișier sunet placeholder dacă nu există
const placeholderSound = path.resolve(__dirname, '../public/sounds/click.mp3');
if (!fs.existsSync(placeholderSound)) {
  // Creăm un fișier MP3 simplu
  // Acest cod doar creează un fișier gol, nu este un MP3 real
  fs.writeFileSync(placeholderSound, Buffer.from(''));
  console.log(`✅ Sunet placeholder creat: public/sounds/click.mp3`);
} else {
  console.log(`ℹ️ Sunetul placeholder există deja`);
}

// Copiere imagine din src/assets la public/images dacă există
const srcImage = path.resolve(__dirname, '../src/assets/cover.jpeg');
const destImage = path.resolve(__dirname, '../public/images/cover.jpeg');

if (fs.existsSync(srcImage)) {
  fs.copyFileSync(srcImage, destImage);
  console.log(`✅ Imaginea cover.jpeg a fost copiată din src/assets în public/images`);
} else {
  // Dacă nu există, copiem imaginea placeholder
  fs.copyFileSync(placeholderImage, destImage);
  console.log(`⚠️ Imaginea cover.jpeg nu există în src/assets, s-a folosit imaginea placeholder`);
}

// Adăugăm generare de imagini placeholder pentru produse
const productPlaceholders = [
  { name: 'product1.jpg', color: '#f5e6d3' },
  { name: 'product2.jpg', color: '#e8d5c4' },
  { name: 'product3.jpg', color: '#d7c4b3' }
];

// Funcție pentru a crea o imagine placeholder colorată de 300x300 pixeli
const createColorPlaceholder = (path, color) => {
  // Creează un fișier SVG simplu care va servi ca imagine placeholder
  const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="${color}" />
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#6b4423" text-anchor="middle">Imagine Produs</text>
</svg>`;
  
  fs.writeFileSync(path, svgContent);
};

// Creăm placeholder-uri pentru produse
productPlaceholders.forEach(product => {
  const productPath = path.resolve(__dirname, `../public/images/${product.name}`);
  if (!fs.existsSync(productPath)) {
    createColorPlaceholder(productPath, product.color);
    console.log(`✅ Imagine placeholder pentru produs creată: public/images/${product.name}`);
  } else {
    console.log(`ℹ️ Imaginea pentru produs există deja: ${product.name}`);
  }
});

console.log(`
✅ Configurarea proiectului a fost finalizată!

Pași următori:
1. Adaugă imaginea cover.jpeg în directorul src/assets
2. Adaugă un video background.mov în directorul public/images (opțional)
3. Rulează npm run dev pentru a porni serverul de dezvoltare

Pentru a construi versiunea pentru producție:
- npm run build-github (pentru GitHub Pages)
- npm run build-netlify (pentru Netlify)
`);
