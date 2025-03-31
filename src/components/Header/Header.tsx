import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="main-header">
      <div className="logo-container">
        <Link to="/">
          <img src="/my-website/images/Logo.svg" alt="Lupul și Corbul" className="logo" />
        </Link>
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Meniu">
        <span>☰</span>
      </button>
      
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" className={isActive('/')}>Acasă</Link></li>
          <li><Link to="/products" className={isActive('/products')}>Produse</Link></li>
          <li><Link to="/ong" className={isActive('/ong')}>Făuritorii de Destin</Link></li>
          <li><Link to="/therapy" className={isActive('/therapy')}>Terapie Personalizată</Link></li>
          <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
        </ul>
      </nav>
      
      <div className="user-actions">
        <button id="profile-button-v7" className="icon-button" aria-label="Profil">
          <img src="/my-website/images/profi.png" alt="Profil" />
        </button>
        <button className="icon-button" aria-label="Coș">
          <img src="/my-website/images/bag.png" alt="Coș" />
        </button>
      </div>
    </header>
  );
};

export default Header;
