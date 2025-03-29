import React from 'react';
import backgroundImageUrl from '../assets/background.jpg?url';

console.log('URL-ul imaginii:', backgroundImageUrl);

const ImportedBackground = () => {
  return (
    <div style={{
      backgroundImage: `url(${backgroundImageUrl})`,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
    </div>
  );
};

export default ImportedBackground;
