import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AuthPage from './components/AuthPage';
import SignUp from './components/SignUp'; // Create this component
import Dashboard from './components/Dashboard';
import QuizComponent from './components/quizzes/QuizComponent';
import FriendQuizComponent from './components/FriendQuizComponent';
import ResultsPage from './components/ResultsPage';
import ThankYouPage from './components/ThankYouPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <Router>
      <div className={`app ${user ? 'with-footer' : ''}`}>
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
            <Route path="/quiz/:quizId" element={user ? <QuizComponent /> : <Navigate to="/" replace />} />
            <Route path="/friend-quiz/:userId/:quizId" element={<FriendQuizComponent />} />
            <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/" replace />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;