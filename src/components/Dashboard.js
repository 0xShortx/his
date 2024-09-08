import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import QuizComponent from './quizzes/QuizComponent';
import ResultsPage from './ResultsPage';
import { HiOutlineLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
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
          {!showQuiz && !showResults ? (
            <div>
              <p className="mb-4 text-gray-600">Welcome to your HowISeem dashboard. Here you can take the Unified Situational Self-Awareness Assessment or view your results.</p>
              <button onClick={() => setShowQuiz(true)} className="btn-primary mr-4">
                Take Self-Awareness Quiz
              </button>
              <button onClick={() => setShowResults(true)} className="btn-secondary">
                View Results
              </button>
            </div>
          ) : showQuiz ? (
            <QuizComponent 
              isUserQuiz={true}
              onComplete={() => { setShowQuiz(false); setShowResults(true); }} 
            />
          ) : (
            <ResultsPage />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;