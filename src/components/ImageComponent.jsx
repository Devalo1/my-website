import React from 'react';

const ImageComponent = ({ imageName, altText }) => {
  return (
    <div className="image-container">
      <img 
        src={`/images/${imageName}`} 
        alt={altText || 'Image description'} 
        onError={(e) => {
          console.error(`Failed to load image: ${imageName}`);
          e.target.src = '/images/placeholder.jpg'; // Fallback image
        }}
      />
    </div>
  );
};

export default ImageComponent;
