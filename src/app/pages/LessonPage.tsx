import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  BookOpen,
  ChevronLeft,
  CheckCircle,
  Info,
  Video,
  Search,
  HelpCircle,
  Users,
  MonitorPlay,
  Lightbulb,
  FileText,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { getLessonProgress, saveStageProgress, saveStageAttempt } from '../utils/progress';
import { getStageDisplayTitle, lessons, stageLearningObjectivesByLesson } from '../data/lessons';
import { ConstructivismStage } from '../components/stages/ConstructivismStage';
import { InquiryStage } from '../components/stages/InquiryStage';
import { QuestioningStage } from '../components/stages/QuestioningStage';
import { LearningCommunityStage } from '../components/stages/LearningCommunityStage';
import { ModelingStage } from '../components/stages/ModelingStage';
import { ReflectionStage } from '../components/stages/ReflectionStage';
import { AuthenticAssessmentStage } from '../components/stages/AuthenticAssessmentStage';
import { LessonFlowSidebar } from '../components/LessonFlowSidebar';

type StageType =
  | 'constructivism'
  | 'inquiry'
  | 'questioning'
  | 'learning-community'
  | 'modeling'
  | 'reflection'
  | 'authentic-assessment';

interface StageGuide {
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  steps: string[];
}

const stageGuides: Record<StageType, StageGuide> = {
  constructivism: {
    icon: <Video className="w-5 h-5" />,
    label: 'Constructivism',
    accentColor: 'text-[#628ECB]',
    borderColor: 'border-[#628ECB]/30',
    bgColor: 'bg-[#628ECB]/5',
    steps: [
      'Baca skenario apersepsi dengan seksama — bayangkan situasinya dari pengalamanmu sendiri.',
      'Pilih jawaban yang paling sesuai dengan pemahamanmu saat ini.',
      'Tuliskan alasan singkat pilihanmu, lalu periksa apakah jawabanmu tepat.',
    ],
  },
  inquiry: {
    icon: <Search className="w-5 h-5" />,
    label: 'Inquiry',
    accentColor: 'text-[#10B981]',
    borderColor: 'border-[#10B981]/30',
    bgColor: 'bg-[#10B981]/5',
    steps: [
      'Klik setiap bagian materi untuk membukanya — baca dengan cermat sebelum lanjut.',
      'Setelah semua bagian dibaca, lanjut ke aktivitas pengelompokan.',
      'Seret item ke kelompok/kategori yang tepat, lalu periksa jawabanmu.',
    ],
  },
  questioning: {
    icon: <HelpCircle className="w-5 h-5" />,
    label: 'Questioning',
    accentColor: 'text-[#8B5CF6]',
    borderColor: 'border-[#8B5CF6]/30',
    bgColor: 'bg-[#8B5CF6]/5',
    steps: [
      'Baca skenario dengan teliti — pahami konteks situasi yang diceritakan.',
      'Jawab pertanyaan "mengapa" dengan memilih alasan yang paling logis.',
      'Gunakan tombol bantuan (hint) jika butuh petunjuk sebelum menjawab.',
    ],
  },
  'learning-community': {
    icon: <Users className="w-5 h-5" />,
    label: 'Learning Community',
    accentColor: 'text-[#F59E0B]',
    borderColor: 'border-[#F59E0B]/30',
    bgColor: 'bg-[#F59E0B]/5',
    steps: [
      'Selesaikan aktivitas matching: klik item kiri, lalu klik pasangannya di kanan.',
      'Analisis studi kasus dan pilih solusi yang paling tepat beserta alasannya.',
      'Lihat dan bandingkan jawabanmu dengan perspektif kelompok lain.',
    ],
  },
  modeling: {
    icon: <MonitorPlay className="w-5 h-5" />,
    label: 'Modeling',
    accentColor: 'text-[#EC4899]',
    borderColor: 'border-[#EC4899]/30',
    bgColor: 'bg-[#EC4899]/5',
    steps: [
      'Pelajari setiap langkah satu per satu menggunakan tombol navigasi (Sebelumnya / Selanjutnya).',
      'Setelah semua langkah dipelajari, lanjut ke latihan pengurutan.',
      'Seret langkah-langkah ke urutan yang benar, lalu periksa jawabanmu.',
    ],
  },
  reflection: {
    icon: <Lightbulb className="w-5 h-5" />,
    label: 'Reflection',
    accentColor: 'text-[#F59E0B]',
    borderColor: 'border-[#F59E0B]/30',
    bgColor: 'bg-[#F59E0B]/5',
    steps: [
      'Renungkan perkembangan pemahamanmu — bandingkan dengan pengetahuan awal di Constructivism.',
      'Tuliskan refleksi singkat dengan kata-katamu sendiri (min. 30 karakter).',
      'Nilai pemahamanmu untuk setiap kriteria kompetensi secara jujur.',
    ],
  },
  'authentic-assessment': {
    icon: <FileText className="w-5 h-5" />,
    label: 'Authentic Assessment',
    accentColor: 'text-[#8B5CF6]',
    borderColor: 'border-[#8B5CF6]/30',
    bgColor: 'bg-[#8B5CF6]/5',
    steps: [
      'Baca konteks skenario secara menyeluruh sebelum membuat keputusan.',
      'Pilih keputusan dan ikuti konsekuensinya — jawab pertanyaan lanjutan yang muncul.',
      'Baca evaluasi akhir, atau coba jalur lain untuk memahami semua perspektif.',
    ],
  },
};

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const lesson = lessonId ? lessons[lessonId] : null;

  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(() =>
    getLessonProgress(user!.id, lessonId!)
  );
  const [guideVisible, setGuideVisible] = useState(true);

  const fullyCompleted = progress?.pretestCompleted && 
    progress?.completedStages?.length === (lesson?.stages.length || 0) && 
    progress?.posttestCompleted;

  useEffect(() => {
    if (!lesson) {
      navigate('/dashboard');
      return;
    }

    if (!progress.pretestCompleted) {
      navigate(`/lesson-intro/${lessonId}`);
      return;
    }

    if (currentStageIndex === null) {
      const firstIncomplete = lesson.stages.findIndex(
        (_, index) => !progress.completedStages.includes(index)
      );
      if (firstIncomplete !== -1) {
        setCurrentStageIndex(firstIncomplete);
      } else {
        setCurrentStageIndex(0);
      }
    }
  }, [lesson, progress, navigate, lessonId, currentStageIndex]);

  // Reset visibilitas panduan saat tahap berubah
  useEffect(() => {
    setGuideVisible(true);
  }, [currentStageIndex]);

  if (!lesson || currentStageIndex === null) return null;

  const currentStage = lesson.stages[currentStageIndex];
  const isLastStage = currentStageIndex === lesson.stages.length - 1;
  const guide = stageGuides[currentStage.type as StageType];
  const displayTitle = getStageDisplayTitle(currentStage.type);
  const stageLearningObjectives =
    stageLearningObjectivesByLesson[lesson.id]?.[currentStage.type] ?? [];

  const handleStageComplete = (answer: any) => {
    saveStageProgress(user!.id, lessonId!, currentStageIndex, answer);

    const updatedProgress = getLessonProgress(user!.id, lessonId!);
    setProgress(updatedProgress);

    if (isLastStage) {
      navigate(`/evaluation/${lessonId}`);
    } else {
      setCurrentStageIndex(currentStageIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStageClick = (index: number) => {
    // Tahap dapat diklik hanya jika pertemuan sudah selesai penuh (mode ulasan).
    // Jika belum selesai, urutan harus ketat — tidak bisa melompat ke tahap lain.
    // Hanya siswa yang sudah menyelesaikan seluruh tahapan yang dapat menggunakan "akses cepat".
    
    if (fullyCompleted) {
      setCurrentStageIndex(index);
      window.scrollTo(0, 0);
    }
  };

  const renderStage = () => {
    const commonProps = {
      onComplete: handleStageComplete,
      lessonId: lessonId!,
      stageIndex: currentStageIndex,
    };

    switch (currentStage.type) {
      case 'constructivism':
        return (
          <ConstructivismStage
            {...commonProps}
            apersepsi={currentStage.apersepsi}
            question={currentStage.question ?? ''}
            options={currentStage.options ?? []}
            correctAnswer={currentStage.correctAnswer}
            feedback={currentStage.feedback}
            videoUrl={currentStage.videoUrl}
          />
        );
      case 'inquiry':
        return (
          <InquiryStage
            {...commonProps}
            explorationSections={currentStage.explorationSections}
            groups={currentStage.groups}
            groupItems={currentStage.groupItems}
            question={currentStage.question}
          />
        );
      case 'questioning':
        return (
          <QuestioningStage
            {...commonProps}
            scenario={currentStage.scenario}
            whyQuestion={currentStage.whyQuestion}
            hint={currentStage.hint}
            reasonOptions={currentStage.reasonOptions}
            teacherQuestion={currentStage.teacherQuestion}
            questionBank={currentStage.questionBank}
          />
        );
      case 'learning-community':
        return (
          <LearningCommunityStage
            {...commonProps}
            matchingPairs={currentStage.matchingPairs}
            caseScenario={currentStage.caseScenario}
            peerAnswers={currentStage.peerAnswers}
          />
        );
      case 'modeling': {
        // Data pertemuan mungkin menggunakan `steps` (format sederhana) bukan `modelingSteps`.
        // Konversi steps → modelingSteps agar komponen selalu menerima data yang bisa digunakan.
        const modelingStepsData = currentStage.modelingSteps ??
          currentStage.steps?.map((s) => ({
            id: s.id,
            type: 'example' as const,
            title: s.title,
            content: s.description,
          }));
        return (
          <ModelingStage
            {...commonProps}
            modelingSteps={modelingStepsData}
          />
        );
      }
      case 'reflection':
        return (
          <ReflectionStage
            {...commonProps}
            essayReflection={currentStage.essayReflection}
            selfEvaluationCriteria={currentStage.selfEvaluationCriteria}
          />
        );
      case 'authentic-assessment':
        return (
          <AuthenticAssessmentStage
            {...commonProps}
            branchingScenario={currentStage.branchingScenario}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Header — sesuai gaya dashboard */}
      <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="truncate text-lg font-bold text-[#395886]">CONNETIC Module</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
                </div>
              </Link>
              <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
              <span className="hidden sm:block text-sm font-bold text-[#628ECB] uppercase tracking-widest">{lesson.title}</span>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors text-sm font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto lg:flex lg:items-start lg:gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar (Hanya Desktop) */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-[92px]">
          <LessonFlowSidebar
            lesson={lesson}
            lessonId={lessonId!}
            progress={progress}
            currentStep={3}
            currentStageIndex={currentStageIndex ?? 0}
            fullyCompleted={fullyCompleted}
            onStageClick={handleStageClick}
          />
        </aside>

        {/* Area Konten Utama */}
        <main className="flex-1 min-w-0">
          {/* Header Mobile — bilah tunggal ringkas */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-2xl border border-[#D5DEEF] shadow-sm px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#628ECB]">{lesson.title}</span>
                  <p className="text-xs font-bold text-[#395886] truncate">{lesson.topic}</p>
                </div>
                <span className="text-[10px] font-bold text-[#628ECB] bg-[#628ECB]/10 px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap">
                  Tahap {currentStageIndex + 1}/{lesson.stages.length}
                </span>
              </div>
              {/* Titik alur ringkas */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {lesson.stages.map((stage, index) => {
                  const completed = progress.completedStages.includes(index);
                  const isCurrent = index === currentStageIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => handleStageClick(index)}
                      disabled={!fullyCompleted}
                      title={getStageDisplayTitle(stage.type)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shrink-0 transition-all text-[10px] font-bold ${
                        isCurrent ? 'bg-[#628ECB] border-[#628ECB] text-white' : completed ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' : 'bg-white border-[#D5DEEF] text-[#395886]/35'
                      } ${!fullyCompleted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${isCurrent ? 'bg-white' : completed ? 'bg-[#10B981]' : 'bg-[#D5DEEF]'}`} />
                      {getStageDisplayTitle(stage.type)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kartu Header Tahap */}
          <div className="mb-6 bg-white rounded-[2rem] border border-[#D5DEEF] shadow-sm overflow-hidden">
            <div className={`px-6 py-5 flex items-center justify-between gap-4 border-b ${guide?.borderColor} ${guide?.bgColor}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${guide?.accentColor}`}>
                  {guide?.icon}
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${guide?.accentColor}`}>
                    Tahapan CTL
                  </p>
                  <h1 className="text-2xl font-extrabold text-[#395886]">{displayTitle}</h1>
                </div>
              </div>
              {currentStage.objectiveCode && (
                <div className="hidden sm:block">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border-2 ${guide?.borderColor} ${guide?.accentColor} bg-white/50`}>
                    {currentStage.objectiveCode}
                  </span>
                </div>
              )}
            </div>
            
            <div className="px-6 py-5 bg-gray-50/30">
              <p className="text-[#395886]/75 text-sm font-medium leading-relaxed">{currentStage.description}</p>
              {stageLearningObjectives.length > 0 && (
                <div className="mt-5 rounded-2xl border border-[#D5DEEF] bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-sm font-black text-[#395886]">Tujuan Pembelajaran</h2>
                    {currentStage.objectiveCode && (
                      <span className="text-[11px] font-bold text-[#628ECB]">
                        {currentStage.objectiveCode}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-3">
                    {stageLearningObjectives.map((objective) => (
                      <div key={objective.code} className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
                        <p className="text-xs font-black text-[#395886]">{objective.code}</p>
                        <p className="mt-1 text-xs font-medium leading-relaxed text-[#395886]/80">
                          {objective.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panduan Instruksi Tahap */}
          {guideVisible && guide && (
            <div className={`mb-6 rounded-[2rem] border-2 ${guide.borderColor} ${guide.bgColor} p-6 shadow-sm`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm mt-0.5 ${guide.accentColor}`}>
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold mb-2 ${guide.accentColor}`}>
                      Panduan Aktivitas
                    </p>
                    <ol className="space-y-2">
                      {guide.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-[13px] text-[#395886]/80 font-medium">
                          <span className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black shadow-sm mt-0.5 ${guide.accentColor}`}>
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <button
                  onClick={() => setGuideVisible(false)}
                  className="shrink-0 text-xs font-bold text-[#395886]/40 hover:text-[#395886] transition-colors mt-1"
                >
                  Sembunyikan
                </button>
              </div>
            </div>
          )}

          {!guideVisible && (
            <div className="mb-4 text-right">
              <button
                onClick={() => setGuideVisible(true)}
                className={`inline-flex items-center gap-2 text-xs font-bold ${guide?.accentColor} hover:opacity-80 transition-opacity bg-white px-4 py-2 rounded-xl border border-[#D5DEEF] shadow-sm`}
              >
                <Info className="w-4 h-4" />
                Tampilkan panduan
              </button>
            </div>
          )}

          {renderStage()}
        </main>
      </div>
    </div>
  );
}
