
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on user role
  switch (user?.role) {
    case 'superadmin':
      return <Navigate to="/dashboard/superadmin" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'team-leader':
      return <Navigate to="/dashboard/team-leader" replace />;
    case 'tester':
      return <Navigate to="/dashboard/tester" replace />;
    case 'client':
      return <Navigate to="/dashboard/client" replace />;
    default:
      return <Navigate to="/not-authorized" replace />;
  }
};

export default Index;
