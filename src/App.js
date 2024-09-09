import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizComponent from './components/quizzes/QuizComponent';
import DetailedQuizResult from './components/quizzes/DetailedQuizResult';
import FriendQuiz from './components/quizzes/FriendQuiz';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/:quizId" element={<QuizComponent />} />
          <Route path="/quiz-result/:quizId" element={<DetailedQuizResult />} />
          <Route path="/friend-quiz/:userId/:quizId" element={<FriendQuiz />} />
          {/* Add other routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;