import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  ArrowRight,
  FileText,
  Info,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { TestQuestion } from '../data/lessons';
import { lessons } from '../data/lessons';
import { getLessonProgress } from '../utils/progress';
import { getCurrentUser } from '../utils/auth';
import { LessonFlowSidebar } from './LessonFlowSidebar';
import { Logo } from './layout/Logo';

interface TestPageProps {
  title: string;
  description: string;
  questions: TestQuestion[];
  onComplete: (score: number, answers: number[]) => void;
  backPath: string;
  reflectionPath?: string;
  showResults?: boolean;
  existingAnswers?: number[];
  existingScore?: number;
  duration?: number;
  isLessonPretest?: boolean;
  instructions?: string[];
  durationNote?: string;
  lessonFlow?: {
    step: number;
    lessonId?: string;
    pretestCompleted: boolean;
    allStagesCompleted: boolean;
    posttestCompleted: boolean;
  };
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export function TestPage({
  title,
  description,
  questions,
  onComplete,
  backPath,
  reflectionPath,
  showResults: initialShowResults,
  existingAnswers,
  existingScore,
  duration,
  isLessonPretest,
  instructions = [],
  durationNote,
  lessonFlow,
}: TestPageProps) {
  const [started, setStarted] = useState(!!existingAnswers && existingAnswers.length > 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(existingAnswers || []);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(initialShowResults || false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    duration && !initialShowResults ? duration * 60 : null
  );
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<{ score: number; answers: number[] } | null>(null);

  // Data sidebar (saat digunakan di dalam alur pertemuan)
  const sidebarLesson = lessonFlow?.lessonId ? lessons[lessonFlow.lessonId] : null;
  const sidebarUser = getCurrentUser();
  const [sidebarProgress, setSidebarProgress] = useState<import('../utils/progress').LessonProgress | null>(null);
  const sidebarFullyCompleted = !!(lessonFlow?.pretestCompleted && lessonFlow.allStagesCompleted && lessonFlow.posttestCompleted);
  const hasSidebar = !!(sidebarLesson && sidebarProgress && lessonFlow?.lessonId);

  useEffect(() => {
    if (lessonFlow?.lessonId && sidebarUser) {
      getLessonProgress(sidebarUser.id, lessonFlow.lessonId).then(setSidebarProgress as any);
    }
  }, [lessonFlow?.lessonId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleTimeUp = useCallback(() => {
    const score = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
    onComplete(score, answers);
    setShowResults(true);
  }, [answers, questions, onComplete]);

  useEffect(() => {
    if (started && !showResults && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, showResults, timeRemaining]);

  useEffect(() => {
    if (started && !showResults && timeRemaining === 0 && duration) {
      handleTimeUp();
    }
  }, [timeRemaining, started, showResults, handleTimeUp, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    if (currentQuestionIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      return;
    }
    const score = newAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
    setPendingSubmitData({ score, answers: newAnswers });
    setShowConfirmSubmit(true);
  };

  const handleConfirmSubmit = () => {
    if (!pendingSubmitData) return;
    setAnswers(pendingSubmitData.answers);
    onComplete(pendingSubmitData.score, pendingSubmitData.answers);
    setShowConfirmSubmit(false);
    setShowResults(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmSubmit(false);
    setPendingSubmitData(null);
  };

  const score =
    existingScore !== undefined
      ? existingScore
      : answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
  const percentage = Math.round((score / questions.length) * 100);

  const introInstructions =
    instructions.length > 0
      ? instructions
      : [
          'Baca setiap soal dengan teliti sebelum memilih jawaban.',
          'Pilih satu jawaban yang paling tepat pada setiap nomor.',
          'Periksa kembali jawaban Anda sebelum menyelesaikan tes.',
        ];

  const scoreColor =
    percentage >= 80
      ? { text: 'text-[#10B981]', bg: 'bg-[#10B981]', light: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', msg: 'Sangat Baik!', sub: 'Kamu siap melanjutkan ke materi berikutnya.' }
      : percentage >= 60
      ? { text: 'text-[#628ECB]', bg: 'bg-[#628ECB]', light: 'bg-[#628ECB]/10', border: 'border-[#628ECB]/30', msg: 'Cukup Baik', sub: 'Tetap semangat dan terus belajar.' }
      : { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]', light: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', msg: 'Perlu Ditingkatkan', sub: 'Jangan menyerah, terus berlatih!' };

  // ─── Tampilan Hasil ────────────────────────────────────────────────────────

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
      <header className="sticky top-0 z-50 w-full border-b border-[#C8D8F0] bg-white/95 shadow-md backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link to={backPath} className="flex items-center gap-3">
                <div className="hidden sm:block min-w-0">
                  <Logo />
                </div>
                <div className="sm:hidden">
                  <Logo size="sm" />
                </div>
              </Link>
              <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#628ECB]/10 px-3 py-1 text-xs font-bold text-[#628ECB] uppercase tracking-widest border border-[#628ECB]/20">
                {title}
              </span>
            </div>
            <Link
              to={backPath}
              className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

        <div className="max-w-7xl mx-auto lg:flex lg:items-start lg:gap-6 px-4 sm:px-6 lg:px-8 py-6">
          {hasSidebar && (
            <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-[92px]">
              <LessonFlowSidebar
                lesson={sidebarLesson!}
                lessonId={lessonFlow!.lessonId!}
                progress={sidebarProgress!}
                currentStep={lessonFlow!.step as 1 | 2 | 3 | 4}
                fullyCompleted={sidebarFullyCompleted}
              />
            </aside>
          )}
          <main className="flex-1 min-w-0">
          {/* Kartu Skor — compact & modern */}
          <div className="bg-white rounded-3xl shadow-md border border-[#D5DEEF] overflow-hidden mb-5">
            <div className="bg-gradient-to-br from-[#395886] via-[#4A6FA8] to-[#628ECB] px-6 py-6">
              <div className="flex items-center gap-5">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-lg ring-2 ring-white/30">
                  <span className="text-2xl font-black text-white leading-none">{percentage}<span className="text-base">%</span></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-extrabold text-white leading-tight">{title} Selesai!</h1>
                  <p className="text-white/70 text-sm mt-1">
                    <span className="font-bold text-white">{score}</span> dari <span className="font-bold text-white">{questions.length}</span> soal dijawab benar
                  </p>
                  <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full ${scoreColor.light} ${scoreColor.border} border px-3 py-1`}>
                    <span className={`text-xs font-black ${scoreColor.text}`}>{scoreColor.msg}</span>
                    <span className={`text-[10px] font-semibold ${scoreColor.text}/70`}>— {percentage >= 70 ? 'Lulus' : 'Belum Lulus'}</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/15 px-3 py-1.5 rounded-xl">
                    <CheckCircle className="h-3.5 w-3.5 text-[#34D399]" />{score} Benar
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/15 px-3 py-1.5 rounded-xl">
                    <XCircle className="h-3.5 w-3.5 text-red-300" />{questions.length - score} Salah
                  </div>
                </div>
              </div>
            </div>
            <div className={`px-6 py-3 bg-gradient-to-r ${scoreColor.light} border-t ${scoreColor.border}`}>
              <p className={`text-sm font-medium ${scoreColor.text}/80`}>{scoreColor.sub}</p>
            </div>
          </div>

          {/* Tombol Aksi Akhir */}
          <div className="mb-5 flex justify-center">
            {reflectionPath ? (
              <Link
                to={reflectionPath}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white px-8 py-3.5 rounded-2xl hover:from-[#D97706] hover:to-[#B45309] transition-all shadow-lg font-black text-sm active:scale-95"
              >
                Lanjut ke Refleksi Belajar
                <ChevronRight className="h-5 w-5" strokeWidth={3} />
              </Link>
            ) : (
              <Link
                to={backPath}
                state={isLessonPretest ? { pretestJustCompleted: true } : undefined}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#395886] to-[#628ECB] text-white px-8 py-3.5 rounded-2xl hover:from-[#2E4A75] hover:to-[#4A79BA] transition-all shadow-md font-bold active:scale-95"
              >
                {isLessonPretest ? (
                  <>
                    Lanjutkan ke Tahapan CTL
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    Kembali ke Dashboard
                  </>
                )}
              </Link>
            )}
          </div>

          {/* Ulasan Jawaban — compact */}
          <div className="bg-white rounded-3xl shadow-md border border-[#D5DEEF] overflow-hidden mb-6">
            <div className="flex items-center gap-3 border-b border-[#D5DEEF] px-6 py-4 bg-[#F8FAFD]">
              <FileText className="h-4 w-4 text-[#628ECB]" />
              <h2 className="text-sm font-bold text-[#395886]">Preview Jawaban</h2>
              <span className="ml-auto flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20"><CheckCircle className="h-3.5 w-3.5" />{score} Benar</span>
                <span className="flex items-center gap-1 text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100"><XCircle className="h-3.5 w-3.5" />{questions.length - score} Salah</span>
              </span>
            </div>

            <div className="p-5 space-y-4">
              {questions.map((q, index) => {
                const studentAnswer = answers[index];
                const isCorrect = studentAnswer === q.correctAnswer;
                return (
                  <div key={index} className={`rounded-2xl border p-4 transition-all ${isCorrect ? 'border-[#10B981]/25 bg-[#10B981]/[0.025]' : 'border-red-100 bg-red-50/30'}`}>
                    <div className="mb-3 flex gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
                        {index + 1}
                      </span>
                      <p className="font-semibold text-[#395886] leading-snug text-sm">{q.question}</p>
                    </div>

                    <div className="ml-10 grid gap-1.5">
                      {q.options.map((opt, j) => {
                        const isStudentChoice = studentAnswer === j;
                        const isCorrectChoice = q.correctAnswer === j;

                        let cls = 'flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ';
                        if (isCorrectChoice) {
                          cls += 'border-[#10B981] bg-[#10B981]/10 text-[#0F8A66]';
                        } else if (isStudentChoice && !isCorrect) {
                          cls += 'border-red-300 bg-red-50 text-red-700';
                        } else {
                          cls += 'border-[#E5EBF5] bg-white text-[#395886]/40';
                        }

                        return (
                          <div key={j} className={cls}>
                            <span className={`shrink-0 font-black w-4 ${isCorrectChoice ? 'text-[#0F8A66]' : isStudentChoice ? 'text-red-700' : 'text-[#395886]/25'}`}>
                              {OPTION_LABELS[j]}.
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                            {isCorrectChoice && <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-[#10B981]" />}
                            {isStudentChoice && !isCorrect && <XCircle className="ml-auto h-4 w-4 shrink-0 text-red-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {!isCorrect && typeof studentAnswer === 'number' && (
                      <div className="ml-10 mt-2.5 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 font-bold text-red-600 text-[10px]">
                          <XCircle className="h-3 w-3" /> Jawaban kamu: <span className="font-black ml-0.5">{OPTION_LABELS[studentAnswer]}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#10B981]/5 border border-[#10B981]/20 px-3 py-1.5 font-bold text-[#10B981] text-[10px]">
                          <CheckCircle className="h-3 w-3" /> Jawaban benar: <span className="font-black ml-0.5">{OPTION_LABELS[q.correctAnswer]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      </div>
    );
  }

  // ─── Tampilan Intro ────────────────────────────────────────────────────────

  if (!started) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
      <header className="sticky top-0 z-50 w-full border-b border-[#C8D8F0] bg-white/95 shadow-md backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link to={backPath} className="flex items-center gap-3">
                <div className="hidden sm:block min-w-0">
                  <Logo />
                </div>
                <div className="sm:hidden">
                  <Logo size="sm" />
                </div>
              </Link>
              <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#628ECB]/10 px-3 py-1 text-xs font-bold text-[#628ECB] uppercase tracking-widest border border-[#628ECB]/20">
                {title}
              </span>
            </div>
            <Link
              to={backPath}
              className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

        <div className="max-w-7xl mx-auto lg:flex lg:items-start lg:gap-6 px-4 sm:px-6 lg:px-8 py-6">
          {hasSidebar && (
            <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-[92px]">
              <LessonFlowSidebar
                lesson={sidebarLesson!}
                lessonId={lessonFlow!.lessonId!}
                progress={sidebarProgress!}
                currentStep={lessonFlow!.step as 1 | 2 | 3 | 4}
                fullyCompleted={sidebarFullyCompleted}
              />
            </aside>
          )}
          <main className="flex-1 min-w-0">
            {/* Kartu Hero */}
            <div className="bg-white rounded-[2rem] shadow-md border border-[#D5DEEF] overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-[#395886] to-[#628ECB] px-8 py-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 mx-auto mb-4 shadow-md">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-white/80 text-sm leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {/* Petunjuk */}
              <div className="bg-white rounded-[1.5rem] border border-[#D5DEEF] shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[#628ECB]/20 bg-[#628ECB]/5 px-5 py-3">
                  <Info className="h-4 w-4 text-[#628ECB]" />
                  <h2 className="text-sm font-bold text-[#395886]">Petunjuk Pengerjaan</h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {introInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-[#395886]/80">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#628ECB]/10 text-[10px] font-bold text-[#628ECB]">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Info Tes */}
              <div className="bg-white rounded-[1.5rem] border border-[#D5DEEF] shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[#10B981]/20 bg-[#10B981]/5 px-5 py-3">
                  <Award className="h-4 w-4 text-[#10B981]" />
                  <h2 className="text-sm font-bold text-[#395886]">Informasi Tes</h2>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F0F3FA] px-4 py-3">
                    <FileText className="h-4 w-4 text-[#628ECB] shrink-0" />
                    <div>
                      <p className="text-xs text-[#395886]/50 font-semibold">Jumlah Soal</p>
                      <p className="text-sm font-bold text-[#395886]">{questions.length} soal pilihan ganda</p>
                    </div>
                  </div>
                  {duration && (
                    <div className="flex items-center gap-3 rounded-xl bg-[#F0F3FA] px-4 py-3">
                      <Clock className="h-4 w-4 text-[#628ECB] shrink-0" />
                      <div>
                        <p className="text-xs text-[#395886]/50 font-semibold">Durasi</p>
                        <p className="text-sm font-bold text-[#395886]">{duration} menit</p>
                      </div>
                    </div>
                  )}
                  {durationNote && (
                    <p className="text-xs text-[#395886]/60 leading-relaxed px-1">{durationNote}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-2 bg-[#628ECB] text-white px-10 py-4 rounded-2xl hover:bg-[#395886] transition-all shadow-lg shadow-[#628ECB]/20 font-bold text-base active:scale-95"
              >
                Mulai {title}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ─── Tampilan Pertanyaan ───────────────────────────────────────────────────

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link to={backPath} className="flex items-center gap-3">
                <div className="hidden sm:block min-w-0">
                  <Logo />
                </div>
                <div className="sm:hidden">
                  <Logo size="sm" />
                </div>
              </Link>
              <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
              <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">{title}</span>
            </div>
            <div className="flex items-center gap-3">
              {timeRemaining !== null && (
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold border ${
                    timeRemaining <= 60
                      ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                      : timeRemaining <= 180
                      ? 'bg-orange-50 text-orange-600 border-orange-200'
                      : 'bg-orange-50 text-orange-500 border-orange-200'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bilah progres */}
        <div className="border-t border-[#D5DEEF] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#395886]/60 uppercase tracking-wide">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <span className="text-xs font-bold text-[#628ECB]">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#D5DEEF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#628ECB] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto lg:flex lg:items-start lg:gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {hasSidebar && (
          <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-[116px]">
            <LessonFlowSidebar
              lesson={sidebarLesson!}
              lessonId={lessonFlow!.lessonId!}
              progress={sidebarProgress!}
              currentStep={lessonFlow!.step as 1 | 2 | 3 | 4}
              fullyCompleted={sidebarFullyCompleted}
            />
          </aside>
        )}
        <main className="flex-1 min-w-0">
          {/* Peringatan timer mendesak */}
          {timeRemaining !== null && timeRemaining <= 60 && timeRemaining > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 animate-pulse">
              <Clock className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700">Waktu Hampir Habis!</p>
                <p className="text-xs text-red-600">Segera selesaikan jawaban Anda.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2rem] shadow-md border border-[#D5DEEF] overflow-hidden">
            {/* Nomor soal */}
            <div className="px-7 pt-7 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#628ECB]/10 px-3 py-1 text-xs font-bold text-[#628ECB] border border-[#628ECB]/20 mb-4">
                Soal {currentQuestionIndex + 1}
              </span>
              <h3 className="text-lg font-bold text-[#395886] leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Pilihan Jawaban */}
            <div className="px-7 pb-7 space-y-2.5">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all ${
                    selectedAnswer === index
                      ? 'border-[#628ECB] bg-[#628ECB]/8 text-[#395886]'
                      : 'border-[#D5DEEF] bg-white text-[#395886]/80 hover:border-[#628ECB]/40 hover:bg-[#F0F3FA]'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      selectedAnswer === index
                        ? 'bg-[#628ECB] text-white'
                        : 'bg-[#F0F3FA] text-[#395886]/60'
                    }`}
                  >
                    {OPTION_LABELS[index]}
                  </span>
                  <span className="flex-1">{option}</span>
                  {selectedAnswer === index && (
                    <CheckCircle className="h-4 w-4 text-[#628ECB] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Kaki */}
            <div className="border-t border-[#D5DEEF] px-7 py-4 flex items-center justify-between bg-[#F8FAFD]">
              <span className="text-xs font-semibold text-[#395886]/50">
                {selectedAnswer !== null ? 'Pilihan dipilih' : 'Pilih salah satu jawaban'}
              </span>
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                  selectedAnswer !== null
                    ? 'bg-[#628ECB] text-white hover:bg-[#395886] active:scale-95 shadow-md'
                    : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>Lanjut <ChevronRight className="h-4 w-4" /></>
                ) : (
                  <>Selesai <CheckCircle className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={showConfirmSubmit} onOpenChange={(open) => !open && handleCancelSubmit()}>
        <AlertDialogContent className="rounded-[2rem] border-[#D5DEEF] shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#628ECB]/10 text-[#628ECB]">
                <AlertCircle className="h-5 w-5" />
              </div>
              <AlertDialogTitle className="text-[#395886] text-xl font-black">Konfirmasi Selesai</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[#395886]/65 font-medium text-base leading-relaxed">
              Apakah Anda yakin sudah selesai mengerjakan? Jawaban tidak dapat diubah setelah dikumpulkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-2">
            <AlertDialogCancel onClick={handleCancelSubmit} className="border-[#D5DEEF] text-[#395886] hover:bg-[#F0F3FA] rounded-xl font-bold px-6">
              Tidak, Kembali
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-gradient-to-r from-[#395886] to-[#628ECB] text-white hover:from-[#2E4A75] hover:to-[#4A79BA] rounded-xl font-bold px-6 shadow-lg shadow-[#628ECB]/20">
              Ya, Kumpulkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
