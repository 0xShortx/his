import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaList, FaChartBar } from 'react-icons/fa';

function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/quizzes', icon: FaList, label: 'All Quizzes' },
    { path: '/my-results', icon: FaChartBar, label: 'My Results' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 px-4 ${
              location.pathname === item.path ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <item.icon className="text-2xl mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;