import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import QuizComponent from './quizzes/QuizComponent';
import quizzes from '../data/quizzes/quizzes';

function FriendQuizComponent() {
  const { userId, quizId } = useParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [confirmRetake, setConfirmRetake] = useState(false);
  const quiz = quizzes[quizId];

  useEffect(() => {
    const checkIfAlreadyTaken = async () => {
      const friendResultQuery = query(
        collection(db, 'friendsResult'),
        where('userId', '==', userId),
        where('quizId', '==', quizId),
        where('friendName', '==', friendName)
      );
      const snapshot = await getDocs(friendResultQuery);
      setAlreadyTaken(!snapshot.empty);
    };

    if (friendName) {
      checkIfAlreadyTaken();
    }
  }, [userId, quizId, friendName]);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  const handleStartQuiz = () => {
    if (friendName.trim() === '') {
      alert('Please enter your name before starting the quiz.');
      return;
    }
    if (alreadyTaken) {
      setConfirmRetake(true);
    } else {
      setQuizStarted(true);
    }
  };

  const handleConfirmRetake = () => {
    setQuizStarted(true);
    setConfirmRetake(false);
  };

  if (!quiz) {
    return <div className="text-red-500">Quiz not found. The link might be invalid.</div>;
  }

  if (confirmRetake) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h2 className="text-2xl font-bold mb-4">You've already taken this quiz</h2>
            <p className="mb-4">Are you sure you want to take it again? This will update your previous assessment.</p>
            <button
              onClick={handleConfirmRetake}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mr-4"
            >
              Yes, take it again
            </button>
            <button
              onClick={() => setConfirmRetake(false)}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome to the Friend Assessment</h1>
            <p className="mb-4">Your friend has asked you to assess their self-awareness. This quiz will help them understand how others perceive them. Your honest feedback is valuable for their personal growth.</p>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 mb-4 border rounded"
            />
            {alreadyTaken && (
              <p className="text-red-500 mb-4">You have already taken this quiz for this friend.</p>
            )}
            <button
              onClick={handleStartQuiz}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              disabled={alreadyTaken}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          {!quizCompleted ? (
            <>
              <h1 className="text-2xl font-bold mb-4 text-center">Assess Your Friend</h1>
              <p className="mb-4">Answer these questions about your friend's self-awareness based on your observations.</p>
              <QuizComponent 
                quiz={quiz}
                isUserQuiz={false} 
                friendUserId={userId}
                friendName={friendName}
                onComplete={handleQuizComplete}
                isRetake={alreadyTaken}
              />
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Thank you for your assessment!</h2>
              <p>Your insights will help your friend understand their self-awareness better.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendQuizComponent;
