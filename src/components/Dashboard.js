import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AuthPage from './AuthPage';
import { HiOutlineLogout } from 'react-icons/hi';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">HowISeem</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">Welcome, {user.displayName}!</span>
              <button
                onClick={() => auth.signOut()}
                className="btn-secondary flex items-center"
              >
                <HiOutlineLogout className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h2>
          <p className="mb-4 text-gray-600">Welcome to your HowISeem dashboard. Here you can manage your quizzes and view your results.</p>
          {/* Add more dashboard content here */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;