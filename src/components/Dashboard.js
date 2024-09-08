import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import QuizComponent from './quizzes/QuizComponent';
import ResultsPage from './ResultsPage';
import quizzes from '../data/quizzes/quizzes';
import AuthPage from './AuthPage';
import { FaPlay, FaChartBar } from 'react-icons/fa';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRetake, setIsRetake] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStartQuiz = async (quiz) => {
    const userResultQuery = query(
      collection(db, 'UserResults'),
      where('userId', '==', auth.currentUser.uid),
      where('quizId', '==', quiz.id),
      where('isRetake', '==', false)
    );
    const userResultSnapshot = await getDocs(userResultQuery);
    setIsRetake(!userResultSnapshot.empty);
    setSelectedQuiz(quiz);
    setShowQuiz(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full space-y-8">
        {!showQuiz && !showResults ? (
          <>
            <div>
              <h1 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
                Welcome, {user.displayName || 'User'} 👋
              </h1>
              <p className="mt-2 text-center text-xl text-gray-600">
                Ready to explore your personality?
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Quizzes:</h2>
                <div className="space-y-4">
                  {Object.values(quizzes).map((quiz) => (
                    <button 
                      key={quiz.id}
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                      <FaPlay className="h-5 w-5 mr-2" />
                      Take {quiz.title}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setShowResults(true)} 
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                <FaChartBar className="h-5 w-5 mr-2" />
                View Results
              </button>
            </div>
          </>
        ) : showQuiz && selectedQuiz ? (
          <QuizComponent 
            quiz={selectedQuiz}
            isUserQuiz={true}
            isRetake={isRetake}
            onComplete={() => { setShowQuiz(false); setShowResults(true); }} 
          />
        ) : (
          <ResultsPage />
        )}
      </div>
    </div>
  );
}

export default Dashboard;