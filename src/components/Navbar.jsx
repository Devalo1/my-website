import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

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
    return location.pathname === path;
  };

  const isActiveParent = (parentPath) => {
    return location.pathname.startsWith(parentPath);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const closeMenu = () => {
      setIsOpen(false);
    };
    
    // Close menu when route changes
    closeMenu();
    
    return () => {
      // Cleanup if needed
    };
  }, [location]);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/images/Logo.png" alt="Logo" className="logo-img" />
        </Link>
      </div>
      
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      
      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <Link to="/" className="nav-links">
            Acasă
          </Link>
        </li>
        <li className={`nav-item ${isActive('/produse') ? 'active' : ''}`}>
          <Link to="/produse" className="nav-links">
            Produse
          </Link>
        </li>
        <li className={`nav-item ${isActive('/despre-noi') ? 'active' : ''}`}>
          <Link to="/despre-noi" className="nav-links">
            Despre Noi
          </Link>
        </li>
        <li className={`nav-item ${isActiveParent('/terapie') ? 'active' : ''} ${activeSubmenu === 0 ? 'open' : ''}`}>
          <div className="nav-links" onClick={() => toggleSubmenu(0)}>
            Terapie
          </div>
          <ul className="submenu">
            <li className="submenu-item">
              <Link to="/terapie/consiliere" className="nav-links">
                Consiliere
              </Link>
            </li>
            <li className="submenu-item">
              <Link to="/terapie/psihoterapie" className="nav-links">
                Psihoterapie
              </Link>
            </li>
            <li className="submenu-item">
              <Link to="/terapie/personalizata" className="nav-links">
                Terapia Personalizată
              </Link>
            </li>
          </ul>
        </li>
        <li className={`nav-item ${isActive('/ong') ? 'active' : ''}`}>
          <Link to="/ong" className="nav-links">
            ONG
          </Link>
        </li>
        <li className={`nav-item ${isActive('/lupul-si-corbul') ? 'active' : ''}`}>
          <Link to="/lupul-si-corbul" className="nav-links">
            Lupul și Corbul
          </Link>
        </li>
        <li className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
          <Link to="/contact" className="nav-links">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
