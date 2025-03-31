import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="main-header">
      <nav className="navigation">
        <div className="nav-container">
          <div className="logo">
            <Link to="/">Lupul și Corbul</Link>
          </div>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Meniu">
            ☰
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/acasa">Acasă</Link></li>
            <li><Link to="/produse">Produse</Link></li>
            <li><Link to="/despre-noi">Despre Noi</Link></li>
            <li><Link to="/terapie">Terapie</Link></li>
            <li><Link to="/ong">ONG</Link></li>
            <li><Link to="/lupul-si-corbul">Lupul și Corbul</Link></li>
            <li><Link to="/consiliere">Consiliere</Link></li>
            <li><Link to="/psihoterapie">Psihoterapie</Link></li>
            <li><Link to="/terapia-personalizata">Terapia Personalizată</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
