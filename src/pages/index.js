import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import QuizIntro from '../components/QuizIntro';

function HomePage() {
  const [user, loading, error] = useAuthState(auth);
  const [quizTaken, setQuizTaken] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function checkQuizStatus() {
      if (user) {
        const quizRef = doc(db, 'UserResults', `${user.uid}_selfAwareness_initial`);
        const quizDoc = await getDoc(quizRef);
        setQuizTaken(quizDoc.exists());
      }
      setPageLoading(false);
    }

    if (!loading) {
      checkQuizStatus();
    }
  }, [user, loading]);

  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (quizTaken === false) {
    return <QuizIntro />;
  }

  return <Dashboard />;
}

export default HomePage;