import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/background.jpg';

const Background: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificăm dacă imaginea există la runtime
    console.log("Încercăm să încărcăm imaginea din:", backgroundImage);
    
    const img = new Image();
    img.onload = () => {
      console.log("Imaginea s-a încărcat cu succes!");
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Eroare la încărcarea imaginii!");
      setError("Nu s-a putut încărca imaginea de fundal");
    };
    img.src = backgroundImage;
  }, []);

  return (
    <>
      {error && (
        <div style={{color: 'red', position: 'fixed', top: 0, left: 0, padding: '10px'}}>
          Eroare: {error}
        </div>
      )}
      
      {/* Folosim CSS inline pentru a ne asigura că stilurile sunt aplicate */}
      <img 
        src={backgroundImage} 
        alt="Background" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      />
      
      {/* Debugger info */}
      <div style={{position: 'fixed', bottom: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', fontSize: '12px'}}>
        Status imagine: {imageLoaded ? 'Încărcată' : 'Încărcare...'}
      </div>
    </>
  );
};

export default Background;
