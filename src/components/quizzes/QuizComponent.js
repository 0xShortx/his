import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { selfAwarenessQuiz } from '../../data/quizzes/selfAwarenessQuiz';

function QuizComponent({ isUserQuiz, friendUserId, quizId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selfAwarenessLevel, setSelfAwarenessLevel] = useState('');
  const [friendName, setFriendName] = useState('');

  const questions = selfAwarenessQuiz.questions;

  useEffect(() => {
    if (!isUserQuiz) {
      const fetchFriendName = async () => {
        const userDoc = await getDoc(doc(db, 'users', friendUserId));
        if (userDoc.exists()) {
          setFriendName(userDoc.data().displayName);
        }
      };
      fetchFriendName();
    }
  }, [isUserQuiz, friendUserId]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    
    let determinedLevel = '';
    if (totalScore >= 31) determinedLevel = 'Advanced Self-Awareness';
    else if (totalScore >= 21) determinedLevel = 'Developing Self-Awareness';
    else determinedLevel = 'Emerging Self-Awareness';

    setSelfAwarenessLevel(determinedLevel);

    const resultData = {
      userId: isUserQuiz ? auth.currentUser.uid : friendUserId,
      quizId: selfAwarenessQuiz.id,
      answers,
      totalScore,
      selfAwarenessLevel: determinedLevel,
      timestamp: new Date()
    };

    try {
      if (isUserQuiz) {
        const docRef = await addDoc(collection(db, 'UserResults'), resultData);
        console.log("User result saved with ID: ", docRef.id);
      } else {
        const docRef = await addDoc(collection(db, 'friendsResult'), {
          ...resultData,
          assessorId: 'anonymous', // or you could ask for a name/identifier
        });
        console.log("Friend result saved with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error saving quiz result: ", error);
    }

    setQuizCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  if (quizCompleted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        {isUserQuiz ? (
          <>
            <p className="mb-4">Your self-awareness level: {selfAwarenessLevel}</p>
            <p>Share this link with your friends to get their assessment:</p>
            <input 
              type="text" 
              value={`${window.location.origin}/friend-quiz/${auth.currentUser.uid}/${selfAwarenessQuiz.id}`} 
              readOnly 
              className="w-full p-2 border rounded mt-2"
            />
          </>
        ) : (
          <p className="mb-4">Thank you for assessing {friendName}'s self-awareness!</p>
        )}
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{selfAwarenessQuiz.title}</h1>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Question {currentQuestion + 1} of {questions.length}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {isUserQuiz ? currentQuestionData.question : `How often does ${friendName} ${currentQuestionData.question.toLowerCase()}`}
      </h2>
      <div className="space-y-2">
        {currentQuestionData.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(currentQuestionData.id, option.value)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 text-left"
          >
            {isUserQuiz ? option.label : option.label.replace(/^You/, friendName)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizComponent;