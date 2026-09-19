import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiPlusCircle,
  FiClock,
  FiPieChart,
  FiClipboard,
  FiUsers,
  FiLayers,
  FiUser,
  FiLogOut,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../assets/logo.png';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isManager, isEmployee, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <NavLink to={isManager ? '/leave-requests' : '/dashboard'} className="brand-link" onClick={onClose}>
            <div className="brand-icon-box">
              <img src={logoImg} alt="Leave Life Logo" className="brand-logo-img" />
            </div>
            <span className="brand-title">
              Leave<span className="brand-title-accent">Life</span>
            </span>
          </NavLink>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Main Menu</span>

          {isEmployee && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiGrid /></span>
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/apply-leave"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiPlusCircle /></span>
                <span>Apply Leave</span>
              </NavLink>

              <NavLink
                to="/leave-history"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiClock /></span>
                <span>My Leave History</span>
              </NavLink>

              <NavLink
                to="/leave-balance"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiPieChart /></span>
                <span>Leave Balance</span>
              </NavLink>
            </>
          )}

          {isManager && (
            <>
              <NavLink
                to="/leave-requests"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiClipboard /></span>
                <span>Leave Requests</span>
              </NavLink>

              <NavLink
                to="/employees"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiUsers /></span>
                <span>Employees</span>
              </NavLink>

              <NavLink
                to="/departments"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><FiLayers /></span>
                <span>Departments</span>
              </NavLink>
            </>
          )}

          <span className="nav-section-title">Account</span>

          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon"><FiUser /></span>
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><FiLogOut /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
