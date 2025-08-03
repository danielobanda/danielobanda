import React from 'react';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="absolute inset-0 bg-white/50"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;