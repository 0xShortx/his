import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { FcGoogle } from 'react-icons/fc';

function AuthPage() {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Welcome to HowISeem</h1>
        <button
          onClick={handleGoogleSignIn}
          className="btn-primary w-full flex items-center justify-center"
        >
          <FcGoogle className="w-6 h-6 mr-2" />
          Sign In / Sign Up with Google
        </button>
      </div>
    </div>
  );
}

export default AuthPage;