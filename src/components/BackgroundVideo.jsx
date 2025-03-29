import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => {
  return (
    <div className="background-container">
      {/* Folosim o imagine ca fundal în loc de video */}
      <div 
        className="background-image"
        style={{ backgroundImage: 'url(/images/cover.jpeg)' }}
      />
    </div>
  );
};

export default BackgroundVideo;
