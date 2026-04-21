import { useNavigate, Link } from 'react-router';
import { getCurrentUser } from '../utils/auth';
import {
  saveGlobalPosttestResult,
  getGlobalTestProgress,
  isGlobalPosttestUnlocked,
} from '../utils/progress';
import { globalPosttest } from '../data/lessons';
import { TestPage } from '../components/TestPage';
import { useEffect, useState } from 'react';
import { BookOpen, Lock } from 'lucide-react';

export function GlobalPosttestPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [progress, setProgress] = useState(() => getGlobalTestProgress(user!.id));
  const [isUnlocked] = useState(() => isGlobalPosttestUnlocked(user!.id));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleComplete = (score: number, answers: number[]) => {
    saveGlobalPosttestResult(user!.id, score, answers);
    setProgress(getGlobalTestProgress(user!.id));
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
        <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[76px] items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                  </div>
                </Link>
                <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
                <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">Post-Test Umum</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-[2rem] shadow-lg p-8 text-center border border-[#D5DEEF]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#395886] mb-3">Post-Test Umum Terkunci</h1>
            <p className="text-[#395886]/70 mb-8 font-medium">
              Selesaikan semua pertemuan terlebih dahulu sebelum dapat mengakses post-test umum.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-[#628ECB] text-white px-8 py-3 rounded-2xl hover:bg-[#395886] transition-colors font-bold shadow-lg"
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
      duration={20}
      instructions={[
        'Kerjakan posttest setelah menyelesaikan seluruh rangkaian pembelajaran.',
        'Jawab setiap soal berdasarkan pemahaman akhir Anda tanpa bantuan teman atau catatan.',
        'Periksa kembali pilihan Anda sebelum menekan tombol selesai pada soal terakhir.',
      ]}
      durationNote="Durasi pengerjaan 20 menit. Manfaatkan waktu untuk meninjau jawaban agar hasil akhir merefleksikan pemahaman Anda."
    />
  );
}
