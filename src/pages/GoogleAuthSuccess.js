import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);

        // Check if user needs to complete profile
        if (!user.phone || !user.role || (user.role === 'patient' && !user.age)) {
          navigate('/complete-profile');
        } else {
          // Redirect to appropriate dashboard
          if (user.role === 'patient') navigate('/patient');
          else if (user.role === 'practitioner') navigate('/practitioner');
          else navigate('/admin');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayur-light via-white to-ayur-accent/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-ayur-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-ayur-primary font-medium">Completing Google Sign In...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;