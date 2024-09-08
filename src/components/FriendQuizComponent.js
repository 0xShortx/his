import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from './quizzes/QuizComponent';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function FriendQuizComponent() {
  const { userId, quizId } = useParams();
  const [friendName, setFriendName] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchFriendName = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setFriendName(userDoc.data().displayName);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching friend name:", error);
      }
    };
    fetchFriendName();
  }, [userId]);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          {!quizCompleted ? (
            <>
              <h1 className="text-2xl font-bold mb-4 text-center">Assess {friendName}</h1>
              <p className="mb-4">Answer these questions about {friendName}'s self-awareness based on your observations.</p>
              <QuizComponent 
                isUserQuiz={false} 
                friendUserId={userId} 
                quizId={quizId}
                onComplete={handleQuizComplete} 
              />
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Thank you for your assessment!</h2>
              <p>Your insights will help {friendName} understand their self-awareness better.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendQuizComponent;
