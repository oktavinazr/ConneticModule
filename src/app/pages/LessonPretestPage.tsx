import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCurrentUser } from '../utils/auth';
import { getLessonProgress, savePretestResult, isLessonUnlocked } from '../utils/progress';
import { lessons } from '../data/lessons';
import { TestPage } from '../components/TestPage';
import { Link } from 'react-router';
import { BookOpen, Lock } from 'lucide-react';

export function LessonPretestPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const lesson = lessonId ? lessons[lessonId] : null;

  const [progress, setProgress] = useState(() =>
    getLessonProgress(user!.id, lessonId!)
  );
  const [unlocked, setUnlocked] = useState(() => isLessonUnlocked(user!.id, lessonId!));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!lesson) {
      navigate('/dashboard');
      return;
    }

    if (!unlocked) {
      // Don't allow access if not unlocked
      return;
    }
  }, [user, lesson, unlocked, navigate]);

  if (!lesson) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <span className="text-xl text-indigo-900">CONNETIC Module</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Lock className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h1 className="text-gray-900 mb-4">{lesson.title} Terkunci</h1>
            <p className="text-lg text-gray-600 mb-6">
              Selesaikan pertemuan sebelumnya terlebih dahulu untuk membuka pertemuan ini.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleComplete = (score: number, answers: number[]) => {
    savePretestResult(user!.id, lessonId!, score, answers);
    setProgress(getLessonProgress(user!.id, lessonId!));
    // Will redirect to lesson stages after reviewing results
  };

  const existingAnswers = progress.pretestCompleted
    ? progress.answers.pretest
    : undefined;

  return (
    <TestPage
      title={`Pre-Test ${lesson.title}`}
      description={`Tes awal untuk mengukur pemahaman Anda tentang ${lesson.topic}`}
      questions={lesson.pretest.questions}
      onComplete={handleComplete}
      backPath={`/lesson/${lessonId}`}
      showResults={progress.pretestCompleted}
      existingAnswers={existingAnswers}
      existingScore={progress.pretestScore}
      duration={10} // 10 minutes for lesson pretest
      isLessonPretest={true}
    />
  );
}