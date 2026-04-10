import { useNavigate } from 'react-router';
import { getCurrentUser } from '../utils/auth';
import {
  saveGlobalPosttestResult,
  getGlobalTestProgress,
  isGlobalPosttestUnlocked,
} from '../utils/progress';
import { globalPosttest } from '../data/lessons';
import { TestPage } from '../components/TestPage';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, Lock } from 'lucide-react';

export function GlobalPosttestPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [progress, setProgress] = useState(() => getGlobalTestProgress(user!.id));
  const [isUnlocked, setIsUnlocked] = useState(() => isGlobalPosttestUnlocked(user!.id));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isUnlocked) {
      // Don't allow access if not unlocked
      return;
    }
  }, [user, navigate, isUnlocked]);

  const handleComplete = (score: number, answers: number[]) => {
    saveGlobalPosttestResult(user!.id, score, answers);
    setProgress(getGlobalTestProgress(user!.id));
    // Don't auto-redirect, let user review
  };

  if (!isUnlocked) {
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
            <h1 className="text-gray-900 mb-4">Post-Test Umum Terkunci</h1>
            <p className="text-lg text-gray-600 mb-6">
              Anda harus menyelesaikan semua pertemuan (pretest, tahapan CTL, dan posttest) terlebih
              dahulu sebelum dapat mengakses Post-Test Umum.
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

  const existingAnswers = progress.globalPosttestCompleted
    ? JSON.parse(localStorage.getItem(`global_posttest_answers_${user!.id}`) || '[]')
    : undefined;

  return (
    <TestPage
      title={globalPosttest.title}
      description={globalPosttest.description}
      questions={globalPosttest.questions}
      onComplete={handleComplete}
      backPath="/dashboard"
      showResults={progress.globalPosttestCompleted}
      existingAnswers={existingAnswers}
      existingScore={progress.globalPosttestScore}
      duration={20} // 20 minutes for global posttest
    />
  );
}