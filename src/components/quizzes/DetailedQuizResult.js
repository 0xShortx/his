import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaUserFriends, FaChartLine, FaShareAlt } from 'react-icons/fa';

function DetailedQuizResult() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [quizResult, setQuizResult] = useState(null);
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResult = async () => {
      if (user) {
        const resultRef = doc(db, 'UserResults', `${user.uid}_${quizId}_initial`);
        const resultDoc = await getDoc(resultRef);
        if (resultDoc.exists()) {
          setQuizResult(resultDoc.data());
        }

        const friendResultsRef = collection(db, 'FriendResults');
        const q = query(friendResultsRef, where('userId', '==', user.uid), where('quizId', '==', quizId));
        const querySnapshot = await getDocs(q);
        setFriendCount(querySnapshot.size);
      }
      setLoading(false);
    };

    fetchQuizResult();
  }, [user, quizId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-200"></div>
      </div>
    );
  }

  if (!quizResult) {
    return <div className="text-center mt-10 bg-white p-8 text-gray-600">No results found for this quiz.</div>;
  }

  const shareUrl = `${window.location.origin}/friend-quiz/${user.uid}/${quizId}`;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Your Quiz Results</h1>
        
        <div className="bg-blue-50 rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">{quizResult.archetype}</h2>
          <p className="text-lg mb-6 text-gray-600 text-center">{quizResult.archetypeDescription}</p>
          
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Self-Awareness Level</h3>
            <p className="text-lg text-gray-600">{quizResult.selfAwarenessLevel}</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaUserFriends className="text-2xl text-blue-400 mr-2" />
              <span className="text-lg text-gray-600">{friendCount} friends have taken your quiz</span>
            </div>
            <button
              onClick={() => navigate('/friend-results')}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition duration-300"
            >
              View Friend Results
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Share Your Results</h3>
          <p className="text-gray-600 mb-4">Invite friends to take the quiz and get their perspective on your self-awareness.</p>
          <div className="flex justify-center">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard! Share this with your friends to get their perspective.");
              }}
              className="flex items-center justify-center py-2 px-4 border border-blue-200 text-sm font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 transition duration-300"
            >
              <FaShareAlt className="mr-2" /> Copy Share Link
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
        >
          <FaChartLine className="mr-2" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default DetailedQuizResult;