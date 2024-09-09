import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import quizzes from '../data/quizzes/quizzes';

function ResultsPage() {
  const [results, setResults] = useState({});
  const [friendResults, setFriendResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selfPerceptionScore, setSelfPerceptionScore] = useState(null);

  const fetchResults = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // Fetch the user's first (baseline) result for each quiz
      const userResultsQuery = query(
        collection(db, 'UserResults'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('timestamp', 'asc')
      );
      const userResultsSnapshot = await getDocs(userResultsQuery);
      const userResults = {};
      userResultsSnapshot.forEach(doc => {
        const data = doc.data();
        if (!userResults[data.quizId]) {
          userResults[data.quizId] = data; // Only keep the first result for each quiz
        }
      });
      setResults(userResults);

      // Fetch friend results
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (Object.keys(results).length === 0) return <div>No quiz results found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
      {Object.entries(results).map(([quizId, quizResult]) => (
        <div key={quizId} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{quizzes[quizId].title}</h2>
          <p className="mb-2">Total Score: {quizResult.totalScore}</p>
          <p className="mb-2">Average Score: {(quizResult.totalScore / quizzes[quizId].questions.length).toFixed(2)}</p>
          <p className="mb-4">Your Archetype: {quizResult.archetype}</p>
          
          <h3 className="text-xl font-semibold mb-2">Friend Assessments</h3>
          {friendResults.filter(fr => fr.quizId === quizId).length > 0 ? (
            <ul className="list-disc pl-5">
              {friendResults
                .filter(fr => fr.quizId === quizId)
                .map((fr, index) => (
                  <li key={index}>
                    Friend's assessment: {fr.archetype} (Score: {fr.totalScore})
                  </li>
                ))}
            </ul>
          ) : (
            <p>No friend assessments for this quiz yet.</p>
          )}
        </div>
      ))}
      {selfPerceptionScore !== null && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Self-Perception Score</h2>
          <p>{selfPerceptionScore}% agreement between your self-assessment and your friends' assessments</p>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
