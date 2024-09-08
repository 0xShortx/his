import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaUser } from 'react-icons/fa';

function Footer() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/dashboard" className={`footer-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <FaHome className="footer-icon" />
          <span className="footer-text">Home</span>
        </Link>
        <Link to="/results" className={`footer-link ${isActive('/results') ? 'active' : ''}`}>
          <FaChartBar className="footer-icon" />
          <span className="footer-text">Results</span>
        </Link>
        <Link to="/profile" className={`footer-link ${isActive('/profile') ? 'active' : ''}`}>
          <FaUser className="footer-icon" />
          <span className="footer-text">Profile</span>
        </Link>
      </nav>
    </footer>
  );
}

export default Footer;