import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-xl mb-8">We appreciate your participation in the quiz.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default ThankYouPage;
