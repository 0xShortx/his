import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaUserFriends, FaChartLine, FaInfoCircle, FaTwitter, FaWhatsapp, FaCopy, FaCheck } from 'react-icons/fa';
import { archetypeDetails } from './archetypeDetails';

function DetailedQuizResult() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [quizResult, setQuizResult] = useState(null);
  const [friendResults, setFriendResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchetypeDetails, setShowArchetypeDetails] = useState(false);
  const [selfAwarenessPercentage, setSelfAwarenessPercentage] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const calculateTotalScore = useCallback((result) => {
    if (result.totalScore) return result.totalScore;
    return Object.values(result.answers).reduce((sum, score) => sum + score, 0);
  }, []);

  const calculateSelfAwareness = useCallback(() => {
    if (!quizResult || friendResults.length === 0) return;

    const userScore = calculateTotalScore(quizResult);
    const friendScores = friendResults.map(result => calculateTotalScore(result));
    const averageFriendScore = friendScores.reduce((sum, score) => sum + score, 0) / friendScores.length;

    const maxPossibleDifference = 100; // Adjust this based on your quiz's maximum possible score difference
    const actualDifference = Math.abs(userScore - averageFriendScore);
    const awarenessPercentage = ((maxPossibleDifference - actualDifference) / maxPossibleDifference) * 100;
    setSelfAwarenessPercentage(Math.round(awarenessPercentage));
  }, [quizResult, friendResults, calculateTotalScore]);

  useEffect(() => {
    const fetchResults = async () => {
      if (user) {
        const userResultRef = doc(db, 'UserResults', `${user.uid}_${quizId}_initial`);
        const userResultDoc = await getDoc(userResultRef);
        if (userResultDoc.exists()) {
          setQuizResult(userResultDoc.data());
        }

        const friendResultsRef = collection(db, 'FriendResults');
        const q = query(friendResultsRef, where('userId', '==', user.uid), where('quizId', '==', quizId));
        const querySnapshot = await getDocs(q);
        const friendResultsData = querySnapshot.docs.map(doc => doc.data());
        setFriendResults(friendResultsData);
      }
      setIsLoading(false);
    };

    if (!loading && user) {
      fetchResults();
    } else if (!loading && !user) {
      setIsLoading(false);
    }
  }, [user, loading, quizId]);

  useEffect(() => {
    calculateSelfAwareness();
  }, [calculateSelfAwareness]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-200"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 bg-white p-8 text-red-600">Error: {error.message}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 bg-white p-8 text-gray-600">Please log in to view your quiz results.</div>;
  }

  if (!quizResult || friendResults.length === 0) {
    return <div className="text-center mt-10 bg-white p-8 text-gray-600">No results found for this quiz or no friends have taken the quiz yet.</div>;
  }

  const archetypeInfo = archetypeDetails[quizResult.archetype] || {};
  const shareUrl = `${window.location.origin}/friend-quiz/${user.uid}/${quizId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=I just took the self-awareness quiz! Check out my results and take the quiz yourself:&url=${encodeURIComponent(shareUrl)}`;
  const whatsappShareUrl = `https://wa.me/?text=I just took the self-awareness quiz! Check out my results and take the quiz yourself: ${encodeURIComponent(shareUrl)}`;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Your Quiz Results</h1>
        
        <div className="bg-blue-50 rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">{quizResult.archetype}</h2>
          <p className="text-lg mb-6 text-gray-600 text-center">{archetypeInfo.description}</p>
          
          <button
            onClick={() => setShowArchetypeDetails(!showArchetypeDetails)}
            className="flex items-center justify-center mx-auto mb-6 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
          >
            <FaInfoCircle className="mr-2" />
            {showArchetypeDetails ? 'Hide' : 'Show'} Archetype Details
          </button>

          {showArchetypeDetails && (
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Archetype Insights</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-600 mb-2">Strengths:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {archetypeInfo.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-600 mb-2">Growth Areas:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {archetypeInfo.growthAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">Tips for Growth:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {archetypeInfo.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Self-Awareness Level</h3>
            <p className="text-lg text-gray-600">
              Your self-awareness level is {selfAwarenessPercentage}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This percentage represents how closely your self-assessment aligns with the average perception of your friends.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaUserFriends className="text-2xl text-blue-400 mr-2" />
              <span className="text-lg text-gray-600">{friendResults.length} friend{friendResults.length !== 1 ? 's' : ''} have taken your quiz</span>
            </div>
            <button
              onClick={() => navigate(`/friend-results/${user.uid}/${quizId}`)}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition duration-300"
            >
              View Friend Results
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Share Your Results</h3>
          <p className="text-gray-600 mb-6">Invite friends to take the quiz and compare their perspective with your self-assessment. The more friends participate, the more accurate your self-awareness score becomes!</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleCopyLink}
              className={`flex items-center justify-center py-2 px-4 border text-sm font-medium rounded-full transition duration-300 w-full sm:w-auto ${
                copySuccess 
                  ? 'border-green-500 text-green-600 bg-green-50 hover:bg-green-100' 
                  : 'border-blue-200 text-blue-600 bg-white hover:bg-blue-50'
              }`}
            >
              {copySuccess ? <FaCheck className="mr-2" /> : <FaCopy className="mr-2" />}
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
            <a 
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 px-4 border border-blue-400 text-sm font-medium rounded-full text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 w-full sm:w-auto"
            >
              <FaTwitter className="mr-2" /> Share on Twitter
            </a>
            <a 
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 px-4 border border-green-500 text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 w-full sm:w-auto"
            >
              <FaWhatsapp className="mr-2" /> Share on WhatsApp
            </a>
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