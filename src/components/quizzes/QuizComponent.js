import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import quizzes from '../../data/quizzes/quizzes';
import { FaWhatsapp, FaTwitter, FaCopy, FaChartBar } from 'react-icons/fa';

function QuizComponent({ quiz: propQuiz, isUserQuiz = true, isRetake = false, onComplete }) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(propQuiz);
  const [showResults, setShowResults] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [quizResult, setQuizResult] = useState(null);

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
    // Calculate and set the quiz result
    const result = calculateQuizResult(answers, quiz);
    setQuizResult(result);
    setShowResults(true);
  };

  const calculateQuizResult = (answers, quiz) => {
    // Implement your result calculation logic here
    // This is a placeholder implementation
    return {
      personalityType: "Adventurous Explorer",
      description: "You are curious, open-minded, and always ready for new experiences.",
      strengths: ["Adaptability", "Curiosity", "Enthusiasm"],
      weaknesses: ["Impulsiveness", "Restlessness"],
      advice: "Channel your energy into productive pursuits and try to find a balance between exploration and stability."
    };
  };

  const shareMessage = quizResult ? `I just took the "${quiz.title}" quiz on HowISeem and discovered I'm a ${quizResult.personalityType}! Find out your personality type:` : '';
  const shareUrl = `${window.location.origin}/friend-quiz/${auth.currentUser.uid}/${quiz.id}`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (showResults && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Your Quiz Results</h2>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">{quizResult.personalityType}</h3>
            <p className="text-lg mb-6">{quizResult.description}</p>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Strengths:</h4>
              <ul className="list-disc list-inside">
                {quizResult.strengths.map((strength, index) => (
                  <li key={index} className="text-lg">{strength}</li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Areas for Improvement:</h4>
              <ul className="list-disc list-inside">
                {quizResult.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-lg">{weakness}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Advice:</h4>
              <p className="text-lg">{quizResult.advice}</p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h4 className="text-xl font-semibold mb-2">Share your results:</h4>
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              <FaTwitter className="mr-2" /> Share on Twitter
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaWhatsapp className="mr-2" /> Share on WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaCopy className="mr-2" /> Copy Link
            </button>
            {copySuccess && <p className="text-green-600 text-center">{copySuccess}</p>}
          </div>
          <div className="mt-8">
            <button 
              onClick={() => navigate('/results')}
              className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaChartBar className="mr-2" /> Get Full Insights
            </button>
          </div>
          <button 
            onClick={() => onComplete()}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">{quiz.title}</h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{currentQuestionIndex + 1} / {quiz.questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}></div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h3>
          <div className="space-y-4 max-w-3xl mx-auto">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left py-3 px-6 border border-gray-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                {typeof option === 'object' ? option.label : option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizComponent;