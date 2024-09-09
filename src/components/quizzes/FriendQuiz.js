import React from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from './QuizComponent';

function FriendQuiz() {
  const { userId, quizId } = useParams();

  return (
    <QuizComponent
      isUserQuiz={false}
      isRetake={false}
      quiz={null}
      friendUserId={userId}
      friendQuizId={quizId}
    />
  );
}

export default FriendQuiz;