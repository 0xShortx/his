import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../firebase';

function Header() {
  const user = auth.currentUser;

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="app-logo">
          HowISeem
        </Link>
        {user && (
          <button
            className="sign-out-button"
            onClick={() => auth.signOut()}
          >
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;