import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { BookOpen, ChevronLeft, CheckCircle } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { getLessonProgress, saveStageProgress } from '../utils/progress';
import { lessons } from '../data/lessons';
import { ConstructivismStage } from '../components/stages/ConstructivismStage';
import { InquiryStage } from '../components/stages/InquiryStage';
import { QuestioningStage } from '../components/stages/QuestioningStage';
import { LearningCommunityStage } from '../components/stages/LearningCommunityStage';
import { ModelingStage } from '../components/stages/ModelingStage';
import { ReflectionStage } from '../components/stages/ReflectionStage';
import { AuthenticAssessmentStage } from '../components/stages/AuthenticAssessmentStage';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const lesson = lessonId ? lessons[lessonId] : null;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(() =>
    getLessonProgress(user!.id, lessonId!)
  );

  useEffect(() => {
    if (!lesson) {
      navigate('/dashboard');
      return;
    }

    // Check if pretest completed
    if (!progress.pretestCompleted) {
      navigate(`/lesson-pretest/${lessonId}`);
      return;
    }

    // Find first incomplete stage
    const firstIncomplete = lesson.stages.findIndex(
      (_, index) => !progress.completedStages.includes(index)
    );
    if (firstIncomplete !== -1) {
      setCurrentStageIndex(firstIncomplete);
    }
  }, [lesson, progress, navigate, lessonId]);

  if (!lesson) return null;

  const currentStage = lesson.stages[currentStageIndex];
  const isLastStage = currentStageIndex === lesson.stages.length - 1;

  const handleStageComplete = (answer: any) => {
    saveStageProgress(user!.id, lessonId!, currentStageIndex, answer);

    // Update local progress
    const updatedProgress = getLessonProgress(user!.id, lessonId!);
    setProgress(updatedProgress);

    if (isLastStage) {
      // All stages completed, go to evaluation
      navigate(`/evaluation/${lessonId}`);
    } else {
      // Move to next stage
      setCurrentStageIndex(currentStageIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStage = () => {
    switch (currentStage.type) {
      case 'constructivism':
        return (
          <ConstructivismStage
            videoUrl={currentStage.videoUrl}
            question={currentStage.question}
            options={currentStage.options!}
            onComplete={handleStageComplete}
          />
        );
      case 'inquiry':
        return (
          <InquiryStage
            material={currentStage.material}
            question={currentStage.question}
            pairs={currentStage.pairs!}
            onComplete={handleStageComplete}
          />
        );
      case 'questioning':
        return (
          <QuestioningStage
            imageUrl={currentStage.imageUrl}
            question={currentStage.question}
            options={currentStage.options!}
            correctAnswer={currentStage.correctAnswer!}
            feedback={currentStage.feedback!}
            onComplete={handleStageComplete}
          />
        );
      case 'learning-community':
        return (
          <LearningCommunityStage
            groupActivity={currentStage.groupActivity}
            question={currentStage.question}
            options={currentStage.options!}
            onComplete={handleStageComplete}
          />
        );
      case 'modeling':
        return (
          <ModelingStage
            practiceInstructions={currentStage.practiceInstructions}
            question={currentStage.question}
            items={currentStage.items!}
            onComplete={handleStageComplete}
          />
        );
      case 'reflection':
        return (
          <ReflectionStage
            reflectionPrompts={currentStage.reflectionPrompts}
            question={currentStage.question}
            options={currentStage.options!}
            correctAnswer={currentStage.correctAnswer!}
            onComplete={handleStageComplete}
          />
        );
      case 'authentic-assessment':
        return (
          <AuthenticAssessmentStage
            question={currentStage.question}
            options={currentStage.options}
            correctAnswer={currentStage.correctAnswer}
            feedback={currentStage.feedback}
            onComplete={handleStageComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#395886]">CONNETIC Module</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-[#395886]">{lesson.title}: {lesson.topic}</h2>
          </div>
          <div className="flex items-center gap-2">
            {lesson.stages.map((stage, index) => (
              <div key={index} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    progress.completedStages.includes(index)
                      ? 'bg-[#10B981]'
                      : index === currentStageIndex
                      ? 'bg-[#628ECB]'
                      : 'bg-[#D5DEEF]'
                  }`}
                />
                <p
                  className={`text-xs mt-1 text-center ${
                    index === currentStageIndex
                      ? 'text-[#395886] font-semibold'
                      : 'text-[#395886]/60'
                  }`}
                >
                  {stage.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4 border-2 border-[#D5DEEF]">
            <span className="text-[#628ECB] font-semibold">Tahap {currentStageIndex + 1} dari {lesson.stages.length}</span>
          </div>
          <h1 className="text-3xl font-bold text-[#395886] mb-2">{currentStage.title}</h1>
          <p className="text-[#395886]/70">{currentStage.description}</p>
        </div>

        {renderStage()}
      </main>
    </div>
  );
}