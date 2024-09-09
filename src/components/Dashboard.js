import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaChartLine, FaUserCircle, FaLightbulb } from 'react-icons/fa';

function Dashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    const fetchLatestResult = async () => {
      if (user) {
        const userResultsRef = collection(db, 'UserResults');
        const q = query(
          userResultsRef,
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setLatestResult(querySnapshot.docs[0].data());
        }
      }
    };

    fetchLatestResult();
  }, [user]);

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Welcome to HowISeem</h1>
          <p className="text-xl text-center mb-8 text-gray-600">Discover insights about your personality and self-awareness</p>
          
          {latestResult ? (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <FaUserCircle className="text-5xl mr-4 text-blue-500" />
                <h2 className="text-3xl font-semibold text-blue-700">Your Personality Profile</h2>
              </div>
              <p className="text-2xl mb-4 text-center text-blue-800">
                <span className="font-bold">{latestResult.archetype}</span>
              </p>
              <p className="text-lg mb-6 text-center text-blue-700">
                Self-Awareness Level: <span className="font-bold">{latestResult.selfAwarenessLevel}</span>
              </p>
              <button
                onClick={() => navigate(`/quiz-result/${latestResult.quizId}`)}
                className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              >
                <FaChartLine className="mr-2" /> View Detailed Results
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <FaLightbulb className="text-5xl mr-4 text-yellow-500" />
                <h2 className="text-3xl font-semibold text-blue-700">Unlock Your Self-Awareness</h2>
              </div>
              <p className="text-xl mb-6 text-center text-gray-700">
                Embark on a journey of self-discovery! Take our Self-Awareness Quiz and gain valuable insights into your personality.
              </p>
              <div className="bg-blue-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Why Take the Self-Awareness Quiz?</h3>
                <ul className="list-disc list-inside text-blue-700">
                  <li>Understand your strengths and areas for growth</li>
                  <li>Gain insights into your decision-making process</li>
                  <li>Improve your relationships and communication skills</li>
                  <li>Enhance your emotional intelligence</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/quiz/self-awareness-quiz')}
                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center"
              >
                <FaLightbulb className="mr-2" /> Start Your Self-Awareness Journey
              </button>
            </div>
          )}

          <div className="text-center text-blue-700">
            <p className="mb-4">Explore more quizzes and track your progress using the navigation bar below.</p>
            <p>Share your results with friends to get a more comprehensive view of your personality!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;