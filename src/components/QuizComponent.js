import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

function QuizComponent({ isUserQuiz, friendUserId, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [archetype, setArchetype] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      const questionsCollection = collection(db, 'quizzes');
      const questionsSnapshot = await getDocs(questionsCollection);
      const questionsList = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsList);
    };

    fetchQuestions();
  }, []);

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
    const averageScore = totalScore / questions.length;
    
    let determinedArchetype = '';
    if (averageScore < 2) determinedArchetype = 'Introvert';
    else if (averageScore < 3) determinedArchetype = 'Ambivert';
    else determinedArchetype = 'Extrovert';

    setArchetype(determinedArchetype);

    const resultData = {
      userId: isUserQuiz ? auth.currentUser.uid : friendUserId,
      answers,
      archetype: determinedArchetype,
      timestamp: new Date()
    };

    if (isUserQuiz) {
      await addDoc(collection(db, 'UserResults'), resultData);
    } else {
      await addDoc(collection(db, 'friendsResult'), {
        ...resultData,
        assessorId: auth.currentUser.uid,
      });
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
        <p className="mb-4">Your archetype is: {archetype}</p>
        {isUserQuiz && (
          <p>Share this link with your friends: {`${window.location.origin}/friend-quiz/${auth.currentUser.uid}`}</p>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Question {currentQuestion + 1} of {questions.length}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">{currentQuestionData.question}</h2>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleAnswer(currentQuestionData.id, value)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizComponent;