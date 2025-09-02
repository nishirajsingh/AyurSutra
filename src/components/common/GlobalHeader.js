import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HEADER_LINKS, LOGO_CONFIG } from '../../constants';

const GlobalHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-ayur-primary rounded-xl flex items-center justify-center">
              <span className="text-xl">{LOGO_CONFIG.icon}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-ayur-primary">{LOGO_CONFIG.name}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">{LOGO_CONFIG.tagline}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {HEADER_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-gray-700 hover:text-ayur-primary font-medium transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <span className="text-ayur-primary font-medium">
                  Welcome, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <button 
                  onClick={() => {
                    if (user?.role === 'patient') navigate('/patient');
                    else if (user?.role === 'practitioner') navigate('/practitioner');
                    else navigate('/admin');
                  }}
                  className="btn-secondary"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-ayur-primary font-medium transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-ayur-primary hover:text-ayur-secondary font-medium transition-colors duration-300"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="btn-secondary"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Book Now
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-ayur-primary transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-ayur-primary mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-ayur-primary mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {HEADER_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-ayur-primary font-medium transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {isAuthenticated() ? (
                  <>
                    <span className="text-ayur-primary font-medium">
                      Welcome, {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <button 
                      onClick={() => {
                        if (user?.role === 'patient') navigate('/patient');
                        else if (user?.role === 'practitioner') navigate('/practitioner');
                        else navigate('/admin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-ayur-primary hover:text-ayur-secondary font-medium transition-colors duration-300"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-gray-600 hover:text-ayur-primary font-medium transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-ayur-primary hover:text-ayur-secondary font-medium transition-colors duration-300"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-ayur-secondary hover:text-ayur-primary font-medium transition-colors duration-300"
                    >
                      Sign Up
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn-primary w-full"
                    >
                      Book Now
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;