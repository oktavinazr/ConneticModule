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
      duration={20}
      instructions={[
        'Kerjakan secara mandiri tanpa membuka materi pembelajaran.',
        'Baca seluruh opsi jawaban lalu pilih satu jawaban yang paling tepat.',
        'Gunakan hasil tes ini sebagai gambaran pemahaman awal sebelum memulai materi.',
      ]}
      durationNote="Waktu pengerjaan maksimal 20 menit. Setelah waktu habis, jawaban yang sudah dipilih akan diproses otomatis."
    />
  );
}
