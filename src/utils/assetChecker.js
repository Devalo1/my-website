/**
 * Acest utilitar ajută la verificarea încărcării corecte a imaginilor
 */
export function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log(`Imaginea ${imagePath} s-a încărcat cu succes!`);
      resolve(true);
    };
    img.onerror = () => {
      console.error(`EROARE: Imaginea ${imagePath} nu s-a putut încărca!`);
      resolve(false);
    };
    img.src = imagePath;
  });
}

/**
 * Verifică dacă background.jpg există
 */
export function verifyBackgroundImage() {
  // Încearcă să încarce imaginea folosind URL direct
  const img = new Image();
  img.onload = () => console.log('Imaginea de fundal s-a încărcat cu succes!');
  img.onerror = () => console.error('EROARE: Imaginea de fundal nu a putut fi încărcată!');
  
  // Încearcă mai multe căi posibile
  const paths = [
    './assets/background.jpg',
    '/assets/background.jpg',
    '/my-website/assets/background.jpg'
  ];
  
  paths.forEach(path => {
    const testImg = new Image();
    testImg.onload = () => console.log(`Calea ${path} funcționează!`);
    testImg.onerror = () => console.error(`Calea ${path} nu funcționează!`);
    testImg.src = path;
  });
}
