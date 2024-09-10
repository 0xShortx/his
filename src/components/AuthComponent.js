import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaGoogle, FaTwitter, FaLightbulb } from 'react-icons/fa';

function AuthComponent() {
  const [error, setError] = useState(null);

  const saveUserData = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If the user document doesn't exist, create it
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        quizzesTaken: [],
        results: {}
      });
    } else {
      // If the user document exists, update the last login
      await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
    }
  };

  const handleSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserData(result.user);
    } catch (error) {
      setError(`Failed to sign in: ${error.message}`);
      console.error(error);
    }
  };

  const signInWithGoogle = () => handleSignIn(new GoogleAuthProvider());
  const signInWithTwitter = () => handleSignIn(new TwitterAuthProvider());

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Welcome to Your Self-Awareness Journey!</h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <FaLightbulb className="text-yellow-400 text-4xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Unlock Your Potential</h3>
          </div>
          <p className="text-gray-600 mb-6 text-center">
            Sign up to embark on a journey of self-discovery. By creating an account, you'll be able to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Track your progress over time</li>
            <li>Compare your results with friends</li>
            <li>Access personalized insights and recommendations</li>
            <li>Join a community of like-minded individuals</li>
          </ul>
          <p className="text-gray-600 mb-6 text-center">
            Choose your preferred sign-in method to get started:
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full mb-4 flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            <FaGoogle className="mr-2" /> Continue with Google
          </button>
          <button
            onClick={signInWithTwitter}
            className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          >
            <FaTwitter className="mr-2" /> Continue with Twitter
          </button>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          <p className="mt-6 text-sm text-gray-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;