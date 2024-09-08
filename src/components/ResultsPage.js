import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { selfAwarenessQuiz } from '../data/quizzes/selfAwarenessQuiz';

function ResultsPage() {
  const [userResult, setUserResult] = useState(null);
  const [friendResults, setFriendResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const [selfPerceptionScore, setSelfPerceptionScore] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!auth.currentUser) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const userResultQuery = query(collection(db, 'UserResults'), where('userId', '==', auth.currentUser.uid));
        const userResultSnapshot = await getDocs(userResultQuery);
        if (!userResultSnapshot.empty) {
          setUserResult(userResultSnapshot.docs[0].data());
        }

        const friendResultsQuery = query(collection(db, 'friendsResult'), where('userId', '==', auth.currentUser.uid));
        const friendResultsSnapshot = await getDocs(friendResultsQuery);
        setFriendResults(friendResultsSnapshot.docs.map(doc => doc.data()));

        // Calculate self-perception score
        if (userResultSnapshot.docs[0] && friendResultsSnapshot.docs.length > 0) {
          const userScore = userResultSnapshot.docs[0].data().totalScore;
          const friendScores = friendResultsSnapshot.docs.map(doc => doc.data().totalScore);
          const avgFriendScore = friendScores.reduce((a, b) => a + b, 0) / friendScores.length;
          const maxPossibleDifference = 30; // Max difference possible (40 - 10)
          const actualDifference = Math.abs(userScore - avgFriendScore);
          const score = 100 - (actualDifference / maxPossibleDifference) * 100;
          setSelfPerceptionScore(Math.round(score));
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(`Error fetching results: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getInterpretation = (score) => {
    for (const range of selfAwarenessQuiz.scoring.ranges) {
      if (score >= range.min && score <= range.max) {
        return range.level;
      }
    }
    return 'Unknown';
  };

  const copyToClipboard = () => {
    const friendQuizLink = `${window.location.origin}/friend-quiz/${auth.currentUser.uid}/${selfAwarenessQuiz.id}`;
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
      {userResult ? (
        <div>
          <p>Your total score: {userResult.totalScore}</p>
          <p>Your self-awareness level: {getInterpretation(userResult.totalScore)}</p>
          {selfPerceptionScore !== null && (
            <p>Self-perception score: {selfPerceptionScore}/100</p>
          )}
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Share with Friends</h3>
            <button 
              onClick={copyToClipboard}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Copy Friend Quiz Link
            </button>
            {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
          </div>

          <h3 className="text-xl font-bold mt-6 mb-2">Friend Assessments</h3>
          {friendResults.length > 0 ? (
            friendResults.map((result, index) => (
              <div key={index} className="mb-2">
                <p>Friend {index + 1} assessment: {getInterpretation(result.totalScore)}</p>
              </div>
            ))
          ) : (
            <p>No friend assessments available yet.</p>
          )}
        </div>
      ) : (
        <p>No results available. Take the quiz first!</p>
      )}
    </div>
  );
}

export default ResultsPage;
