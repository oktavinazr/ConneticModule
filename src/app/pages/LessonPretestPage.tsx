import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getCurrentUser } from '../utils/auth';
import { getLessonProgress, savePretestResult, isLessonUnlocked } from '../utils/progress';
import { lessons } from '../data/lessons';
import { TestPage } from '../components/TestPage';
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
      // Jangan izinkan akses jika belum terbuka
      return;
    }
  }, [user, lesson, unlocked, navigate]);

  if (!lesson) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
        <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[76px] items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                  </div>
                </Link>
                <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
                <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">Pre-Test Pertemuan</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-[2rem] shadow-lg p-8 text-center border border-[#D5DEEF]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#395886] mb-3">{lesson.title} Terkunci</h1>
            <p className="text-[#395886]/70 mb-8 font-medium">
              Selesaikan pertemuan sebelumnya terlebih dahulu untuk membuka pertemuan ini.
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

  const handleComplete = (score: number, answers: number[]) => {
    savePretestResult(user!.id, lessonId!, score, answers);
    setProgress(getLessonProgress(user!.id, lessonId!));
    // Akan mengarahkan ke tahapan pertemuan setelah meninjau hasil
  };

  const existingAnswers = progress.pretestCompleted
    ? progress.answers.pretest
    : undefined;

  return (
    <TestPage
      title={`Pre-Test ${lesson.title}`}
      description={`Tes awal untuk mengukur pemahaman awal Anda sebelum mempelajari ${lesson.topic}.`}
      questions={lesson.pretest.questions}
      onComplete={handleComplete}
      backPath={progress.pretestCompleted ? `/lesson/${lessonId}` : `/lesson-intro/${lessonId}`}
      showResults={progress.pretestCompleted}
      existingAnswers={existingAnswers}
      existingScore={progress.pretestScore}
      duration={10}
      isLessonPretest={true}
      lessonFlow={{
        step: 2,
        lessonId: lessonId!,
        pretestCompleted: progress.pretestCompleted,
        allStagesCompleted: progress.completedStages.length === lesson.stages.length,
        posttestCompleted: progress.posttestCompleted,
      }}
    />
  );
}
