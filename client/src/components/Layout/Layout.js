import React from 'react';
import { useSelector } from 'react-redux';
import { selectSidebarOpen } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className={`${sidebarOpen ? 'main-content-with-sidebar' : 'main-content-full'} main-content`}>
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;