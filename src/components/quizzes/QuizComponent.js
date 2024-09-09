import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import quizzes from '../../data/quizzes/quizzes';
import { FaChartBar, FaCheckCircle, FaTwitter, FaWhatsapp, FaShareAlt } from 'react-icons/fa';

function QuizComponent({ quiz: propQuiz, isUserQuiz = true, isRetake = false, onComplete, friendUserId, friendQuizId }) {
  const { quizId, userId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(propQuiz);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [isFriendQuiz, setIsFriendQuiz] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [showSubmitPage, setShowSubmitPage] = useState(false);

  useEffect(() => {
    console.log("QuizComponent useEffect triggered");
    console.log("quizId:", quizId);
    console.log("friendQuizId:", friendQuizId);
    console.log("Current quiz state:", quiz);

    if (friendUserId && friendQuizId) {
      setIsFriendQuiz(true);
    } else if (userId) {
      setIsFriendQuiz(true);
    }

    if (!quiz && (quizId || friendQuizId)) {
      const selectedQuizId = quizId || friendQuizId;
      const selectedQuiz = quizzes[selectedQuizId];
      if (selectedQuiz) {
        setQuiz(selectedQuiz);
      } else {
        console.error("Quiz not found:", selectedQuizId);
        navigate('/quizzes'); // Redirect to all quizzes page if quiz not found
      }
    }
  }, [quizId, userId, navigate, quiz, friendUserId, friendQuizId]);

  if (isFriendQuiz && currentQuestionIndex === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Friend Quiz</h2>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">What's your name?</h3>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
            <button
              onClick={() => setCurrentQuestionIndex(1)}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!friendName.trim()}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswer = async (answer) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await handleQuizCompletion(newAnswers);
    }
  };

  const calculateTotalScore = (answers, quiz) => {
    return Object.entries(answers).reduce((total, [questionIndex, answerValue]) => {
      const question = quiz.questions[questionIndex];
      const selectedOption = question.options.find(option => option.value === answerValue);
      return total + (selectedOption ? selectedOption.value : 0);
    }, 0);
  };

  const determineArchetype = (totalScore, maxScore) => {
    const percentage = (totalScore / maxScore) * 100;
    if (percentage <= 20) {
      return "The Introspective Observer";
    } else if (percentage <= 40) {
      return "The Empathetic Connector";
    } else if (percentage <= 60) {
      return "The Balanced Mediator";
    } else if (percentage <= 80) {
      return "The Confident Innovator";
    } else {
      return "The Visionary Leader";
    }
  };

  const handleQuizCompletion = async (finalAnswers) => {
    const totalScore = calculateTotalScore(finalAnswers, quiz);
    const maxScore = quiz.questions.length * 4;
    const archetype = determineArchetype(totalScore, maxScore);
    const result = calculateQuizResult(finalAnswers, quiz, totalScore, archetype);
    
    setQuizResult(result);
    setShowSubmitPage(true);
  };

  const handleSubmitResults = async () => {
    try {
      if (isUserQuiz && auth.currentUser) {
        const userResultRef = doc(db, 'UserResults', `${auth.currentUser.uid}_${quiz.id}_${isRetake ? 'retake' : 'initial'}`);
        await setDoc(userResultRef, {
          userId: auth.currentUser.uid,
          quizId: quiz.id,
          answers: answers,
          timestamp: new Date(),
          isRetake,
          totalScore: quizResult.totalScore,
          archetype: quizResult.archetype
        });
      } else if (isFriendQuiz) {
        const friendResultRef = doc(db, 'FriendResults', `${friendUserId || userId}_${quiz.id}_${Date.now()}`);
        await setDoc(friendResultRef, {
          userId: friendUserId || userId,
          quizId: quiz.id,
          answers: answers,
          timestamp: new Date(),
          friendName,
          totalScore: quizResult.totalScore,
          archetype: quizResult.archetype
        });
      }
      
      setShowSubmitPage(false);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      // Show an error message to the user
      alert("There was an error submitting your quiz results. Please try again later.");
    }
  };

  const calculateQuizResult = (answers, quiz, totalScore, archetype) => {
    const maxScore = quiz.questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    let level;
    if (percentage <= 33.33) {
      level = "Emerging Self-Awareness";
    } else if (percentage <= 66.66) {
      level = "Developing Self-Awareness";
    } else {
      level = "Advanced Self-Awareness";
    }

    const archetypeDescriptions = {
      "The Introspective Observer": "You have a deep understanding of your inner world and are highly reflective. Your analytical nature allows you to gain profound insights about yourself and others.",
      "The Empathetic Connector": "Your emotional intelligence shines through in your interactions. You have a natural ability to understand and relate to others' feelings and perspectives.",
      "The Balanced Mediator": "You excel at seeing multiple sides of a situation and finding common ground. Your adaptability and fairness make you an excellent problem-solver and peacemaker.",
      "The Confident Innovator": "Your self-assurance and creativity drive you to push boundaries and explore new ideas. You're not afraid to take calculated risks to achieve your goals.",
      "The Visionary Leader": "You combine high self-awareness with the ability to inspire and guide others. Your forward-thinking approach and strong sense of purpose make you a natural leader."
    };

    return {
      selfAwarenessLevel: level,
      description: `Your self-awareness level is: ${level}. This indicates your current understanding of your thoughts, emotions, and behaviors in various situations.`,
      totalScore,
      archetype,
      archetypeDescription: archetypeDescriptions[archetype]
    };
  };

  if (showSubmitPage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Quiz Completed!</h2>
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Great job! You've finished the quiz.</h3>
            <p className="text-lg mb-6">Click the button below to submit your results and see your personality insights.</p>
            <button 
              onClick={handleSubmitResults}
              className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const shareUrl = `${window.location.origin}/friend-quiz/${auth.currentUser.uid}/${quiz.id}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Your Quiz Results</h2>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Your Archetype: {quizResult.archetype}</h3>
            <p className="text-lg mb-6">{quizResult.archetypeDescription}</p>
            
            <button 
              onClick={() => navigate(`/quiz-result/${quiz.id}`)}
              className="w-full mb-4 flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaChartBar className="mr-2" /> Get More Details
            </button>

            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <p className="text-lg mb-4">
                Your complete Self-Awareness level can only be calculated when you share this quiz with friends to get their perspective. Their insights will provide a more comprehensive view of your self-awareness.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaShareAlt className="mr-2" /> Copy Share Link
                </button>
                <a 
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20self-awareness%20quiz%20result!%20Take%20the%20quiz%20and%20let%20me%20know%20what%20you%20think:%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                >
                  <FaTwitter className="mr-2" /> Share on Twitter
                </a>
                <a 
                  href={`https://wa.me/?text=Check%20out%20my%20self-awareness%20quiz%20result!%20Take%20the%20quiz%20and%20let%20me%20know%20what%20you%20think:%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaWhatsapp className="mr-2" /> Share on WhatsApp
                </a>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">{quiz.title}</h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
          <p className="text-lg mb-6">{currentQuestion.question}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left py-3 px-6 border border-gray-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizComponent;