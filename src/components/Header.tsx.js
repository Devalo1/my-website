import React from 'react';
// Importăm direct imaginea (calea poate varia în funcție de structura proiectului)
import coverImage from '../../public/images/cover.jpeg';

interface HeaderProps {
  // Add appropriate props here
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <div className="site-cover" style={{backgroundImage: `url(${coverImage})`}}>
        <div className="cover-content">
          <h1>Welcome to My Website</h1>
          {/* You can add more content here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
