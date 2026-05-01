import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  BookOpen,
  ChevronLeft,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Lock,
  BookMarked,
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { isLessonUnlocked, getLessonProgress } from '../utils/progress';
import { lessons, lessonMainObjectives } from '../data/lessons';
import { LessonFlowSidebar } from '../components/LessonFlowSidebar';
import { Logo } from '../components/layout/Logo';

export function LessonIntroPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser);
  const lesson = lessonId ? lessons[lessonId] : null;
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState({
    lessonId: lessonId ?? '',
    userId: user?.id ?? '',
    pretestCompleted: false,
    completedStages: [] as number[],
    posttestCompleted: false,
    answers: {} as Record<string, any>,
    stageAttempts: {} as Record<string, number>,
    stageSuccess: {} as Record<string, boolean>,
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!lesson) { navigate('/dashboard'); return; }
    isLessonUnlocked(user.id, lessonId!).then(setUnlocked);
    getLessonProgress(user.id, lessonId!).then(setProgress);
  }, [user, lesson, lessonId, navigate]);

  const fullyCompleted =
    progress.pretestCompleted &&
    progress.completedStages.length === lesson?.stages.length &&
    progress.posttestCompleted;

  if (!lesson) return null;

  // Header bersama
  const header = (
    <header className="sticky top-0 z-50 w-full border-b border-[#C8D8F0] bg-white/95 shadow-md backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="hidden sm:block min-w-0">
                <Logo />
              </div>
              <div className="sm:hidden">
                <Logo size="sm" />
              </div>
            </Link>
            <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#628ECB]/10 px-3 py-1 text-xs font-bold text-[#628ECB] uppercase tracking-widest border border-[#628ECB]/20">
              {lesson.title}
            </span>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
        {header}
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

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {header}

      <div className="max-w-7xl mx-auto lg:flex lg:items-start lg:gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar (Hanya Desktop) */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-[92px]">
          <LessonFlowSidebar
            lesson={lesson}
            lessonId={lessonId!}
            progress={progress}
            currentStep={1}
            fullyCompleted={fullyCompleted}
          />
        </aside>

        {/* Konten utama */}
        <main className="flex-1 min-w-0">
          {/* Mobile: strip identitas pertemuan */}
          <div className="lg:hidden mb-4 bg-gradient-to-r from-[#395886] to-[#628ECB] rounded-2xl px-4 py-3">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{lesson.title}</p>
            <p className="text-sm font-bold text-white">{lesson.topic}</p>
          </div>

          <div className="space-y-4">
            {/* Tujuan Pembelajaran Utama */}
            <div className="bg-white rounded-[2rem] border border-[#D5DEEF] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#628ECB]/10 bg-[#628ECB]/5 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Target className="h-4 w-4 text-[#628ECB]" />
                </div>
                <h2 className="text-base font-bold text-[#395886]">Tujuan Pembelajaran Utama</h2>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium leading-relaxed text-[#395886]/80">
                  {lessonMainObjectives[lesson.id] ?? lesson.description}
                </p>
              </div>
            </div>

            {/* Materi yang Akan Dipelajari */}
            {lesson.materials && lesson.materials.length > 0 && (
              <div className="bg-white rounded-[2rem] border border-[#D5DEEF] shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 border-b border-[#EC4899]/10 bg-[#EC4899]/5 px-6 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                    <BookMarked className="h-4 w-4 text-[#EC4899]" />
                  </div>
                  <h2 className="text-base font-bold text-[#395886]">Materi yang Akan Dipelajari</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {lesson.materials.map((mat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EC4899]/10 text-[10px] font-bold text-[#EC4899] mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-[#395886]/80 leading-relaxed">{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Kompetensi Awal */}
            <div className="bg-white rounded-[2rem] border border-[#D5DEEF] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#10B981]/10 bg-[#10B981]/5 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Lightbulb className="h-4 w-4 text-[#10B981]" />
                </div>
                <h2 className="text-base font-bold text-[#395886]">Kompetensi Awal</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {lesson.initialCompetencies.map((comp, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] transition-all hover:border-[#10B981]/30 hover:shadow-sm">
                      <CheckCircle className="h-5 w-5 shrink-0 text-[#10B981]" />
                      <span className="text-xs font-medium text-[#395886]/80 leading-snug">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-[#D5DEEF] shadow-sm px-5 py-4">
              <p className="text-sm text-[#395886]/60 font-medium text-center sm:text-left">
                Siap memulai? Kerjakan pre-test untuk mengukur pemahaman awal Anda.
              </p>
              <Link
                to={`/lesson-pretest/${lessonId}`}
                className="shrink-0 inline-flex items-center gap-2 bg-[#628ECB] text-white px-6 py-2.5 rounded-xl hover:bg-[#395886] transition-all font-bold text-sm shadow-md active:scale-95"
              >
                Mulai Pre-Test
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
