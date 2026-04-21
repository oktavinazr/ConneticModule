import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCurrentUser } from '../utils/auth';
import { getLessonProgress, savePosttestResult } from '../utils/progress';
import { lessons } from '../data/lessons';
import { TestPage } from '../components/TestPage';

export function EvaluationPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const lesson = lessonId ? lessons[lessonId] : null;

  const [progress, setProgress] = useState(() =>
    getLessonProgress(user!.id, lessonId!)
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!lesson) {
      navigate('/dashboard');
      return;
    }

    // Cek apakah semua tahap sudah selesai
    if (progress.completedStages.length < lesson.stages.length) {
      navigate(`/lesson/${lessonId}`);
    }
  }, [user, lesson, progress, lessonId, navigate]);

  if (!lesson) return null;

  const handleComplete = (score: number, answers: number[]) => {
    savePosttestResult(user!.id, lessonId!, score, answers);
    setProgress(getLessonProgress(user!.id, lessonId!));
    // Jangan otomatis arahkan ulang, biarkan pengguna meninjau
  };

  const existingAnswers = progress.posttestCompleted
    ? progress.answers.posttest
    : undefined;

  return (
    <TestPage
      title={`Post-Test ${lesson.title}`}
      description={`Evaluasi akhir untuk ${lesson.topic}`}
      questions={lesson.posttest.questions}
      onComplete={handleComplete}
      backPath="/dashboard"
      reflectionPath={`/reflection/${lessonId}`}
      showResults={progress.posttestCompleted}
      existingAnswers={existingAnswers}
      existingScore={progress.posttestScore}
      duration={15} // 15 menit untuk posttest pertemuan
      lessonFlow={{
        step: 4,
        lessonId: lessonId!,
        pretestCompleted: progress.pretestCompleted,
        allStagesCompleted: progress.completedStages.length === lesson.stages.length,
        posttestCompleted: progress.posttestCompleted,
      }}
    />
  );
}