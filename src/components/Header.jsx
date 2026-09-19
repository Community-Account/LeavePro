import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import profileImg from '../assets/profile.jpg';
import './Header.css';

export const Header = ({ onToggleSidebar, title = 'LeavePro' }) => {
  const { user } = useAuth();

  return (
    <header className="header-container">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
        <div className="header-title-box">
          <h1 className="header-title">{title}</h1>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn" aria-label="Notifications">
          <FiBell />
          <span className="notification-indicator" />
        </button>

        <div className="header-divider" />

        <Link to="/profile" className="user-profile-badge">
          <img src={profileImg} alt={user?.name || 'User'} className="user-avatar" />
          <div className="user-meta">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'Member'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
