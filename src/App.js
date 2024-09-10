import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizComponent from './components/quizzes/QuizComponent';
import DetailedQuizResult from './components/quizzes/DetailedQuizResult';
import FriendQuizComponent from './components/quizzes/FriendQuizComponent';
import AllQuizzes from './components/AllQuizzes';
import MyResults from './components/MyResults';
import Profile from './components/Profile';
import Login from './components/Login';
import About from './components/About';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Blog from './components/Blog';
import FAQ from './components/FAQ';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/:quizId" element={<QuizComponent />} />
          <Route path="/quiz-result/:quizId" element={<DetailedQuizResult />} />
          <Route path="/friend-quiz/:userId/:quizId" element={<FriendQuizComponent />} />
          <Route path="/quizzes" element={<AllQuizzes />} />
          <Route path="/my-results" element={<MyResults />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;