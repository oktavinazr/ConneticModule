import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { isAuthenticated } from '../utils/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
