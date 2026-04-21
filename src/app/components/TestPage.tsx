import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { TestQuestion } from '../data/lessons';
import { lessons } from '../data/lessons';
import { getLessonProgress } from '../utils/progress';
import { getCurrentUser } from '../utils/auth';
import { LessonFlowSidebar } from './LessonFlowSidebar';

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

  // Data sidebar (saat digunakan di dalam alur pertemuan)
  const sidebarLesson = lessonFlow?.lessonId ? lessons[lessonFlow.lessonId] : null;
  const sidebarUser = getCurrentUser();
  const sidebarProgress = lessonFlow?.lessonId && sidebarUser
    ? getLessonProgress(sidebarUser.id, lessonFlow.lessonId)
    : null;
  const sidebarFullyCompleted = !!(lessonFlow?.pretestCompleted && lessonFlow.allStagesCompleted && lessonFlow.posttestCompleted);
  const hasSidebar = !!(sidebarLesson && sidebarProgress && lessonFlow?.lessonId);

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
    setAnswers(newAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      return;
    }
    const score = newAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
    onComplete(score, newAnswers);
    setShowResults(true);
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
        <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[76px] items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <Link to={backPath} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                  </div>
                </Link>
                <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
                <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">{title}</span>
              </div>
              <Link
                to={backPath}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-semibold"
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
          {/* Kartu Skor */}
          <div className="bg-white rounded-[2rem] shadow-md border border-[#D5DEEF] overflow-hidden mb-6">
            <div className="bg-gradient-to-br from-[#395886] to-[#628ECB] px-8 py-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/20 shadow-lg ring-4 ring-white/30">
                  <span className="text-4xl font-black text-white">{percentage}<span className="text-xl">%</span></span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{title} Selesai!</h1>
              <p className="text-white/70 text-sm">
                Kamu menjawab <span className="font-bold text-white">{score}</span> dari <span className="font-bold text-white">{questions.length}</span> soal dengan benar
              </p>
            </div>
            <div className={`mx-6 my-5 rounded-2xl ${scoreColor.light} ${scoreColor.border} border-2 px-6 py-4 text-center`}>
              <p className={`text-lg font-bold ${scoreColor.text}`}>{scoreColor.msg}</p>
              <p className={`text-sm ${scoreColor.text}/80 mt-0.5`}>{scoreColor.sub}</p>
            </div>
          </div>

          {/* Ulasan Jawaban — diperluas untuk keterbacaan lebih baik */}
          <div className="bg-white rounded-[2rem] shadow-md border border-[#D5DEEF] overflow-hidden mb-8">
            <div className="flex items-center gap-3 border-b border-[#D5DEEF] px-8 py-5 bg-[#F8FAFD]">
              <FileText className="h-5 w-5 text-[#628ECB]" />
              <h2 className="text-base font-bold text-[#395886]">Review Jawaban Lengkap</h2>
              <span className="ml-auto flex items-center gap-4 text-sm font-bold">
                <span className="flex items-center gap-1.5 text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20"><CheckCircle className="h-4 w-4" />{score} Benar</span>
                <span className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100"><XCircle className="h-4 w-4" />{questions.length - score} Salah</span>
              </span>
            </div>

            <div className="p-8 space-y-8">
              {questions.map((q, index) => {
                const studentAnswer = answers[index];
                const isCorrect = studentAnswer === q.correctAnswer;
                return (
                  <div key={index} className={`rounded-[1.5rem] border-2 p-6 transition-all ${isCorrect ? 'border-[#10B981]/20 bg-[#10B981]/[0.02]' : 'border-red-100 bg-red-50/[0.02]'}`}>
                    <div className="mb-5 flex gap-4">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-sm ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
                        {index + 1}
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
                            <span className={`shrink-0 font-black w-5 ${isCorrectChoice ? 'text-[#0F8A66]' : isStudentChoice ? 'text-red-700' : 'text-[#395886]/30'}`}>
                              {OPTION_LABELS[j]}.
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                            {isCorrectChoice && <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-[#10B981]" />}
                            {isStudentChoice && !isCorrect && <XCircle className="ml-auto h-5 w-5 shrink-0 text-red-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {!isCorrect && typeof studentAnswer === 'number' && (
                      <div className="ml-12 mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-2 font-bold text-red-600 text-xs shadow-sm">
                          <XCircle className="h-3.5 w-3.5" /> Jawaban kamu: <span className="bg-red-200/50 px-1.5 rounded ml-1">{OPTION_LABELS[studentAnswer]}</span>
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
          </div>

          {/* Tombol Aksi Akhir */}
          <div className="text-center">
            {reflectionPath ? (
              <Link
                to={reflectionPath}
                className="inline-flex items-center gap-2 bg-[#F59E0B] text-white px-10 py-4 rounded-2xl hover:bg-[#D97706] transition-all shadow-lg font-black text-sm active:scale-95"
              >
                Lanjut ke Refleksi Belajar
                <ChevronRight className="h-5 w-5" strokeWidth={3} />
              </Link>
            ) : (
              <Link
                to={backPath}
                className="inline-flex items-center gap-2 bg-[#628ECB] text-white px-8 py-3.5 rounded-2xl hover:bg-[#395886] transition-colors shadow-md font-bold"
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
        </main>
      </div>
      </div>
    );
  }

  // ─── Tampilan Intro ────────────────────────────────────────────────────────

  if (!started) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
        <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[76px] items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <Link to={backPath} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                  </div>
                </Link>
                <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
                <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">{title}</span>
              </div>
              <Link
                to={backPath}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-semibold"
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
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
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : timeRemaining <= 180
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                      : 'bg-[#628ECB]/10 text-[#628ECB] border-[#628ECB]/20'
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
    </div>
  );
}
