import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import quizzes from '../data/quizzes/quizzes';

function ResultsPage() {
  const [results, setResults] = useState({});
  const [friendResults, setFriendResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const [selfPerceptionScore, setSelfPerceptionScore] = useState(null);

  const fetchResults = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const userResultsQuery = query(collection(db, 'UserResults'), where('userId', '==', auth.currentUser.uid));
      const userResultsSnapshot = await getDocs(userResultsQuery);
      const userResults = {};
      userResultsSnapshot.forEach(doc => {
        const data = doc.data();
        userResults[data.quizId] = data;
      });
      setResults(userResults);

      const friendResultsQuery = query(collection(db, 'friendsResult'), where('userId', '==', auth.currentUser.uid));
      const friendResultsSnapshot = await getDocs(friendResultsQuery);
      const newFriendResults = friendResultsSnapshot.docs.map(doc => doc.data());
      setFriendResults(newFriendResults);

      console.log("User Results:", userResults);
      console.log("Friend Results:", newFriendResults);
      console.log("Available Quizzes:", quizzes);

      // Calculate self-perception score
      if (Object.keys(userResults).length > 0 && newFriendResults.length > 0) {
        const quiz = quizzes[Object.keys(userResults)[0]];
        const maxPossibleScore = quiz.questions.length * 4; // Assuming 4 is the max score per question
        const userScore = userResults[Object.keys(userResults)[0]].totalScore;
        const friendScores = newFriendResults.map(doc => doc.totalScore);
        const avgFriendScore = friendScores.reduce((a, b) => a + b, 0) / friendScores.length;
        
        const actualDifference = Math.abs(userScore - avgFriendScore);
        const maxPossibleDifference = maxPossibleScore; // The maximum possible difference is now the maximum possible score
        const agreementPercentage = ((maxPossibleDifference - actualDifference) / maxPossibleDifference) * 100;
        
        setSelfPerceptionScore(Math.round(agreementPercentage));
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setError(`Error fetching results: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const getInterpretation = (score, quiz) => {
    for (const range of quiz.scoring.ranges) {
      if (score >= range.min && score <= range.max) {
        return range.level;
      }
    }
    return 'Unknown';
  };

  const copyToClipboard = (quizId) => {
    const friendQuizLink = `${window.location.origin}/friend-quiz/${auth.currentUser.uid}/${quizId}`;
    navigator.clipboard.writeText(friendQuizLink).then(() => {
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    }, (err) => {
      console.error('Failed to copy text: ', err);
      setCopySuccess('Failed to copy');
    });
  };

  if (loading) return <div>Loading results...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-4">Your Results</h2>
      {Object.entries(results).map(([quizId, result]) => {
        const quiz = quizzes[quizId];
        if (!quiz) {
          console.error(`Quiz with ID ${quizId} not found`);
          return null;
        }
        return (
          <div key={quizId} className="mb-8">
            <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
            <p>Your total score: {result.totalScore}</p>
            <p>Score Percentage: {result.scorePercentage.toFixed(2)}%</p>
            <p>Your self-awareness level: {result.selfAwarenessLevel}</p>
            {selfPerceptionScore !== null && (
              <p>Self-perception score: {selfPerceptionScore}%</p>
            )}
            <p>Interpretation: This score indicates how closely your self-assessment aligns with your friends' assessments. A higher score means greater alignment.</p>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Share with Friends</h3>
              <button 
                onClick={() => copyToClipboard(quizId)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Copy Friend Quiz Link
              </button>
              {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
            </div>

            <h3 className="text-xl font-bold mt-6 mb-2">Friend Assessments</h3>
            {friendResults.length > 0 ? (
              friendResults.map((friendResult, index) => (
                <div key={index} className="mb-2">
                  <p>Friend {index + 1} assessment: {getInterpretation(friendResult.totalScore, quiz)}</p>
                </div>
              ))
            ) : (
              <p>No friend assessments available yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ResultsPage;
