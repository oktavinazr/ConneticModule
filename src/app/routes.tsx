import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { GlobalPretestPage } from './pages/GlobalPretestPage';
import { GlobalPosttestPage } from './pages/GlobalPosttestPage';
import { LessonPretestPage } from './pages/LessonPretestPage';
import { LessonPage } from './pages/LessonPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teacher-dashboard',
    element: (
      <ProtectedRoute>
        <TeacherDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/global-pretest',
    element: (
      <ProtectedRoute>
        <GlobalPretestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/global-posttest',
    element: (
      <ProtectedRoute>
        <GlobalPosttestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson-pretest/:lessonId',
    element: (
      <ProtectedRoute>
        <LessonPretestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson/:lessonId',
    element: (
      <ProtectedRoute>
        <LessonPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/evaluation/:lessonId',
    element: (
      <ProtectedRoute>
        <EvaluationPage />
      </ProtectedRoute>
    ),
  },
]);