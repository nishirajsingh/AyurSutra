import React from 'react';

const Header = ({ title, userType = 'patient', onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-ayur-primary">{title}</h1>
          <p className="text-sm text-gray-600 capitalize">{userType} Portal</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-ayur-accent rounded-full flex items-center justify-center">
            <span className="text-ayur-primary font-medium">U</span>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-ayur-primary transition-colors duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;