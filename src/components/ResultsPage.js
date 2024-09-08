import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import quizzes from '../data/quizzes/quizzes';
import * as Progress from '@radix-ui/react-progress';
import * as Separator from '@radix-ui/react-separator';
import { Copy } from 'lucide-react';

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
    <div className="content-wrapper">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Results</h1>
          <p className="text-lg text-gray-700 mb-6">Welcome, {auth.currentUser?.displayName}!</p>
          
          {Object.entries(results).map(([quizId, result]) => {
            const quiz = quizzes[quizId];
            if (!quiz) return null;
            return (
              <div key={quizId} className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Results</h2>
                <p className="text-sm text-gray-600 mb-4">{quiz.title}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total score:</span>
                    <span className="font-semibold text-gray-800">{result.totalScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Score Percentage:</span>
                    <span className="font-semibold text-gray-800">{result.scorePercentage.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Self-awareness level:</span>
                    <span className="font-semibold text-blue-600">{result.selfAwarenessLevel}</span>
                  </div>
                </div>
                
                {selfPerceptionScore !== null && (
                  <div className="mb-6">
                    <span className="text-gray-700">Self-perception score:</span>
                    <div className="flex items-center space-x-2 mt-2">
                      <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-4" value={selfPerceptionScore}>
                        <Progress.Indicator
                          className="bg-blue-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                          style={{ transform: `translateX(-${100 - selfPerceptionScore}%)` }}
                        />
                      </Progress.Root>
                      <span className="font-semibold text-gray-800">{selfPerceptionScore}%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">This score indicates how closely your self-assessment aligns with your friends' assessments. A higher score means greater alignment.</p>
                  </div>
                )}
                
                <Separator.Root className="bg-gray-200 h-px w-full my-6" />
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Share with Friends</h3>
                  <button 
                    className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                    onClick={() => copyToClipboard(quizId)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Friend Quiz Link
                  </button>
                  {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Friend Assessments</h3>
                  {friendResults.length > 0 ? (
                    friendResults.map((friendResult, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">{friendResult.friendName || `Friend ${index + 1}`} assessment:</span>
                        <span className="text-gray-600">{getInterpretation(friendResult.totalScore, quiz)}</span>
                      </div>
                    ))
                  ) : (
                    <p>No friend assessments available yet.</p>
                  )}
                </div>
              </div>
            );
          })}
          
          <button 
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.history.back()}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
