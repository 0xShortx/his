import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

function AllQuizzes() {
  const navigate = useNavigate();

  // This array will contain all available quizzes
  // Make sure the id matches the one used in your quizzes data
  const availableQuizzes = [
    {
      id: 'self-awareness-quiz', // This now matches the ID in quizzes.js
      title: 'Self-Awareness Quiz',
      description: 'Discover your level of self-awareness and understand your thoughts, emotions, and behaviors better.',
      icon: FaClipboardList,
    },
    // Add more quizzes here in the future
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <quiz.icon className="text-3xl text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
            </div>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllQuizzes;