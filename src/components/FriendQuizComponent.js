import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FriendQuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const questions = [
    "How would you describe your friend's personality?",
    "What do you think is your friend's greatest strength?",
    "How does your friend typically handle stress?",
    "What kind of sense of humor does your friend have?",
    "How would you describe your friend's communication style?"
  ];

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, navigate to thank you page
      navigate('/thank-you');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Friend Quiz</h1>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion]}</h2>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          placeholder="Type your answer here..."
          onChange={(e) => handleAnswer(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          onClick={() => handleAnswer('')}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
      <div className="mt-4 text-gray-600">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  );
};

export default FriendQuizComponent;
