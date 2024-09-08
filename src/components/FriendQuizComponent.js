import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from './quizzes/QuizComponent';
import quizzes from '../data/quizzes/quizzes';

function FriendQuizComponent() {
  const { userId, quizId } = useParams();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const quiz = quizzes[quizId];

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  if (!quiz) {
    return <div className="text-red-500">Quiz not found. The link might be invalid.</div>;
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
                onComplete={handleQuizComplete} 
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
