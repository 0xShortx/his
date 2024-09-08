import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

function QuizComponent({ quiz, isUserQuiz, friendUserId, friendName, onComplete, isRetake }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selfAwarenessLevel, setSelfAwarenessLevel] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setTotalScore(score);
    
    const maxPossibleScore = quiz.questions.length * 4;
    const scorePercentage = (score / maxPossibleScore) * 100;
    
    let determinedLevel = '';
    for (const range of quiz.scoring.ranges) {
      if (scorePercentage <= range.maxPercentage) {
        determinedLevel = range.level;
        break;
      }
    }

    setSelfAwarenessLevel(determinedLevel);

    const resultData = {
      userId: isUserQuiz ? auth.currentUser.uid : friendUserId,
      quizId: quiz.id,
      answers,
      totalScore: score,
      scorePercentage,
      selfAwarenessLevel: determinedLevel,
      timestamp: new Date(),
      friendName: isUserQuiz ? null : friendName
    };

    try {
      if (isUserQuiz) {
        if (isRetake) {
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
          await addDoc(collection(db, 'UserResults'), resultData);
        }
      } else {
        await addDoc(collection(db, 'friendsResult'), resultData);
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

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Question {currentQuestion + 1} of {quiz.questions.length}</p>
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