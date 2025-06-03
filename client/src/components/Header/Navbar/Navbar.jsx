import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Navbar.scss';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      // Let App.jsx handle the redirection automatically
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // No renderizar el navbar si no hay usuario autenticado
  if (!isAuthenticated() || !user) {
    return null;
  }

  const userDisplayName = `${user.name} ${user.lastname}`;

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button onClick={() => navigate('/')} className="logo-button">
          devera<span className="dot">.</span>
        </button>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav ref={menuRef} className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => { handleLinkClick(); navigate('/'); }} className="nav-link active">Home</button>
        <button onClick={handleLinkClick} className="nav-link">Onboarding chat</button>

        <div className="profile-mobile">
          <span className="username">{userDisplayName}</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
        </div>
      </nav>

      <div className="navbar-right">
        <span className="username">{userDisplayName}</span>
        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
      </div>
    </header>
  );
};

export default Navbar;