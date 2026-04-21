import { Link, useNavigate } from 'react-router';
import { BookOpen, CheckCircle, HelpCircle, LogOut, Lock, Target, Trophy, User, Users, ArrowRight, ClipboardList, X, ChevronRight } from 'lucide-react';
import { getAllStudents, getCurrentUser, logout } from '../utils/auth';
import {
  getAllProgress,
  getGlobalTestProgress,
  isLessonUnlocked,
  isGlobalPosttestUnlocked,
} from '../utils/progress';
import { lessons, globalPretest, globalPosttest, type TestQuestion } from '../data/lessons';
import { ProfileModal } from '../components/ProfileModal';
import { GuideModal } from '../components/GuideModal';
import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { MobileSidebar } from '../components/MobileSidebar';

const GROUP_STORAGE_KEY = 'student-groups';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const progress = getAllProgress(user!.id);
  const globalTestProgress = getGlobalTestProgress(user!.id);
  const globalPosttestUnlocked = isGlobalPosttestUnlocked(user!.id);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [groupVersion, setGroupVersion] = useState(0);

  const [mainTab, setMainTab] = useState<'kegiatan' | 'hasil'>('kegiatan');
  const [hasilTab, setHasilTab] = useState<'pretest' | 'treatment' | 'posttest'>('pretest');

  const [reviewModal, setReviewModal] = useState<{
    title: string;
    questions: TestQuestion[];
    studentAnswers: number[];
    score: number;
  } | null>(null);

  const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

  const openReview = (
    title: string,
    questions: TestQuestion[],
    studentAnswers: number[],
    score: number,
  ) => setReviewModal({ title, questions, studentAnswers, score });

  const firstName = user?.name.split(' ')[0] || user?.name;
  const fullName = user?.name;

  const availableGroups = useMemo(() => {
    const firstLesson = Object.values(lessons)[0];
    const learningCommunityStage = firstLesson?.stages.find((stage) => stage.type === 'learning-community');
    return learningCommunityStage?.groupActivity?.groupNames ?? ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5'];
  }, []);

  const groupAssignments = useMemo(() => {
    return JSON.parse(localStorage.getItem(GROUP_STORAGE_KEY) || '{}') as Record<string, string>;
  }, [groupVersion]);

  const selectedGroup = groupAssignments[user!.id] || '';

  const studentsInSelectedGroup = useMemo(() => {
    const students = getAllStudents();
    if (!selectedGroup) return [];
    return students.filter((student) => groupAssignments[student.id] === selectedGroup);
  }, [groupAssignments, selectedGroup]);

  const saveGroupSelection = (groupName: string) => {
    const nextAssignments = {
      ...groupAssignments,
      [user!.id]: groupName,
    };
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(nextAssignments));
    setGroupVersion((value) => value + 1);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                </div>
              </Link>
              <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
              <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">Dashboard</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden items-center gap-6 md:flex">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors cursor-pointer text-sm font-semibold"
                >
                  <User className="w-4 h-4" />
                  <span>{firstName}</span>
                </button>
                <button
                  onClick={() => setIsGroupOpen(true)}
                  className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors cursor-pointer text-sm font-semibold"
                >
                  <Users className="w-4 h-4" />
                  <span>{selectedGroup || 'Kelompok'}</span>
                </button>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors cursor-pointer text-sm font-semibold"
                >
                  <HelpCircle className="w-4 h-4" />
                  Panduan
                </button>
                <div className="h-6 w-px bg-[#D5DEEF]" />
                <button
                  onClick={() => setIsLogoutOpen(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
              <MobileSidebar
                title="Menu Dashboard"
                description="Akses fitur utama dashboard siswa."
                items={[
                  { label: 'Dashboard', to: '/dashboard', icon: <BookOpen className="h-4 w-4" /> },
                  { label: 'Kelompok', onClick: () => setIsGroupOpen(true), icon: <Users className="h-4 w-4" /> },
                  { label: 'Panduan', onClick: () => setIsGuideOpen(true), icon: <HelpCircle className="h-4 w-4" /> },
                  { label: 'Logout', onClick: () => setIsLogoutOpen(true), icon: <LogOut className="h-4 w-4" />, danger: true },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome + Capaian */}
        <div className="flex flex-col gap-5 mb-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#D5DEEF] bg-white shadow-sm">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(98,142,203,0.08),_transparent_60%)]" />
            <div className="absolute right-0 top-0 h-48 w-48 -translate-y-8 translate-x-8 rounded-full bg-[#628ECB]/6 blur-3xl" />
            <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
              {/* Greeting */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-[#628ECB]">Ruang Belajar Siswa</p>
                <h1 className="mt-2 text-2xl font-black text-[#395886] sm:text-3xl tracking-tight">
                  Hai, {fullName}!
                </h1>
                <p className="mt-2 text-base text-[#395886]/60 font-medium leading-relaxed max-w-xl">Lanjutkan aktivitas belajar dan pantau progres pembelajaran Anda.</p>
              </div>
              {/* Quick progress stats */}
              <div className="hidden sm:flex items-center gap-3">
                {(() => {
                  const completedLessons = progress.filter(p => {
                    const lesson = lessons[p.lessonId];
                    return p.pretestCompleted && p.completedStages.length === lesson?.stages.length && p.posttestCompleted;
                  }).length;
                  const totalLessons = Object.keys(lessons).length;
                  return (
                    <>
                      <div className="flex flex-col items-center rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] px-5 py-3">
                        <p className="text-lg font-extrabold text-[#628ECB]">{completedLessons}/{totalLessons}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/45">Pertemuan</p>
                      </div>
                      <div className="flex flex-col items-center rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] px-5 py-3">
                        <p className="text-lg font-extrabold text-[#10B981]">
                          {globalTestProgress.globalPretestCompleted ? '✓' : '—'}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/45">Pre-Test</p>
                      </div>
                      <div className="flex flex-col items-center rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] px-5 py-3">
                        <p className="text-lg font-extrabold text-[#F59E0B]">
                          {globalTestProgress.globalPosttestCompleted ? '✓' : '—'}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/45">Post-Test</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="bg-[#D5DEEF]/40 rounded-[2rem] p-6 border border-[#B1C9EF] relative overflow-hidden">
            <div className="relative flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB] text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="text-lg font-bold text-[#395886]">Capaian Pembelajaran</h2>
                <div className="bg-white/80 rounded-[1.5rem] p-5 border border-[#D5DEEF] shadow-sm backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-[#395886] mb-2">Elemen: Media dan Jaringan Telekomunikasi</h3>
                  <p className="text-sm text-[#395886]/75 leading-relaxed">
                    Pada akhir fase E peserta didik mampu memahami prinsip dasar sistem IPV4/IPV6, TCP IP,
                    Networking Service, Sistem Keamanan Jaringan Telekomunikasi, Sistem Seluler,
                    Sistem Microwave, Sistem VSAT IP, Sistem Optik, dan Sistem WLAN.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN TABS ─────────────────────────────────────────────────────── */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex gap-1 rounded-2xl border border-[#D5DEEF] bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setMainTab('kegiatan')}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                mainTab === 'kegiatan'
                  ? 'bg-[#628ECB] text-white shadow-md'
                  : 'text-[#395886]/60 hover:bg-[#F0F3FA] hover:text-[#395886]'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Kegiatan Pembelajaran
            </button>
            <button
              onClick={() => setMainTab('hasil')}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                mainTab === 'hasil'
                  ? 'bg-[#628ECB] text-white shadow-md'
                  : 'text-[#395886]/60 hover:bg-[#F0F3FA] hover:text-[#395886]'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              Hasil Belajar
            </button>
          </div>
        </div>

        {/* ── TAB: KEGIATAN PEMBELAJARAN ──────────────────────────────────── */}
        {mainTab === 'kegiatan' && (
          <>
            {/* Compact Pre-Test Umum strip */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#C4B5FD]/60 bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/15 text-[#7C3AED]">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#3B1F6E]">Pre-Test Umum</p>
                  <p className="text-xs text-[#3B1F6E]/55 font-medium">
                    {globalTestProgress.globalPretestCompleted ? 'Sudah dikerjakan' : 'Belum dikerjakan — kerjakan sebelum memulai pertemuan'}
                  </p>
                </div>
              </div>
              <Link
                to="/global-pretest"
                className="shrink-0 rounded-xl bg-[#7C3AED] px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#6D28D9] active:scale-95"
              >
                {globalTestProgress.globalPretestCompleted ? 'Tinjau' : 'Mulai Pre-Test'}
              </Link>
            </div>

            {/* Lesson grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-6">
          {Object.values(lessons).map((lesson) => {
            const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
            const pretestCompleted = lessonProgress?.pretestCompleted || false;
            const completedStages = lessonProgress?.completedStages.length || 0;
            const totalStages = lesson.stages.length;
            const posttestCompleted = lessonProgress?.posttestCompleted || false;
            const unlocked = isLessonUnlocked(user!.id, lesson.id);

            const totalSteps = 1 + totalStages + 1;
            let completedSteps = 0;
            if (pretestCompleted) completedSteps += 1;
            completedSteps += completedStages;
            if (posttestCompleted) completedSteps += 1;

            const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
            const fullyCompleted = pretestCompleted && completedStages === totalStages && posttestCompleted;

            return (
              <div
                key={lesson.id}
                className={`group bg-white rounded-[2.5rem] shadow-lg overflow-hidden transition-all hover:shadow-2xl border border-[#D5DEEF] ${
                  !unlocked ? 'opacity-60 grayscale-[0.5]' : ''
                }`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-[#395886] group-hover:text-[#628ECB] transition-colors">{lesson.title}</h2>
                      <h3 className="text-[#628ECB] font-bold text-sm">{lesson.topic}</h3>
                    </div>
                    {unlocked ? (
                      fullyCompleted && <div className="h-10 w-10 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981]"><CheckCircle className="w-6 h-6" /></div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Lock className="w-5 h-5" /></div>
                    )}
                  </div>

                  <p className="text-[#395886]/70 text-sm leading-relaxed mb-8 font-medium">{lesson.description}</p>

                  {unlocked && (
                    <div className="mb-8 p-5 bg-[#F8FAFD] rounded-2xl border border-[#D5DEEF]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-[#395886]/50 uppercase tracking-widest">Aktivitas Modul</span>
                        <span className="text-sm text-[#628ECB] font-bold">
                          {progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-[#D5DEEF] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#628ECB] h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${pretestCompleted ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-gray-100 text-gray-400 border-transparent'}`}>
                          {pretestCompleted && <CheckCircle className="w-3 h-3" />} PRETEST
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${completedStages === totalStages ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : completedStages > 0 ? 'bg-[#628ECB]/10 text-[#628ECB] border-[#628ECB]/20' : 'bg-gray-100 text-gray-400 border-transparent'}`}>
                          {completedStages === totalStages && <CheckCircle className="w-3 h-3" />} CTL {completedStages}/{totalStages}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${posttestCompleted ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-gray-100 text-gray-400 border-transparent'}`}>
                          {posttestCompleted && <CheckCircle className="w-3 h-3" />} POSTTEST
                        </span>
                      </div>
                    </div>
                  )}

                  {unlocked ? (
                    <Link
                      to={
                        completedSteps === 0
                          ? `/lesson-intro/${lesson.id}`
                          : fullyCompleted
                          ? `/lesson/${lesson.id}`
                          : !pretestCompleted
                          ? `/lesson-intro/${lesson.id}`
                          : posttestCompleted
                          ? `/lesson/${lesson.id}`
                          : completedStages === totalStages
                          ? `/evaluation/${lesson.id}`
                          : `/lesson/${lesson.id}`
                      }
                      className="flex items-center justify-center gap-2 w-full bg-[#628ECB] text-white text-sm font-bold py-4 rounded-2xl hover:bg-[#395886] transition-all shadow-lg shadow-[#628ECB]/10 active:scale-95"
                    >
                      {completedSteps === 0 ? 'Mulai Belajar' : fullyCompleted ? 'Review Materi' : 'Lanjutkan Progress'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-400 text-sm font-bold py-4 rounded-2xl cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      {globalTestProgress.globalPretestCompleted ? 'Modul Terkunci' : 'Selesaikan Pre-Test Umum'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

            {/* Compact Post-Test Umum strip */}
            <div className={`flex items-center justify-between gap-4 rounded-2xl border border-[#FCD34D]/50 bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] px-5 py-4 ${!globalPosttestUnlocked ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-[#D97706]">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#92400E]">Post-Test Umum</p>
                  <p className="text-xs text-[#92400E]/55 font-medium">
                    {globalTestProgress.globalPosttestCompleted
                      ? 'Sudah dikerjakan'
                      : globalPosttestUnlocked
                      ? 'Siap dikerjakan — selesaikan evaluasi akhir Anda'
                      : 'Selesaikan semua pertemuan terlebih dahulu'}
                  </p>
                </div>
              </div>
              {globalPosttestUnlocked ? (
                <Link
                  to="/global-posttest"
                  className="shrink-0 rounded-xl bg-[#F59E0B] px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#D97706] active:scale-95"
                >
                  {globalTestProgress.globalPosttestCompleted ? 'Tinjau' : 'Mulai Post-Test'}
                </Link>
              ) : (
                <div className="shrink-0 rounded-xl bg-gray-200 px-5 py-2 text-xs font-bold text-gray-400 cursor-not-allowed">
                  Terkunci
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB: HASIL BELAJAR ────────────────────────────────────────────── */}
        {mainTab === 'hasil' && (
          <div className="space-y-4">
            {/* Sub-tab pills */}
            <div className="flex gap-1.5">
              {([
                { id: 'pretest' as const, label: 'Pre-Test' },
                { id: 'treatment' as const, label: 'Aktivitas CTL' },
                { id: 'posttest' as const, label: 'Post-Test' },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setHasilTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    hasilTab === t.id
                      ? 'bg-[#628ECB] text-white shadow-md'
                      : 'bg-white border border-[#D5DEEF] text-[#395886]/60 hover:text-[#395886] hover:border-[#628ECB]/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Pre-Test results */}
            {hasilTab === 'pretest' && (() => {
              const gpDone = globalTestProgress.globalPretestCompleted;
              const gpScore = globalTestProgress.globalPretestScore ?? 0;
              const gpTotal = globalPretest.questions.length;
              const gpAnswers: number[] = (() => { try { return JSON.parse(localStorage.getItem(`global_pretest_answers_${user!.id}`) || '[]'); } catch { return []; } })();
              return (
                <div className="space-y-3">
                  {/* Global Pretest */}
                  <div className={`flex items-center gap-4 rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${gpDone ? 'border-[#10B981]/20' : 'border-[#D5DEEF]'}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-xs font-black text-[#7C3AED]">GP</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[#395886]">Pre-Test Umum</p>
                      <p className="text-xs text-[#395886]/50 font-medium mt-0.5">Tes awal sebelum pembelajaran</p>
                    </div>
                    {gpDone ? (
                      <>
                        <div className="text-center shrink-0">
                          <p className="text-xl font-black text-[#395886]">{Math.round((gpScore/gpTotal)*100)}<span className="text-sm font-bold text-[#395886]/50">%</span></p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/40">{gpScore}/{gpTotal} BENAR</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981]/10 px-3 py-1.5 text-xs font-bold text-[#10B981] shrink-0 border border-[#10B981]/20"><CheckCircle className="h-3.5 w-3.5" />Selesai</span>
                        <button onClick={() => openReview('Pre-Test Umum', globalPretest.questions, gpAnswers, gpScore)} className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-4 py-2 text-sm font-bold text-[#395886] transition-all hover:border-[#628ECB] hover:text-[#628ECB] hover:bg-[#F8FAFD] shadow-sm">Review <ChevronRight className="h-4 w-4" /></button>
                      </>
                    ) : (
                      <span className="inline-flex rounded-xl bg-[#F0F3FA] px-3 py-1.5 text-xs font-bold text-[#395886]/40 shrink-0 border border-transparent">Belum Dikerjakan</span>
                    )}
                  </div>
                  {/* Per-lesson pretest */}
                  {Object.values(lessons).map((lesson) => {
                    const lp = progress.find((p) => p.lessonId === lesson.id);
                    const done = lp?.pretestCompleted ?? false;
                    const score = lp?.pretestScore ?? 0;
                    const total = lesson.pretest.questions.length;
                    const answers: number[] = lp?.answers?.pretest ?? [];
                    return (
                      <div key={lesson.id} className={`flex items-center gap-4 rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${done ? 'border-[#10B981]/20' : 'border-[#D5DEEF]'}`}>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB]/10 text-xs font-black text-[#628ECB]">P{lesson.id}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-[#395886]">{lesson.title} — Pre-Test</p>
                          <p className="text-xs text-[#395886]/50 font-medium mt-0.5 truncate">{lesson.topic}</p>
                        </div>
                        {done ? (
                          <>
                            <div className="text-center shrink-0">
                              <p className="text-xl font-black text-[#395886]">{Math.round((score/total)*100)}<span className="text-sm font-bold text-[#395886]/50">%</span></p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/40">{score}/{total} BENAR</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981]/10 px-3 py-1.5 text-xs font-bold text-[#10B981] shrink-0 border border-[#10B981]/20"><CheckCircle className="h-3.5 w-3.5" />Selesai</span>
                            <button onClick={() => openReview(`${lesson.title} — Pre-Test`, lesson.pretest.questions, answers, score)} className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-4 py-2 text-sm font-bold text-[#395886] transition-all hover:border-[#628ECB] hover:text-[#628ECB] hover:bg-[#F8FAFD] shadow-sm">Review <ChevronRight className="h-4 w-4" /></button>
                          </>
                        ) : (
                          <span className="inline-flex rounded-xl bg-[#F0F3FA] px-3 py-1.5 text-xs font-bold text-[#395886]/40 shrink-0 border border-transparent">Belum Dikerjakan</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Treatment results */}
            {hasilTab === 'treatment' && (
              <div className="space-y-3">
                {Object.values(lessons).map((lesson) => {
                  const lp = progress.find((p) => p.lessonId === lesson.id);
                  const completedStages = lp?.completedStages.length ?? 0;
                  const totalStages = lesson.stages.length;
                  const allDone = completedStages === totalStages;
                  const unlocked = isLessonUnlocked(user!.id, lesson.id);
                  const pct = Math.round((completedStages / totalStages) * 100);
                  return (
                    <div key={lesson.id} className={`rounded-[1.5rem] border bg-white p-5 shadow-sm transition-all hover:shadow-md ${allDone ? 'border-[#10B981]/20' : 'border-[#D5DEEF]'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB]/10 text-xs font-black text-[#628ECB]">P{lesson.id}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-[#395886]">{lesson.title}</p>
                          <p className="text-xs text-[#395886]/50 font-medium mt-0.5 truncate">{lesson.topic}</p>
                        </div>
                        {!unlocked
                          ? <span className="inline-flex rounded-xl bg-[#F0F3FA] px-3 py-1.5 text-xs font-bold text-[#395886]/40 shrink-0 border border-transparent">Terkunci</span>
                          : allDone
                          ? <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981]/10 px-3 py-1.5 text-xs font-bold text-[#10B981] shrink-0 border border-[#10B981]/20"><CheckCircle className="h-3.5 w-3.5" />Selesai</span>
                          : completedStages > 0
                          ? <span className="inline-flex rounded-xl bg-[#628ECB]/10 px-3 py-1.5 text-xs font-bold text-[#628ECB] shrink-0 border border-[#628ECB]/20">{completedStages}/{totalStages} Tahap</span>
                          : <span className="inline-flex rounded-xl bg-[#F0F3FA] px-3 py-1.5 text-xs font-bold text-[#395886]/40 shrink-0 border border-transparent">Belum Dimulai</span>}
                        {unlocked && <Link to={`/lesson/${lesson.id}`} className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-4 py-2 text-sm font-bold text-[#395886] transition-all hover:border-[#628ECB] hover:text-[#628ECB] hover:bg-[#F8FAFD] shadow-sm">Buka <ChevronRight className="h-4 w-4" /></Link>}
                      </div>
                      {unlocked && (
                        <div className="bg-[#F8FAFD] rounded-xl p-3 border border-[#D5DEEF]/50">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] text-[#395886]/50 font-bold uppercase tracking-wider">{completedStages}/{totalStages} Tahapan CTL Selesai</span>
                            <span className="text-xs font-black text-[#628ECB]">{pct}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[#D5DEEF] overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ease-out ${allDone ? 'bg-[#10B981]' : 'bg-[#628ECB]'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Post-Test results */}
            {hasilTab === 'posttest' && (() => {
              const gpDone = globalTestProgress.globalPosttestCompleted;
              const gpScore = globalTestProgress.globalPosttestScore ?? 0;
              const gpTotal = globalPosttest.questions.length;
              const gpAnswers: number[] = (() => { try { return JSON.parse(localStorage.getItem(`global_posttest_answers_${user!.id}`) || '[]'); } catch { return []; } })();
              return (
                <div className="space-y-3">
                  {Object.values(lessons).map((lesson) => {
                    const lp = progress.find((p) => p.lessonId === lesson.id);
                    const done = lp?.posttestCompleted ?? false;
                    const score = lp?.posttestScore ?? 0;
                    const total = lesson.posttest.questions.length;
                    const answers: number[] = lp?.answers?.posttest ?? [];
                    return (
                      <div key={lesson.id} className={`flex items-center gap-4 rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${done ? 'border-[#10B981]/20' : 'border-[#D5DEEF]'}`}>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B]/10 text-xs font-black text-[#D97706]">P{lesson.id}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-[#395886]">{lesson.title} — Post-Test</p>
                          <p className="text-xs text-[#395886]/50 font-medium mt-0.5 truncate">{lesson.topic}</p>
                        </div>
                        {done ? (
                          <>
                            <div className="text-center shrink-0">
                              <p className="text-xl font-black text-[#395886]">{Math.round((score/total)*100)}<span className="text-sm font-bold text-[#395886]/50">%</span></p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/40">{score}/{total} BENAR</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981]/10 px-3 py-1.5 text-xs font-bold text-[#10B981] shrink-0 border border-[#10B981]/20"><CheckCircle className="h-3.5 w-3.5" />Selesai</span>
                            <button onClick={() => openReview(`${lesson.title} — Post-Test`, lesson.posttest.questions, answers, score)} className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-4 py-2 text-sm font-bold text-[#395886] transition-all hover:border-[#628ECB] hover:text-[#628ECB] hover:bg-[#F8FAFD] shadow-sm">Review <ChevronRight className="h-4 w-4" /></button>
                          </>
                        ) : (
                          <span className="inline-flex rounded-xl bg-[#F0F3FA] px-3 py-1.5 text-xs font-bold text-[#395886]/40 shrink-0 border border-transparent">Belum Dikerjakan</span>
                        )}
                      </div>
                    );
                  })}
                  {/* Global Posttest */}
                  <div className={`flex items-center gap-4 rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${gpDone ? 'border-[#10B981]/20' : 'border-[#D5DEEF]'}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B]/10 text-xs font-black text-[#D97706]">GE</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[#395886]">Post-Test Umum</p>
                      <p className="text-xs text-[#395886]/50 font-medium mt-0.5">Evaluasi akhir semua pertemuan</p>
                    </div>
                    {gpDone ? (
                      <>
                        <div className="text-center shrink-0">
                          <p className="text-xl font-black text-[#395886]">{Math.round((gpScore/gpTotal)*100)}<span className="text-sm font-bold text-[#395886]/50">%</span></p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#395886]/40">{gpScore}/{gpTotal} BENAR</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981]/10 px-3 py-1.5 text-xs font-bold text-[#10B981] shrink-0 border border-[#10B981]/20"><CheckCircle className="h-3.5 w-3.5" />Selesai</span>
                        <button onClick={() => openReview('Post-Test Umum', globalPosttest.questions, gpAnswers, gpScore)} className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-4 py-2 text-sm font-bold text-[#395886] transition-all hover:border-[#628ECB] hover:text-[#628ECB] hover:bg-[#F8FAFD] shadow-sm">Review <ChevronRight className="h-4 w-4" /></button>
                      </>
                    ) : (
                      <span className="inline-flex rounded-xl bg-[#F0F3FA] px-3 py-1.5 text-xs font-bold text-[#395886]/40 shrink-0 border border-transparent">Belum Dikerjakan</span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* ── REVIEW JAWABAN MODAL ───────────────────────────────────────────── */}
      <Dialog open={!!reviewModal} onOpenChange={(open) => !open && setReviewModal(null)}>
        <DialogContent className="border-[#D5DEEF] sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
          <DialogHeader className="p-8 pb-6 border-b border-[#D5DEEF] bg-[#F8FAFD]">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-[#395886] text-2xl font-black tracking-tight">{reviewModal?.title}</DialogTitle>
                {reviewModal && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="bg-[#628ECB]/10 px-3 py-1 rounded-full border border-[#628ECB]/20">
                      <p className="text-sm font-bold text-[#395886]">
                        Skor: <span className="text-[#628ECB]">{reviewModal.score}/{reviewModal.questions.length}</span>
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full border ${Math.round((reviewModal.score / reviewModal.questions.length) * 100) >= 70 ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]'}`}>
                      <p className="text-sm font-black">
                        {Math.round((reviewModal.score / reviewModal.questions.length) * 100)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#D5DEEF]">
            {reviewModal?.questions.map((q, i) => {
              const studentAnswer = reviewModal.studentAnswers[i];
              const isCorrect = studentAnswer === q.correctAnswer;
              return (
                <div key={i} className={`rounded-[1.5rem] border-2 p-6 transition-all ${isCorrect ? 'border-[#10B981]/20 bg-[#10B981]/[0.02]' : 'border-red-100 bg-red-50/[0.02]'}`}>
                  <div className="mb-5 flex gap-4">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-sm ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
                      {i + 1}
                    </span>
                    <p className="font-bold text-[#395886] leading-relaxed text-base">{q.question}</p>
                  </div>
                  <div className="ml-12 grid gap-2.5">
                    {q.options.map((opt, j) => {
                      const isStudentChoice = studentAnswer === j;
                      const isCorrectChoice = q.correctAnswer === j;
                      let cls = 'flex items-start gap-3 rounded-xl border-2 p-4 text-sm font-medium transition-all ';
                      if (isCorrectChoice) {
                        cls += 'border-[#10B981] bg-[#10B981]/10 text-[#0F8A66] shadow-sm';
                      } else if (isStudentChoice && !isCorrect) {
                        cls += 'border-red-400 bg-red-50 text-red-700 shadow-sm';
                      } else {
                        cls += 'border-[#D5DEEF] bg-white text-[#395886]/50';
                      }
                      return (
                        <div key={j} className={cls}>
                          <span className={`shrink-0 font-black w-5 ${isCorrectChoice ? 'text-[#0F8A66]' : isStudentChoice ? 'text-red-700' : 'text-[#395886]/30'}`}>{OPTION_LABELS[j]}.</span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                          {isCorrectChoice && <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-[#10B981]" />}
                          {isStudentChoice && !isCorrect && <X className="ml-auto h-5 w-5 shrink-0 text-red-500" />}
                        </div>
                      );
                    })}
                  </div>
                  {!isCorrect && typeof studentAnswer === 'number' && (
                    <div className="ml-12 mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-2 font-bold text-red-600 text-xs shadow-sm">
                        <X className="h-3.5 w-3.5" /> Jawaban kamu: <span className="bg-red-200/50 px-1.5 rounded ml-1">{OPTION_LABELS[studentAnswer]}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20 px-4 py-2 font-bold text-[#10B981] text-xs shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5" /> Benar: <span className="bg-[#10B981]/20 px-1.5 rounded ml-1">{OPTION_LABELS[q.correctAnswer]}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#D5DEEF] p-6 flex justify-end bg-[#F8FAFD]">
            <button
              onClick={() => setReviewModal(null)}
              className="px-10 py-3.5 bg-[#628ECB] text-white text-sm font-bold rounded-2xl hover:bg-[#395886] transition-all shadow-lg active:scale-95 shadow-[#628ECB]/20"
            >
              Tutup Review
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user!}
        onUpdate={() => {}}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <Dialog open={isGroupOpen} onOpenChange={setIsGroupOpen}>
        <DialogContent className="border-[#D5DEEF] sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2rem]">
          <DialogHeader className="p-8 pb-6 bg-gradient-to-br from-[#395886] to-[#628ECB] border-b border-[#3A6CB5]/30">
            <DialogTitle className="text-white flex items-center gap-3 text-2xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 border border-white/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              Kelompok Belajar
            </DialogTitle>
            <DialogDescription className="text-white/65 font-medium mt-2">
              Kolaborasi dengan rekan sejawat adalah bagian penting dari metode CTL. Pilih kelompok Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#D5DEEF]">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#628ECB]">Tersedia</p>
                <div className="grid gap-3">
                  {availableGroups.map((groupName) => (
                    <button
                      key={groupName}
                      onClick={() => saveGroupSelection(groupName)}
                      className={`group relative overflow-hidden rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                        selectedGroup === groupName
                          ? 'border-[#628ECB] bg-[#628ECB]/5 text-[#395886]'
                          : 'border-[#D5DEEF] bg-white text-[#395886]/60 hover:border-[#628ECB]/50 hover:bg-[#F8FAFD]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{groupName}</span>
                        {selectedGroup === groupName && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#628ECB] shadow-[0_0_10px_rgba(98,142,203,0.5)]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#628ECB]">Anggota Aktif</p>
                <div className="rounded-[2rem] border-2 border-[#D5DEEF] bg-[#F8FAFD] p-2 overflow-hidden shadow-inner">
                  {selectedGroup ? (
                    <div className="space-y-2">
                      <div className="bg-[#628ECB] px-6 py-3 text-sm font-bold text-white flex justify-between items-center rounded-[1.5rem] shadow-md">
                        <span>{selectedGroup}</span>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">{studentsInSelectedGroup.length} Anggota</span>
                      </div>
                      <div className="p-3 space-y-2 max-h-[350px] overflow-y-auto scrollbar-hide">
                        {studentsInSelectedGroup.length > 0 ? (
                          studentsInSelectedGroup.map((student) => (
                            <div key={student.id} className="flex items-center gap-4 rounded-2xl border border-[#D5DEEF] bg-white p-4 shadow-sm transition-transform hover:scale-[1.02]">
                              <div className="h-10 w-10 rounded-xl bg-[#F0F3FA] flex items-center justify-center text-[#628ECB]">
                                <User className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#395886] truncate">{student.name}</p>
                                <p className="text-[10px] text-[#395886]/50 font-bold uppercase tracking-widest">{student.class}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center">
                            <Users className="w-12 h-12 text-[#D5DEEF] mx-auto mb-4 opacity-50" />
                            <p className="text-sm font-bold text-[#395886]/40 italic">Jadilah anggota pertama di kelompok ini.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-24 text-center">
                      <div className="relative inline-block mb-6">
                        <Users className="w-16 h-16 text-[#D5DEEF] mx-auto opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFD] to-transparent" />
                      </div>
                      <p className="text-sm font-bold text-[#395886]/40 max-w-[240px] mx-auto leading-relaxed">
                        Silakan pilih salah satu kelompok di samping untuk melihat rekan belajar Anda.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-[#EEF3FB] to-[#F0F5FF] border-t border-[#C4D7F5] flex justify-end">
            <button
              onClick={() => setIsGroupOpen(false)}
              className="px-8 py-3 bg-[#628ECB] text-white text-sm font-bold rounded-2xl hover:bg-[#395886] transition-all shadow-lg active:scale-95"
            >
              Simpan & Tutup
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent className="border-[#D5DEEF] rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#395886] text-xl font-bold">Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription className="text-[#395886]/60 font-medium">
              Apakah Anda yakin ingin mengakhiri sesi belajar kali ini? Pastikan progress terakhir Anda telah tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="border-[#D5DEEF] text-[#395886] hover:bg-[#F0F3FA] rounded-xl font-bold">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold shadow-lg shadow-red-200" onClick={handleLogout}>
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
