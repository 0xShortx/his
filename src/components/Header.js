import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/dashboard">Dashboard</Link></li>
          {/* Add more navigation items as needed */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;