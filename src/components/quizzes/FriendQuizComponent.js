import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { selfAwarenessQuiz } from '../../data/quizzes/selfAwarenessQuiz';

function FriendQuizComponent() {
  const { userId, quizId } = useParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizAndUser = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to load quiz with ID:", quizId);
        // Load the quiz
        const quizData = selfAwarenessQuiz;
        console.log("Quiz data:", quizData);
        const modifiedQuiz = {
          ...quizData,
          questions: quizData.questions.map(q => ({
            ...q,
            question: q.question.replace(/\byou\b/g, 'your friend')
          }))
        };
        setQuiz(modifiedQuiz);

        // Load the original user's name
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          console.log("Attempting to fetch user document for userId:", userId);
          console.log("User document exists:", userDoc.exists());
          if (userDoc.exists()) {
            setOriginalUser(userDoc.data());
          } else {
            console.log("User document not found, but continuing with quiz");
          }
        } catch (userError) {
          console.error("Error fetching user document:", userError);
          console.error("Error details:", userError.code, userError.message);
          // Continue with the quiz even if we can't fetch the user document
        }
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError(`An error occurred: ${err.message}`);
      }
      setLoading(false);
    };

    loadQuizAndUser();
  }, [quizId, userId]);

  useEffect(() => {
    const checkIfAlreadyTaken = async () => {
      if (friendName) {
        const friendResultQuery = query(
          collection(db, 'FriendResults'),
          where('userId', '==', userId),
          where('quizId', '==', quizId),
          where('friendName', '==', friendName)
        );
        const snapshot = await getDocs(friendResultQuery);
        setAlreadyTaken(!snapshot.empty);
      }
    };

    checkIfAlreadyTaken();
  }, [userId, quizId, friendName]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    try {
      const friendResultDocId = `${userId}_${quizId}_${friendName.replace(/\s+/g, '_')}`;
      await setDoc(doc(db, 'FriendResults', friendResultDocId), {
        userId: userId,
        quizId: quizId,
        friendName: friendName,
        answers: answers,
        timestamp: new Date()
      });
      setQuizCompleted(true);
    } catch (error) {
      console.error("Error saving friend's quiz results:", error);
      alert("There was an error saving your results. Please try again.");
    }
  };

  const handleStartQuiz = () => {
    if (friendName.trim() === '') {
      alert('Please enter your name before starting the quiz.');
      return;
    }
    setQuizStarted(true);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Error</h2>
            <p className="text-center mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              Return to Home
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
            <p className="mb-4">{originalUser?.displayName || 'Your friend'} has asked you to assess their self-awareness. This quiz will help them understand how others perceive them. Your honest feedback is valuable for their personal growth.</p>
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

  if (quizStarted && !quizCompleted) {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-2xl font-bold mb-4 text-center">Assess {originalUser?.displayName || 'Your Friend'}</h1>
            <p className="mb-4">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
            <p className="mb-4">{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full mb-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Thank you for your assessment!</h2>
            <p className="mb-4">Your insights will help {originalUser?.displayName || 'your friend'} understand their self-awareness better.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default FriendQuizComponent;
