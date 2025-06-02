import { useState, useEffect, useRef } from 'react';
import './Navbar.scss';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          devera<span className="dot">.</span>
        </a>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav ref={menuRef} className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#" className="active" onClick={handleLinkClick}>Home</a>
        <a href="#onboarding" onClick={handleLinkClick}>Onboarding chat</a>

        <a href="#profile" className="profile-mobile" onClick={handleLinkClick}>
          <img
            src="https://randomuser.me/api/portraits/women/1.jpg"
            alt="Paula Sánchez"
            className="avatar"
          />
          <span className="username">Paula Sánchez</span>
          <span className="arrow">▾</span>
        </a>
      </nav>

      <a href="#profile" className="navbar-right">
        <img
          src="https://randomuser.me/api/portraits/women/1.jpg"
          alt="Paula Sánchez"
          className="avatar"
        />
        <span className="username">Paula Sánchez</span>
      </a>
    </header>
  );
};

export default Navbar;