import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Header() {
  const [user] = useAuthState(auth);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">HowISeem</Link>
        {user && (
          <button 
            onClick={() => auth.signOut()} 
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md transition duration-300 ease-in-out"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;