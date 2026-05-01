import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { getCurrentUser, isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = getCurrentUser();
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to={currentUser?.role === 'admin' ? '/teacher' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
