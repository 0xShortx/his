import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import FriendQuizComponent from './components/FriendQuizComponent';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/friend-quiz/:userId/:quizId" element={<FriendQuizComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;