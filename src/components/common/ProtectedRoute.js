import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayur-light via-white to-ayur-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ayur-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ayur-primary font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    if (user.role === 'patient') return <Navigate to="/patient" replace />;
    if (user.role === 'practitioner') return <Navigate to="/practitioner" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;