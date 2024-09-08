import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { FaGoogle, FaTwitter } from 'react-icons/fa';

function AuthPage() {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTwitterSignIn = async () => {
    const provider = new TwitterAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Welcome to HowISeem 🌟
          </h1>
          <p className="mt-2 text-center text-xl text-gray-600">
            Discover your true self through others' eyes 👀
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What you'll get:</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-2xl mr-2">🧠</span>
                <span>Insightful personality quizzes</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">👥</span>
                <span>Friend feedback on your personality</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">🔍</span>
                <span>Compare self-perception vs. others' views</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-2">🚀</span>
                <span>Personal growth insights</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              <FaGoogle className="h-5 w-5 mr-2" />
              Sign in with Google
            </button>
            <button
              onClick={handleTwitterSignIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-150 ease-in-out"
            >
              <FaTwitter className="h-5 w-5 mr-2" />
              Sign in with Twitter
            </button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="/signup"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Sign up with Email
              </a>
            </div>
          </div>
        </div>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default AuthPage;