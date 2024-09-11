import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { selfAwarenessQuiz } from '../../data/quizzes/selfAwarenessQuiz';

function FriendResultsComponent() {
  const { userId, quizId } = useParams();
  const navigate = useNavigate();
  const [friendResults, setFriendResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);

  useEffect(() => {
    const fetchFriendResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch original user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setOriginalUser(userDoc.data());
        }

        // Fetch friend results
        const friendResultsQuery = query(
          collection(db, 'FriendResults'),
          where('userId', '==', userId),
          where('quizId', '==', quizId)
        );
        const snapshot = await getDocs(friendResultsQuery);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          archetype: calculateArchetype(doc.data().answers)
        }));
        setFriendResults(results);
      } catch (err) {
        console.error("Error fetching friend results:", err);
        setError("An error occurred while fetching results. Please try again later.");
      }
      setLoading(false);
    };

    fetchFriendResults();
  }, [userId, quizId]);

  const calculateArchetype = (answers) => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxScore = selfAwarenessQuiz.questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 20) return "The Introspective Observer";
    if (percentage <= 40) return "The Empathetic Connector";
    if (percentage <= 60) return "The Balanced Mediator";
    if (percentage <= 80) return "The Confident Innovator";
    return "The Visionary Leader";
  };

  if (loading) return <div className="text-center">Loading...</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Error</h2>
            <p className="text-center mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Friend Assessment Results for {originalUser?.displayName || 'User'}</h1>
        {friendResults.length === 0 ? (
          <p className="text-center text-xl">No friend assessments have been completed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friendResults.map((result) => (
              <div key={result.id} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">{result.friendName}'s Assessment</h2>
                <p className="mb-2">Archetype: {result.archetype}</p>
                <p className="mb-2">Completed on: {new Date(result.timestamp.toDate()).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendResultsComponent;