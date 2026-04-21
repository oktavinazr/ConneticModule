import { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  HelpCircle,
  Lightbulb,
  LogOut,
  MonitorPlay,
  Search,
  ShieldCheck,
  TrendingUp,
  Trophy,
  User,
  Users,
  Video,
  XCircle,
  X,
  Filter,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { lessons, globalPretest, globalPosttest, type Stage } from '../data/lessons';
import { getCurrentUser, getAllStudents, logout } from '../utils/auth';
import { getAllProgress, getGlobalTestProgress, getLessonProgress } from '../utils/progress';
import { ProfileModal } from '../components/ProfileModal';
import { MobileSidebar } from '../components/MobileSidebar';
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

// ─── Konstanta ────────────────────────────────────────────────────────────────

const GROUP_STORAGE_KEY = 'student-groups';

const CTL_META: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  constructivism: {
    label: 'Constructivism',
    icon: <Video className="w-4 h-4" />,
    bg: 'bg-[#628ECB]/10',
    text: 'text-[#628ECB]',
    border: 'border-[#628ECB]/25',
  },
  inquiry: {
    label: 'Inquiry',
    icon: <Search className="w-4 h-4" />,
    bg: 'bg-[#10B981]/10',
    text: 'text-[#10B981]',
    border: 'border-[#10B981]/25',
  },
  questioning: {
    label: 'Questioning',
    icon: <HelpCircle className="w-4 h-4" />,
    bg: 'bg-[#8B5CF6]/10',
    text: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]/25',
  },
  'learning-community': {
    label: 'Learning Community',
    icon: <Users className="w-4 h-4" />,
    bg: 'bg-[#F59E0B]/10',
    text: 'text-[#F59E0B]',
    border: 'border-[#F59E0B]/25',
  },
  modeling: {
    label: 'Modeling',
    icon: <MonitorPlay className="w-4 h-4" />,
    bg: 'bg-[#EC4899]/10',
    text: 'text-[#EC4899]',
    border: 'border-[#EC4899]/25',
  },
  reflection: {
    label: 'Reflection',
    icon: <Lightbulb className="w-4 h-4" />,
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  'authentic-assessment': {
    label: 'Authentic Assessment',
    icon: <FileText className="w-4 h-4" />,
    bg: 'bg-[#6366F1]/10',
    text: 'text-[#6366F1]',
    border: 'border-[#6366F1]/25',
  },
};

// ─── Tipe ────────────────────────────────────────────────────────────────────

interface LessonSummary {
  lessonId: string;
  lessonTitle: string;
  topic: string;
  pretestCompleted: boolean;
  pretest: number | null;
  pretestAnswers: number[];
  posttestCompleted: boolean;
  posttest: number | null;
  posttestAnswers: number[];
  completedStages: number[];
  totalStages: number;
  stageAnswers: Record<string, any>;
}

interface StudentActivitySummary {
  student: {
    id: string;
    name: string;
    username: string;
    email: string;
    gender: string;
    class: string;
    nis: string;
  };
  group: string | null;
  globalPretestCompleted: boolean;
  globalPretest: number | null;
  globalPretestAnswers: number[];
  globalPosttestCompleted: boolean;
  globalPosttest: number | null;
  globalPosttestAnswers: number[];
  overallProgress: number;
  lessons: LessonSummary[];
}

// ─── Ringkasan Jawaban Tahap (teks ringkas untuk tabel/daftar) ────────────────

function getStageAnswerSummary(stage: Stage, answer: any): string {
  if (!answer) return '—';
  try {
    switch (stage.type) {
      case 'constructivism': {
        const a = answer as { selectedOption?: string; reason?: string };
        const opt = stage.options?.find((o: any) => o.id === a.selectedOption);
        return opt ? `Pilihan: "${opt.text.slice(0, 40)}..."` : '—';
      }
      case 'inquiry': {
        const matched = Object.keys(answer as Record<string, string>).length;
        const total = stage.groupItems?.length ?? 0;
        return `${matched}/${total} pasangan cocok`;
      }
      case 'questioning': {
        const a = answer as { selectedAnswer?: number; isCorrect?: boolean };
        const correct = a.isCorrect ? 'Benar' : 'Salah';
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        return opt ? `${correct}: "${String(opt).slice(0, 35)}..."` : `${correct}`;
      }
      case 'learning-community': {
        const a = answer as { stance?: string; reason?: string };
        const opt = stage.options?.find((o: any) => o.id === a.stance);
        return opt ? `Sikap: ${opt.text}` : '—';
      }
      case 'modeling':
        return Array.isArray(answer) ? `${answer.length} item diurutkan` : '—';
      case 'reflection': {
        const a = answer as { selectedAnswer?: number; reflections?: Record<string, string> };
        const reflCount = Object.values(a.reflections ?? {}).filter((r) => r.trim().length > 0).length;
        return `${reflCount} refleksi diisi`;
      }
      case 'authentic-assessment': {
        const a = answer as { essay?: string; selectedAnswer?: number };
        if (a.essay) return `Esai: "${a.essay.slice(0, 40)}..."`;
        if (a.selectedAnswer !== undefined) return `Opsi ke-${a.selectedAnswer + 1}`;
        return '—';
      }
      default:
        return '—';
    }
  } catch {
    return '—';
  }
}

