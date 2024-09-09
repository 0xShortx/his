import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function MyResults() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      if (user) {
        const userResultsRef = collection(db, 'UserResults');
        const q = query(userResultsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const quizzes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUserQuizzes(quizzes);
        setLoading(false);
      }
    };

    fetchUserQuizzes();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Quiz Results</h1>
      {userQuizzes.length === 0 ? (
        <p className="text-center text-gray-600">You haven't taken any quizzes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{quiz.quizId} Quiz</h2>
              <button
                onClick={() => navigate(`/quiz-result/${quiz.quizId}`)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Show Results
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyResults;