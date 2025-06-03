import { ChevronDown } from 'lucide-react';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo">devera.</h1>
          
          <nav className="header-nav">
            <a href="#" className="nav-link active">
              Home
            </a>
            <a href="#" className="nav-link">
              Onboarding chat
            </a>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-menu">
            <div className="user-avatar">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b12c?w=32&h=32&fit=crop&crop=face" 
                alt="Paula Sánchez" 
              />
            </div>
            <span className="user-name">Paula Sánchez</span>
            <ChevronDown size={16} className="user-dropdown-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 