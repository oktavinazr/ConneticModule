import { useNavigate } from 'react-router';
import { getCurrentUser } from '../utils/auth';
import { saveGlobalPretestResult, getGlobalTestProgress } from '../utils/progress';
import { globalPretest } from '../data/lessons';
import { TestPage } from '../components/TestPage';
import { useEffect, useState } from 'react';

export function GlobalPretestPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [progress, setProgress] = useState(() => getGlobalTestProgress(user!.id));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleComplete = (score: number, answers: number[]) => {
    saveGlobalPretestResult(user!.id, score, answers);
    setProgress(getGlobalTestProgress(user!.id));
    // Don't auto-redirect, let user review
  };

  const existingAnswers = progress.globalPretestCompleted
    ? JSON.parse(localStorage.getItem(`global_pretest_answers_${user!.id}`) || '[]')
    : undefined;

  return (
    <TestPage
      title={globalPretest.title}
      description={globalPretest.description}
      questions={globalPretest.questions}
      onComplete={handleComplete}
      backPath="/dashboard"
      showResults={progress.globalPretestCompleted}
      existingAnswers={existingAnswers}
      existingScore={progress.globalPretestScore}
      duration={20} // 20 minutes for global pretest
    />
  );
}