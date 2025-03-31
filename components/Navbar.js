import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (index) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="logo-img" />
        </Link>
      </div>
      
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      
      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <Link href="/" className="nav-links">
            Acasă
          </Link>
        </li>
        <li className={`nav-item ${isActive('/produse') ? 'active' : ''}`}>
          <Link href="/produse" className="nav-links">
            Produse
          </Link>
        </li>
        <li className={`nav-item ${isActive('/despre-noi') ? 'active' : ''}`}>
          <Link href="/despre-noi" className="nav-links">
            Despre Noi
          </Link>
        </li>
        <li className={`nav-item ${router.pathname.includes('/terapie') ? 'active' : ''} ${activeSubmenu === 0 ? 'open' : ''}`}>
          <div className="nav-links" onClick={() => toggleSubmenu(0)}>
            Terapie
          </div>
          <ul className="submenu">
            <li className="submenu-item">
              <Link href="/terapie/consiliere" className="nav-links">
                Consiliere
              </Link>
            </li>
            <li className="submenu-item">
              <Link href="/terapie/psihoterapie" className="nav-links">
                Psihoterapie
              </Link>
            </li>
            <li className="submenu-item">
              <Link href="/terapie/personalizata" className="nav-links">
                Terapia Personalizată
              </Link>
            </li>
          </ul>
        </li>
        <li className={`nav-item ${isActive('/ong') ? 'active' : ''}`}>
          <Link href="/ong" className="nav-links">
            ONG
          </Link>
        </li>
        <li className={`nav-item ${isActive('/lupul-si-corbul') ? 'active' : ''}`}>
          <Link href="/lupul-si-corbul" className="nav-links">
            Lupul și Corbul
          </Link>
        </li>
        <li className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
          <Link href="/contact" className="nav-links">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
