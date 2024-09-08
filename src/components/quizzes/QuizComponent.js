import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import quizzes from '../../data/quizzes/quizzes';

function QuizComponent({ quiz: propQuiz, isUserQuiz = true, isRetake = false, onComplete }) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(propQuiz);

  useEffect(() => {
    if (!quiz && quizId) {
      const selectedQuiz = quizzes[quizId];
      if (selectedQuiz) {
        setQuiz(selectedQuiz);
      } else {
        navigate('/dashboard');
      }
    }
  }, [quizId, navigate, quiz]);

  if (!quiz) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = async () => {
    if (isUserQuiz) {
      const userId = auth.currentUser.uid;
      const userResultRef = doc(db, 'UserResults', `${userId}_${quiz.id}_${isRetake ? 'retake' : 'initial'}`);
      await setDoc(userResultRef, {
        userId,
        quizId: quiz.id,
        answers,
        timestamp: new Date(),
        isRetake
      });
    }
    if (onComplete) {
      onComplete();
    } else {
      navigate('/thank-you');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
        <p className="text-lg mb-4">{currentQuestion.text}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left py-2 px-4 border border-gray-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeof option === 'object' ? option.label : option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizComponent;