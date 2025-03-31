import React, { useEffect, useState } from 'react';
import { verifyBackgroundImage } from '../utils/assetChecker';

// Try to import the background image, but handle the case if it's missing
let backgroundImage = '';
try {
  // We'll attempt to import from various locations
  backgroundImage = '/my-website/images/cover.jpeg';
} catch (error) {
  console.error('Error importing background image:', error);
}

const Background: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSource, setImageSource] = useState(backgroundImage);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verify and potentially fix background image on component mount
    verifyBackgroundImage(); // Remove unused variable
    console.log("Verificare background în component Background.tsx");
    
    // Try to load the image
    const img = new Image();
    img.onload = () => {
      console.log("Imaginea s-a încărcat cu succes în component Background.tsx!");
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Eroare la încărcarea imaginii în component Background.tsx!");
      setError("Nu s-a putut încărca imaginea de fundal");
      
      // Try fallback paths
      const fallbackPaths = [
        './images/cover.jpeg',
        '/images/cover.jpeg',
        '/my-website/images/cover.jpeg',
        '/my-website/background.jpg',
      ];
      
      // Try each fallback path
      let foundWorkingPath = false;
      fallbackPaths.forEach(path => {
        if (!foundWorkingPath) {
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            console.log(`Fallback image loaded successfully: ${path}`);
            setImageSource(path);
            setImageLoaded(true);
            setError(null);
            foundWorkingPath = true;
          };
          fallbackImg.src = path;
        }
      });
      
      // Listen for background image found event from assetChecker
      document.addEventListener(
        'backgroundImageFound',
        (e: Event) => {
          const customEvent = e as CustomEvent;
          console.log(customEvent.detail);
          const path = customEvent.detail?.path;
          if (path) {
            console.log(`Background image found from event: ${path}`);
            setImageSource(path);
            setImageLoaded(true);
            setError(null);
          }
        }
      );
    };
    img.src = imageSource;
    
    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('backgroundImageFound', () => {});
    };
  }, []);

  return (
    <>
      {error && (
        <div style={{
          color: 'red', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 999
        }}>
          Eroare: {error}
          <p>Încercați să adăugați imaginea cover.jpeg în directorul public/images</p>
        </div>
      )}
      
      {/* Use a gradient fallback if image isn't loaded */}
      {!imageLoaded && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #8b5a2b 0%, #6b4423 100%)',
          zIndex: -2
        }} />
      )}
      
      {/* Image will only be shown if loaded successfully */}
      <img 
        src={imageSource} 
        alt="Background" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          display: imageLoaded ? 'block' : 'none'
        }}
      />
      
      {/* Debug info */}
      <div style={{
        position: 'fixed', 
        bottom: 0, 
        right: 0, 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '5px', 
        fontSize: '12px',
        zIndex: 999,
        display: process.env.NODE_ENV === 'production' ? 'none' : 'block'
      }}>
        Status imagine: {imageLoaded ? 'Încărcată' : 'Încărcare...'}
        <br />
        Path: {imageSource}
      </div>
    </>
  );
};

export default Background;
