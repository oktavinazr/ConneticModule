import { createBrowserRouter, useParams, Navigate } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { GlobalPretestPage } from './pages/GlobalPretestPage';
import { GlobalPosttestPage } from './pages/GlobalPosttestPage';
import { LessonIntroPage } from './pages/LessonIntroPage';
import { LessonPretestPage } from './pages/LessonPretestPage';
import { LessonPage } from './pages/LessonPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { ReflectionPage } from './pages/ReflectionPage';
import { ReviewPage } from './pages/ReviewPage';
import { AnswerResultsPage } from './pages/admin/AnswerResultsPage';
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
      <ProtectedRoute requiredRole="student">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/results/:testType',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AnswerResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/results/:testType/:lessonId',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AnswerResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teacher',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/global-pretest',
    element: (
      <ProtectedRoute requiredRole="student">
        <GlobalPretestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/global-posttest',
    element: (
      <ProtectedRoute requiredRole="student">
        <GlobalPosttestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson-intro/:lessonId',
    element: (
      <ProtectedRoute requiredRole="student">
        <LessonIntroPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson-pretest/:lessonId',
    element: (
      <ProtectedRoute requiredRole="student">
        <LessonPretestPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson/:lessonId',
    element: (
      <ProtectedRoute requiredRole="student">
        <LessonPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/evaluation/:lessonId',
    element: (
      <ProtectedRoute requiredRole="student">
        <EvaluationPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reflection/:lessonId',
    element: (
      <ProtectedRoute requiredRole="student">
        <ReflectionPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/review/:lessonId',
    element: (
      <ProtectedRoute requiredRole="student">
        <ReviewPageWrapper />
      </ProtectedRoute>
    ),
  },
]);

function LessonIntroPageWrapper() {
  const { lessonId } = useParams();
  return <LessonIntroPage key={lessonId} />;
}

function LessonPretestPageWrapper() {
  const { lessonId } = useParams();
  return <LessonPretestPage key={lessonId} />;
}

function LessonPageWrapper() {
  const { lessonId } = useParams();
  return <LessonPage key={lessonId} />;
}

function EvaluationPageWrapper() {
  const { lessonId } = useParams();
  return <EvaluationPage key={lessonId} />;
}

function ReflectionPageWrapper() {
  const { lessonId } = useParams();
  return <ReflectionPage key={lessonId} />;
}

function ReviewPageWrapper() {
  const { lessonId } = useParams();
  return <ReviewPage key={lessonId} />;
}
