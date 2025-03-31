import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => {
  const correctPath = '/my-website/images/cover.jpeg';

  return (
    <div className="background-container">
      {/* Folosim o imagine ca fundal în loc de video */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url('${correctPath}')` }}
      />
    </div>
  );
};

export default BackgroundVideo;
