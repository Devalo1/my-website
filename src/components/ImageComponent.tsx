import React from 'react';

interface ImageComponentProps {
  imageName: string;
  altText?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imageName, altText }) => {
  return (
    <div className="image-container">
      <img 
        src={`/images/${imageName}`} 
        alt={altText || 'Image description'} 
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          console.error(`Failed to load image: ${imageName}`);
          (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; // Fallback image
        }}
      />
    </div>
  );
};

export default ImageComponent;