// ─── Detail Jawaban Tahap (render lengkap untuk modal) ────────────────────────

function StageAnswerDetail({ stage, answer }: { stage: Stage; answer: any }) {
  if (!answer) return <p className="text-xs text-[#395886]/50 italic">Belum dikerjakan</p>;

  try {
    switch (stage.type) {
      case 'constructivism': {
        const a = answer as { selectedOption?: string; reason?: string };
        const opt = stage.options?.find((o: any) => o.id === a.selectedOption);
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Pilihan:</span>
              <p className="text-[#395886] mt-0.5">{opt?.text ?? a.selectedOption ?? '—'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Alasan:</span>
              <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 text-sm leading-relaxed">{a.reason ?? '—'}</p>
            </div>
          </div>
        );
      }
      case 'inquiry': {
        const pairs = answer as Record<string, string>;
        return (
          <div className="space-y-1.5">
            {Object.entries(pairs).map(([left, right], i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="bg-[#628ECB]/10 text-[#628ECB] px-2 py-1 rounded font-medium flex-1 truncate">{left}</span>
                <ChevronRight className="w-3 h-3 text-[#395886]/40 shrink-0" />
                <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded font-medium flex-1 truncate">{right}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'questioning': {
        const a = answer as { selectedAnswer?: number; isCorrect?: boolean };
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        return (
          <div className="flex items-center gap-2 text-sm">
            {a.isCorrect ? (
              <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span className={a.isCorrect ? 'text-[#10B981]' : 'text-red-600'}>
              {a.isCorrect ? 'Benar' : 'Salah'} — {opt ? String(opt) : `Opsi ${(a.selectedAnswer ?? 0) + 1}`}
            </span>
          </div>
        );
      }
      case 'learning-community': {
        const a = answer as { stance?: string; reason?: string };
        const opt = stage.options?.find((o: any) => o.id === a.stance);
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Sikap:</span>
              <p className="text-[#395886] mt-0.5 font-medium">{opt?.text ?? a.stance ?? '—'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Alasan Diskusi:</span>
              <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 leading-relaxed">{a.reason ?? '—'}</p>
            </div>
          </div>
        );
      }
      case 'modeling': {
        const ids = answer as string[];
        return (
          <div className="space-y-1.5">
            {ids.map((id, i) => {
              const item = stage.items?.find((it: any) => it.id === id);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#628ECB]/10 text-[#628ECB] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                  <span className="text-[#395886]">{item?.text ?? id}</span>
                </div>
              );
            })}
          </div>
        );
      }
      case 'reflection': {
        const a = answer as { selectedAnswer?: number; reflections?: Record<string, string> };
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        const prompts = stage.reflectionPrompts ?? ['Konsep penting?', 'Penerapan nyata?', 'Yang masih membingungkan?'];
        return (
          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              {prompts.map((prompt, i) => {
                const val = a.reflections?.[`prompt_${i}`] ?? '';
                return (
                  <div key={i} className="bg-[#F0F3FA] rounded-lg p-3">
                    <p className="text-xs font-bold text-[#395886]/50 mb-1">{prompt}</p>
                    <p className="text-[#395886] leading-relaxed">{val || <span className="italic text-[#395886]/40">Belum diisi</span>}</p>
                  </div>
                );
              })}
            </div>
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Kesimpulan:</span>
              <p className="text-[#395886] mt-0.5 font-medium">{opt ? String(opt) : '—'}</p>
            </div>
          </div>
        );
      }
      case 'authentic-assessment': {
        const a = answer as { essay?: string; selectedAnswer?: number; isCorrect?: boolean };
        return (
          <div className="space-y-2 text-sm">
            {a.selectedAnswer !== undefined && (
              <div className="flex items-center gap-2">
                {a.isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span className={a.isCorrect ? 'text-[#10B981]' : 'text-red-600'}>
                  {a.isCorrect ? 'Solusi Tepat' : 'Pertimbangkan kembali'} —{' '}
                  {stage.options?.[a.selectedAnswer] ? String(stage.options[a.selectedAnswer]) : `Opsi ${a.selectedAnswer + 1}`}
                </span>
              </div>
            )}
            {a.essay && (
              <div>
                <span className="text-xs font-bold text-[#395886]/50 uppercase">Jawaban Esai:</span>
                <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 leading-relaxed">{a.essay}</p>
              </div>
            )}
          </div>
        );
      }
      default:
        return <p className="text-xs text-[#395886]/50">{JSON.stringify(answer)}</p>;
    }
  } catch {
    return <p className="text-xs text-[#395886]/50 italic">Data tidak terbaca</p>;
  }
}

// ─── Bagian Tanya Jawab Tes ───────────────────────────────────────────────────

function TestAnswerSection({
  title,
  score,
  totalQ,
  completed,
  questions,
  answers,
}: {
  title: string;
  score: number | null;
  totalQ: number;
  completed: boolean;
  questions: Array<{ question: string; options: string[]; correctAnswer: number }>;
  answers: number[];
}) {
  const [open, setOpen] = useState(false);

  if (!completed) {
    return (
      <div className="rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-[#395886] text-sm">{title}</p>
          <p className="text-xs text-[#395886]/50 mt-0.5">Belum dikerjakan</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">—</span>
      </div>
    );
  }

  const correctCount = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
  const pct = Math.round((correctCount / totalQ) * 100);

  return (
    <div className="rounded-2xl border border-[#D5DEEF] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#F8FAFD] hover:bg-[#F0F3FA] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              pct >= 80 ? 'bg-[#10B981]' : pct >= 60 ? 'bg-[#F59E0B]' : 'bg-red-400'
            }`}
          />
          <p className="font-bold text-[#395886] text-sm">{title}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              pct >= 80
                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                : pct >= 60
                ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}
          >
            {score ?? correctCount}/{totalQ} ({pct}%)
          </span>
          <ChevronDown className={`w-4 h-4 text-[#395886]/50 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="divide-y divide-[#D5DEEF] bg-white">
          {questions.map((q, i) => {
            const studentAns = answers[i] ?? null;
            const isCorrect = studentAns === q.correctAnswer;
            return (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start gap-2 mb-3">
                  {studentAns !== null ? (
                    isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-semibold text-[#395886]">
                    {i + 1}. {q.question}
                  </p>
                </div>
                <div className="ml-6 space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isStudent = oi === studentAns;
                    const isCorrectOpt = oi === q.correctAnswer;
                    return (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                          isCorrectOpt
                            ? 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-semibold'
                            : isStudent && !isCorrect
                            ? 'bg-red-50 border border-red-200 text-red-700 font-semibold'
                            : 'bg-[#F8FAFD] text-[#395886]/70'
                        }`}
                      >
                        <span className="shrink-0 w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrectOpt && <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide">Benar</span>}
                        {isStudent && !isCorrect && <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide">Jawaban Anda</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Modal Detail Siswa ───────────────────────────────────────────────────────

function StudentDetailModal({
  activity,
  onClose,
}: {
  activity: StudentActivitySummary;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'summary' | 'tests' | 'ctl'>('summary');

  const tabItems = [
    { id: 'summary' as const, label: 'Ringkasan' },
    { id: 'tests' as const, label: 'Riwayat Tes' },
    { id: 'ctl' as const, label: 'Monitoring CTL' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-[#D5DEEF] bg-white shadow-2xl">
        {/* Kepala Modal */}
        <div className="shrink-0 bg-gradient-to-r from-[#628ECB] to-[#395886] px-8 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {activity.group && (
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full tracking-wide">
                    {activity.group}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold">{activity.student.name}</h2>
              <p className="text-white/75 text-sm mt-1">
                {activity.student.nis} · {activity.student.class} · {activity.student.gender}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{activity.overallProgress}%</p>
              <p className="text-white/70 text-xs mt-1 uppercase tracking-wider">Progress Keseluruhan</p>
            </div>
          </div>

          {/* Tab bar di dalam kepala */}
          <div className="mt-5 flex gap-1 bg-white/10 rounded-xl p-1">
            {tabItems.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  tab === t.id ? 'bg-white text-[#395886] shadow-sm' : 'text-white/70 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Isi Modal */}
        <div className="flex-1 overflow-y-auto">
          {/* ── Tab: Ringkasan ── */}
          {tab === 'summary' && (
            <div className="p-6 space-y-6">
              {/* Info + Tes Global */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] p-4 sm:col-span-1">
                  <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-wide mb-3">Info Siswa</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-[#395886]"><span className="text-[#395886]/60">Email:</span> {activity.student.email}</p>
                    <p className="text-[#395886]"><span className="text-[#395886]/60">NIS:</span> {activity.student.nis}</p>
                    <p className="text-[#395886]"><span className="text-[#395886]/60">Kelompok:</span> {activity.group ?? <span className="italic text-[#395886]/40">Belum memilih</span>}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] p-4 text-center">
                  <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-wide mb-2">Pre-Test Umum</p>
                  {activity.globalPretestCompleted ? (
                    <>
                      <p className="text-3xl font-bold text-[#628ECB]">{activity.globalPretest}/{globalPretest.questions.length}</p>
                      <p className="text-sm text-[#628ECB]/70 mt-1">{Math.round(((activity.globalPretest ?? 0) / globalPretest.questions.length) * 100)}%</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-gray-300 mt-2">—</p>
                  )}
                </div>
                <div className="rounded-2xl border border-[#D5DEEF] bg-[#F8FAFD] p-4 text-center">
                  <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-wide mb-2">Post-Test Umum</p>
                  {activity.globalPosttestCompleted ? (
                    <>
                      <p className="text-3xl font-bold text-[#F59E0B]">{activity.globalPosttest}/{globalPosttest.questions.length}</p>
                      <p className="text-sm text-[#F59E0B]/70 mt-1">{Math.round(((activity.globalPosttest ?? 0) / globalPosttest.questions.length) * 100)}%</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-gray-300 mt-2">—</p>
                  )}
                </div>
              </div>

              {/* Progress Pertemuan */}
              <div>
                <h3 className="text-[#395886] font-bold text-base mb-3">Progress Setiap Pertemuan</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activity.lessons.map((lesson) => {
                    const lesson_data = lessons[lesson.lessonId];
                    const pct = Math.round(
                      (((lesson.pretestCompleted ? 1 : 0) + lesson.completedStages.length + (lesson.posttestCompleted ? 1 : 0)) /
                        (1 + lesson.totalStages + 1)) *
                        100
                    );
                    return (
                      <div key={lesson.lessonId} className="rounded-2xl border border-[#D5DEEF] p-4 bg-[#F8FAFD]">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-[#395886] text-sm">{lesson.lessonTitle}</p>
                            <p className="text-xs text-[#628ECB]">{lesson.topic}</p>
                          </div>
                          <span className="text-sm font-bold text-[#628ECB]">{pct}%</span>
                        </div>
                        <div className="w-full bg-[#D5DEEF] rounded-full h-1.5 mb-3 overflow-hidden">
                          <div className="bg-[#628ECB] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lesson.pretestCompleted ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            Pre-Test {lesson.pretestCompleted ? `✓ ${lesson.pretest}/${lesson_data?.pretest.questions.length ?? '?'}` : '—'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lesson.completedStages.length > 0 ? 'bg-[#628ECB]/10 text-[#628ECB] border-[#628ECB]/20' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            CTL {lesson.completedStages.length}/{lesson.totalStages}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lesson.posttestCompleted ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            Post-Test {lesson.posttestCompleted ? `✓ ${lesson.posttest}/${lesson_data?.posttest.questions.length ?? '?'}` : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Riwayat Tes ── */}
          {tab === 'tests' && (
            <div className="p-6 space-y-3">
              <TestAnswerSection
                title="Pre-Test Umum"
                score={activity.globalPretest}
                totalQ={globalPretest.questions.length}
                completed={activity.globalPretestCompleted}
                questions={globalPretest.questions}
                answers={activity.globalPretestAnswers}
              />
              {activity.lessons.map((lesson) => {
                const ld = lessons[lesson.lessonId];
                if (!ld) return null;
                return (
                  <div key={lesson.lessonId} className="space-y-2">
                    <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-widest px-1">
                      {lesson.lessonTitle} — {lesson.topic}
                    </p>
                    <TestAnswerSection
                      title={`Pre-Test ${lesson.lessonTitle}`}
                      score={lesson.pretest}
                      totalQ={ld.pretest.questions.length}
                      completed={lesson.pretestCompleted}
                      questions={ld.pretest.questions}
                      answers={lesson.pretestAnswers}
                    />
                    <TestAnswerSection
                      title={`Post-Test ${lesson.lessonTitle}`}
                      score={lesson.posttest}
                      totalQ={ld.posttest.questions.length}
                      completed={lesson.posttestCompleted}
                      questions={ld.posttest.questions}
                      answers={lesson.posttestAnswers}
                    />
                  </div>
                );
              })}
              <TestAnswerSection
                title="Post-Test Umum"
                score={activity.globalPosttest}
                totalQ={globalPosttest.questions.length}
                completed={activity.globalPosttestCompleted}
                questions={globalPosttest.questions}
                answers={activity.globalPosttestAnswers}
              />
            </div>
          )}

          {/* ── Tab: Monitoring CTL ── */}
          {tab === 'ctl' && (
            <div className="p-6 space-y-6">
              {activity.lessons.map((lesson) => {
                const ld = lessons[lesson.lessonId];
                if (!ld) return null;
                return (
                  <div key={lesson.lessonId}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-[#395886]">{lesson.lessonTitle}</h3>
                        <p className="text-xs text-[#628ECB]">{lesson.topic}</p>
                      </div>
                      <span className="text-xs font-bold text-[#628ECB] bg-[#628ECB]/10 px-3 py-1 rounded-full">
                        {lesson.completedStages.length}/{lesson.totalStages} Selesai
                      </span>
                    </div>
                    <div className="rounded-2xl border border-[#D5DEEF] overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#F0F3FA]">
                            <th className="px-4 py-3 text-left text-xs font-bold text-[#395886]/50 uppercase tracking-wide w-8">#</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-[#395886]/50 uppercase tracking-wide">Tahap CTL</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-[#395886]/50 uppercase tracking-wide w-24">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-[#395886]/50 uppercase tracking-wide">Ringkasan Jawaban</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D5DEEF]">
                          {ld.stages.map((stage, si) => {
                            const done = lesson.completedStages.includes(si);
                            const stageAnswer = lesson.stageAnswers[`stage_${si}`];
                            const meta = CTL_META[stage.type] ?? CTL_META.constructivism;
                            return (
                              <tr key={si} className={done ? 'bg-white' : 'bg-[#F8FAFD]'}>
                                <td className="px-4 py-3 text-xs font-bold text-[#395886]/40">{si + 1}</td>
                                <td className="px-4 py-3">
                                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${meta.bg} ${meta.text} ${meta.border}`}>
                                    {meta.icon}
                                    {meta.label}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {done ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#10B981]">
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      Selesai
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-[#395886]/30">Belum</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {done ? (
                                    <StageAnswerDetail stage={stage} answer={stageAnswer} />
                                  ) : (
                                    <span className="text-xs text-[#395886]/30 italic">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kaki Modal */}
        <div className="shrink-0 flex justify-end border-t border-[#D5DEEF] bg-[#F8FAFD] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-2xl bg-[#628ECB] px-8 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#395886] active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Admin Utama ──────────────────────────────────────────────────────

export function AdminPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [selectedStudent, setSelectedStudent] = useState<StudentActivitySummary | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'groups'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const students = getAllStudents();

  const groupAssignments = useMemo<Record<string, string>>(
    () => JSON.parse(localStorage.getItem(GROUP_STORAGE_KEY) || '{}'),
    []
  );

  const availableGroups = useMemo<string[]>(() => {
    const firstLesson = Object.values(lessons)[0];
    const lcStage = firstLesson?.stages.find((s) => s.type === 'learning-community');
    return lcStage?.groupActivity?.groupNames ?? [];
  }, []);

  const studentActivities = useMemo<StudentActivitySummary[]>(() => {
    return students.map((student) => {
      const allProgress = getAllProgress(student.id);
      const globalTests = getGlobalTestProgress(student.id);
      const globalPretestAnswers: number[] = JSON.parse(
        localStorage.getItem(`global_pretest_answers_${student.id}`) || '[]'
      );
      const globalPosttestAnswers: number[] = JSON.parse(
        localStorage.getItem(`global_posttest_answers_${student.id}`) || '[]'
      );

      const lessonsData: LessonSummary[] = Object.values(lessons).map((lesson) => {
        const lp = getLessonProgress(student.id, lesson.id);
        return {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          topic: lesson.topic,
          pretestCompleted: lp.pretestCompleted,
          pretest: lp.pretestScore ?? null,
          pretestAnswers: Array.isArray(lp.answers['pretest']) ? lp.answers['pretest'] : [],
          posttestCompleted: lp.posttestCompleted,
          posttest: lp.posttestScore ?? null,
          posttestAnswers: Array.isArray(lp.answers['posttest']) ? lp.answers['posttest'] : [],
          completedStages: lp.completedStages,
          totalStages: lesson.stages.length,
          stageAnswers: lp.answers,
        };
      });

      const totalSteps = 2 + Object.values(lessons).length * 9;
      let completedSteps = 0;
      if (globalTests.globalPretestCompleted) completedSteps++;
      if (globalTests.globalPosttestCompleted) completedSteps++;
      allProgress.forEach((p) => {
        if (p.pretestCompleted) completedSteps++;
        completedSteps += p.completedStages.length;
        if (p.posttestCompleted) completedSteps++;
      });

      return {
        student: {
          id: student.id,
          name: student.name,
          username: student.username,
          email: student.email,
          gender: student.gender,
          class: student.class,
          nis: student.nis,
        },
        group: groupAssignments[student.id] ?? null,
        globalPretestCompleted: globalTests.globalPretestCompleted,
        globalPretest: globalTests.globalPretestScore ?? null,
        globalPretestAnswers,
        globalPosttestCompleted: globalTests.globalPosttestCompleted,
        globalPosttest: globalTests.globalPosttestScore ?? null,
        globalPosttestAnswers,
        overallProgress: Math.round((completedSteps / totalSteps) * 100),
        lessons: lessonsData,
      };
    });
  }, [students, groupAssignments]);

  // Statistik
  const totalStudents = studentActivities.length;
  const activeStudents = studentActivities.filter((s) => s.overallProgress > 0).length;
  const averageProgress =
    totalStudents > 0
      ? Math.round(studentActivities.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents)
      : 0;
  const completedStudents = studentActivities.filter((s) => s.overallProgress === 100).length;

  // Siswa yang difilter untuk tabel
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return studentActivities;
    return studentActivities.filter(
      (s) =>
        s.student.name.toLowerCase().includes(q) ||
        s.student.nis.toLowerCase().includes(q) ||
        s.student.class.toLowerCase().includes(q) ||
        (s.group ?? '').toLowerCase().includes(q)
    );
  }, [studentActivities, searchQuery]);

  // Siswa dikelompokkan
  const studentsByGroup = useMemo(() => {
    const groups: Record<string, StudentActivitySummary[]> = {};
    availableGroups.forEach((g) => (groups[g] = []));
    const noGroup: StudentActivitySummary[] = [];
    studentActivities.forEach((activity) => {
      if (activity.group && groups[activity.group] !== undefined) {
        groups[activity.group].push(activity);
      } else if (activity.group) {
        if (!groups[activity.group]) groups[activity.group] = [];
        groups[activity.group].push(activity);
      } else {
        noGroup.push(activity);
      }
    });
    return { groups, noGroup };
  }, [studentActivities, availableGroups]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const confirmLogout = () => setIsLogoutOpen(true);

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Kepala */}
      <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                </div>
              </Link>
              <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
              <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">Admin Panel</span>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-semibold"
              >
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </button>
              <div className="h-6 w-px bg-[#D5DEEF]" />
              <button
                onClick={confirmLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
            <MobileSidebar
              title="Menu Admin"
              description="Akses fitur utama panel admin."
              items={[
                { label: 'Dashboard Admin', to: '/admin', icon: <ShieldCheck className="h-4 w-4" /> },
                { label: 'Profil', onClick: () => setIsProfileOpen(true), icon: <User className="h-4 w-4" /> },
                { label: 'Logout', onClick: confirmLogout, icon: <LogOut className="h-4 w-4" />, danger: true },
              ]}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Judul Halaman */}
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#628ECB] mb-2">Monitoring Panel</p>
          <h1 className="text-3xl font-bold text-[#395886] tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-base leading-7 text-[#395886]/70">
            Kelola data siswa, pantau kelompok belajar, dan tinjau progres pembelajaran CTL secara menyeluruh.
          </p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {[
            { label: 'Total Siswa', value: totalStudents, color: 'text-[#395886]', bg: 'bg-[#628ECB]/10 text-[#628ECB]', icon: <Users className="w-7 h-7" /> },
            { label: 'Siswa Aktif', value: activeStudents, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 text-[#10B981]', icon: <TrendingUp className="w-7 h-7" /> },
            { label: 'Rata-rata Progress', value: `${averageProgress}%`, color: 'text-[#628ECB]', bg: 'bg-[#628ECB]/10 text-[#628ECB]', icon: <ShieldCheck className="w-7 h-7" /> },
            { label: 'Selesai Semua', value: completedStudents, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: <Trophy className="w-7 h-7" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-[#D5DEEF] transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#395886]/60 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab */}
        <div className="flex gap-1 bg-white border border-[#D5DEEF] rounded-2xl p-1 mb-6 w-fit shadow-sm">
          {[
            { id: 'students' as const, label: 'Aktivitas Siswa', icon: <Eye className="w-4 h-4" /> },
            { id: 'groups' as const, label: 'Kelompok Belajar', icon: <Users className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-[#628ECB] text-white shadow-md'
                  : 'text-[#395886]/60 hover:text-[#395886] hover:bg-[#F0F3FA]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Aktivitas Siswa ── */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#D5DEEF]">
            {/* Kepala Tabel + Pencarian */}
            <div className="px-6 py-4 border-b border-[#D5DEEF] flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[#395886] font-bold text-lg">Daftar Siswa</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#395886]/40" />
                <input
                  type="text"
                  placeholder="Cari nama, NIS, kelas, kelompok..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-[#D5DEEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#628ECB]/30 focus:border-[#628ECB] bg-[#F8FAFD] text-[#395886] w-64"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-[#395886]/40" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-[#F0F3FA]/60">
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">NIS</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Nama</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Kelas</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Kelompok</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Progress</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Pre / Post Umum</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Tahapan CTL</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold text-[#395886]/55 uppercase tracking-wide">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D5DEEF]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <Filter className="w-10 h-10 text-[#D5DEEF] mx-auto mb-3" />
                        <p className="text-sm text-[#395886]/40">
                          {searchQuery ? `Tidak ada siswa yang cocok dengan "${searchQuery}"` : 'Belum ada data siswa.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((activity) => {
                      const totalCtlCompleted = activity.lessons.reduce((s, l) => s + l.completedStages.length, 0);
                      const totalCtl = activity.lessons.reduce((s, l) => s + l.totalStages, 0);
                      return (
                        <tr key={activity.student.id} className="hover:bg-[#F8FAFD] transition-colors">
                          <td className="px-5 py-3.5 text-sm font-medium text-[#395886]/60">{activity.student.nis}</td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-bold text-[#395886]">{activity.student.name}</p>
                            <p className="text-xs text-[#395886]/45">{activity.student.username}</p>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-[#395886]/70">{activity.student.class}</td>
                          <td className="px-5 py-3.5">
                            {activity.group ? (
                              <span className="text-xs font-bold bg-[#628ECB]/10 text-[#628ECB] border border-[#628ECB]/20 px-2.5 py-1 rounded-full">
                                {activity.group}
                              </span>
                            ) : (
                              <span className="text-xs text-[#395886]/30 italic">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-20 bg-[#D5DEEF] rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    activity.overallProgress === 100
                                      ? 'bg-[#10B981]'
                                      : activity.overallProgress >= 50
                                      ? 'bg-[#628ECB]'
                                      : 'bg-[#F59E0B]'
                                  }`}
                                  style={{ width: `${activity.overallProgress}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-[#628ECB]">{activity.overallProgress}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-sm font-semibold text-[#395886]">
                              {activity.globalPretestCompleted ? (
                                <span className="text-[#628ECB]">{activity.globalPretest}</span>
                              ) : (
                                <span className="text-[#395886]/30">—</span>
                              )}
                              {' / '}
                              {activity.globalPosttestCompleted ? (
                                <span className="text-[#F59E0B]">{activity.globalPosttest}</span>
                              ) : (
                                <span className="text-[#395886]/30">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {activity.lessons.map((lesson, idx) => (
                                  <div
                                    key={lesson.lessonId}
                                    title={`${lesson.lessonTitle}: ${lesson.completedStages.length}/${lesson.totalStages} tahap`}
                                    className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold border ${
                                      lesson.completedStages.length === lesson.totalStages
                                        ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                                        : lesson.completedStages.length > 0
                                        ? 'bg-[#628ECB]/10 text-[#628ECB] border-[#628ECB]/20'
                                        : 'bg-gray-100 text-gray-400 border-gray-200'
                                    }`}
                                  >
                                    P{idx + 1}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-[#395886]/50">{totalCtlCompleted}/{totalCtl}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <button
                              onClick={() => setSelectedStudent(activity)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#628ECB] hover:bg-[#395886] transition-colors px-3 py-1.5 rounded-xl shadow-sm active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredStudents.length > 0 && (
              <div className="px-6 py-3 bg-[#F8FAFD] border-t border-[#D5DEEF]">
                <p className="text-xs text-[#395886]/50 font-medium">
                  Menampilkan {filteredStudents.length} dari {totalStudents} siswa
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Kelompok Belajar ── */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            {/* Bilah statistik kelompok */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-white rounded-2xl border border-[#D5DEEF] p-5 shadow-sm">
                <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-wide mb-1">Total Kelompok</p>
                <p className="text-3xl font-bold text-[#395886]">{availableGroups.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#D5DEEF] p-5 shadow-sm">
                <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-wide mb-1">Sudah Bergabung</p>
                <p className="text-3xl font-bold text-[#10B981]">{studentActivities.filter((s) => s.group).length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#D5DEEF] p-5 shadow-sm">
                <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-wide mb-1">Belum Bergabung</p>
                <p className="text-3xl font-bold text-[#F59E0B]">{studentActivities.filter((s) => !s.group).length}</p>
              </div>
            </div>

            {/* Kartu Kelompok */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {availableGroups.map((groupName) => {
                const members = studentsByGroup.groups[groupName] ?? [];
                const avgProgress =
                  members.length > 0
                    ? Math.round(members.reduce((s, m) => s + m.overallProgress, 0) / members.length)
                    : 0;
                return (
                  <div key={groupName} className="bg-white rounded-2xl border border-[#D5DEEF] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#628ECB] to-[#395886] px-5 py-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-base">{groupName}</h3>
                        <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                          {members.length} anggota
                        </span>
                      </div>
                      {members.length > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-white/70">Avg. Progress</span>
                            <span className="text-xs font-bold text-white">{avgProgress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-white h-full rounded-full" style={{ width: `${avgProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="divide-y divide-[#D5DEEF]">
                      {members.length === 0 ? (
                        <div className="px-5 py-6 text-center">
                          <Users className="w-8 h-8 text-[#D5DEEF] mx-auto mb-2" />
                          <p className="text-sm text-[#395886]/40 italic">Belum ada anggota</p>
                        </div>
                      ) : (
                        members.map((m) => (
                          <div key={m.student.id} className="px-5 py-3 flex items-center gap-3 hover:bg-[#F8FAFD] transition-colors">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#628ECB]/10 text-[#628ECB]">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#395886] text-sm truncate">{m.student.name}</p>
                              <p className="text-xs text-[#395886]/50">{m.student.class}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-[#628ECB]">{m.overallProgress}%</p>
                            </div>
                            <button
                              onClick={() => setSelectedStudent(m)}
                              className="shrink-0 text-[#395886]/30 hover:text-[#628ECB] transition-colors"
                              title="Lihat detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Siswa tanpa kelompok */}
            {studentsByGroup.noGroup.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#D5DEEF] shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-[#F8FAFD] border-b border-[#D5DEEF]">
                  <h3 className="font-bold text-[#395886]/60 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Belum Memilih Kelompok ({studentsByGroup.noGroup.length} siswa)
                  </h3>
                </div>
                <div className="divide-y divide-[#D5DEEF]">
                  {studentsByGroup.noGroup.map((m) => (
                    <div key={m.student.id} className="px-5 py-3 flex items-center gap-3 hover:bg-[#F8FAFD] transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#395886] text-sm truncate">{m.student.name}</p>
                        <p className="text-xs text-[#395886]/50">{m.student.class} · {m.student.nis}</p>
                      </div>
                      <span className="text-xs font-bold text-[#395886]/50">{m.overallProgress}%</span>
                      <button
                        onClick={() => setSelectedStudent(m)}
                        className="shrink-0 text-[#395886]/30 hover:text-[#628ECB] transition-colors"
                        title="Lihat detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Detail */}
      {selectedStudent && (
        <StudentDetailModal
          activity={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdate={() => window.location.reload()}
      />

      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent className="border-[#D5DEEF] rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#395886] text-xl font-bold">Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription className="text-[#395886]/60 font-medium">
              Apakah Anda yakin ingin logout dari panel admin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="border-[#D5DEEF] text-[#395886] hover:bg-[#F0F3FA] rounded-xl font-bold">
              Tidak
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
