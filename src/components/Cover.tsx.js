import React from 'react';
// Importăm direct imaginea
import coverImage from '../../public/images/cover.jpeg';

interface CoverProps {
  // Add appropriate props here
}

const Cover: React.FC<CoverProps> = (props) => {
  return (
    <div className="cover-container">
      <img 
        src={coverImage} 
        alt="Website Cover" 
        className="cover-image"
      />
      <div className="cover-overlay">
        <h1>Welcome to My Website</h1>
      </div>
    </div>
  );
};

export default Cover;
