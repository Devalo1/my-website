import React from 'react';
import './BackgroundVideo.css';

interface BackgroundVideoProps {
  videoPath?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = () => {
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
