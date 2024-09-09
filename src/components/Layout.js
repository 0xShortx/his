import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout;