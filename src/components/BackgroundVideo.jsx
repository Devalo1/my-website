import React from 'react';
import './BackgroundVideo.css';

const BackgroundImage = () => {
  // Detectează platforma pentru a adapta path-ul resurselor
  const isProduction = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('127.0.0.1');
  
  // Determină baza URL-ului
  const baseUrl = isProduction ? 
    (window.location.hostname.includes('github.io') ? '/my-website' : '') : 
    '/my-website';

  return (
    <div className="background-container">
      <div 
        className="background-image image-only"
        style={{ backgroundImage: `url('${baseUrl}/images/cover.jpeg')` }}
      ></div>
      
      {/* Container pentru conținut - NU adăugați nimic aici */}
      <div className="content-container"></div>
    </div>
  );
};

export default BackgroundImage;
