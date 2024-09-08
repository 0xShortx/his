import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

function QuizComponent({ quiz, isUserQuiz, friendUserId, friendName, onComplete, isRetake }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selfAwarenessLevel, setSelfAwarenessLevel] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [confirmRetake, setConfirmRetake] = useState(false);

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  const questions = quiz.questions;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (isUserQuiz && isRetake) {
        setConfirmRetake(true);
      } else {
        calculateResult();
      }
    }
  };

  const calculateResult = async () => {
    const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setTotalScore(score);
    
    const maxPossibleScore = questions.length * 4;
    const scorePercentage = (score / maxPossibleScore) * 100;
    
    let determinedLevel = '';
    for (const range of quiz.scoring.ranges) {
      if (scorePercentage <= range.maxPercentage) {
        determinedLevel = range.level;
        break;
      }
    }

    setSelfAwarenessLevel(determinedLevel);

    const timestamp = new Date();
    const resultData = {
      userId: isUserQuiz ? auth.currentUser.uid : friendUserId,
      quizId: quiz.id,
      answers,
      totalScore: score,
      scorePercentage,
      selfAwarenessLevel: determinedLevel,
      timestamp,
      friendName: isUserQuiz ? null : friendName,
      friendAssessmentId: isUserQuiz ? null : `${friendName}-${timestamp.getTime()}`
    };

    console.log("Saving result data:", resultData);

    if (isUserQuiz) {
      if (isRetake) {
        // Update existing result
        const existingResultQuery = query(
          collection(db, 'UserResults'),
          where('userId', '==', auth.currentUser.uid),
          where('quizId', '==', quiz.id),
          where('isRetake', '==', false)
        );
        const existingResultSnapshot = await getDocs(existingResultQuery);
        if (!existingResultSnapshot.empty) {
          const docRef = existingResultSnapshot.docs[0].ref;
          await updateDoc(docRef, { ...resultData, isRetake: false });
        }
      } else {
        // Save new result
        await addDoc(collection(db, 'UserResults'), resultData);
      }
    } else {
      if (isRetake) {
        // Update existing friend result
        const existingResultQuery = query(
          collection(db, 'friendsResult'),
          where('userId', '==', friendUserId),
          where('quizId', '==', quiz.id),
          where('friendName', '==', friendName)
        );
        const existingResultSnapshot = await getDocs(existingResultQuery);
        if (!existingResultSnapshot.empty) {
          const docRef = existingResultSnapshot.docs[0].ref;
          await updateDoc(docRef, resultData);
        }
      } else {
        // Save new friend result
        await addDoc(collection(db, 'friendsResult'), resultData);
      }
    }

    setQuizCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  if (confirmRetake) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Confirm Quiz Retake</h2>
        <p className="mb-4">You've already taken this quiz before. Are you sure you want to submit this new result? This will replace your previous result and all your friends' assessments will be compared to this new result.</p>
        <button
          onClick={calculateResult}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mr-4"
        >
          Yes, submit new result
        </button>
        <button
          onClick={() => onComplete()}
          className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Assessment Completed!</h2>
        <p className="mb-4">Total Score: {totalScore}</p>
        <p className="mb-4">Self-Awareness Level: {selfAwarenessLevel}</p>
        {isUserQuiz ? (
          <p>Thank you for completing the self-assessment!</p>
        ) : (
          <p>Thank you for assessing your friend's self-awareness!</p>
        )}
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Question {currentQuestion + 1} of {questions.length}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {isUserQuiz ? currentQuestionData.question : `How often does your friend ${currentQuestionData.question.toLowerCase()}`}
      </h2>
      <div className="space-y-2">
        {currentQuestionData.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(currentQuestionData.id, option.value)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 text-left"
          >
            {isUserQuiz ? option.label : option.label.replace(/^You/, 'They')}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizComponent;