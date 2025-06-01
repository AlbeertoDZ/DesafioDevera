import { useState, useEffect, useRef } from 'react';
import './Navbar.scss';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Cerrar al hacer clic en un link
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="logo">devera<span className="dot">.</span></span>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav ref={menuRef} className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#" className="active" onClick={handleLinkClick}>🏠 Home</a>
        <a href="#" className="disabled" onClick={handleLinkClick}>💬 Onboarding chat</a>

        <div className="profile-mobile">
          <img
            src="https://randomuser.me/api/portraits/women/1.jpg"
            alt="Paula Sánchez"
            className="avatar"
          />
          <span className="username">Paula Sánchez</span>
          <span className="arrow">▾</span>
        </div>
      </nav>

      <div className="navbar-right">
        <img
          src="https://randomuser.me/api/portraits/women/1.jpg"
          alt="Paula Sánchez"
          className="avatar"
        />
        <span className="username">Paula Sánchez</span>
        <span className="arrow">▾</span>
      </div>
    </header>
  );
};

export default Navbar;