import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-300">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-300">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-300">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-blue-300">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li><Link to="/quizzes" className="hover:text-blue-300">All Quizzes</Link></li>
            <li><Link to="/blog" className="hover:text-blue-300">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-blue-300">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
          <ul className="space-y-2">
            <li><a href="https://twitter.com/howiseem" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Twitter</a></li>
            <li><a href="https://facebook.com/howiseem" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Facebook</a></li>
            <li><a href="https://instagram.com/howiseem" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; 2023 HowISeem. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;