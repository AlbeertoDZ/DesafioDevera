import './Navbar.scss';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="logo">devera<span className="dot">.</span></span>
        <nav className="nav-links">
          <a href="#" className="active">🏠 Home</a>
          <a href="#" className="disabled">💬 Onboarding chat</a>
        </nav>
      </div>
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