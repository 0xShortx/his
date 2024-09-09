import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { FaArrowLeft } from 'react-icons/fa';

function DetailedQuizResult() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResult = async () => {
      if (auth.currentUser) {
        const resultRef = doc(db, 'UserResults', `${auth.currentUser.uid}_${quizId}_initial`);
        const resultDoc = await getDoc(resultRef);
        if (resultDoc.exists()) {
          setQuizResult(resultDoc.data());
        }
      }
      setLoading(false);
    };

    fetchQuizResult();
  }, [quizId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!quizResult) {
    return <div className="text-center mt-10">No results found for this quiz.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Detailed Quiz Results</h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4">Your Archetype: {quizResult.archetype}</h3>
          <p className="text-lg mb-6">{quizResult.archetypeDescription}</p>
          <h4 className="text-xl font-semibold mb-2">Self-Awareness Level</h4>
          <p className="text-lg mb-6">{quizResult.selfAwarenessLevel}</p>
          <h4 className="text-xl font-semibold mb-2">Total Score</h4>
          <p className="text-lg mb-6">{quizResult.totalScore}</p>
          <h4 className="text-xl font-semibold mb-2">Detailed Answers</h4>
          <ul className="list-disc list-inside">
            {Object.entries(quizResult.answers).map(([questionIndex, answer]) => (
              <li key={questionIndex} className="mb-2">
                Question {parseInt(questionIndex) + 1}: {answer}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DetailedQuizResult;