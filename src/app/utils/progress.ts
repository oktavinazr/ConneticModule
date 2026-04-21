// Utilitas pelacakan progres
import { lessons } from '../data/lessons';

export interface LessonProgress {
  lessonId: string;
  userId: string;
  pretestCompleted: boolean;
  pretestScore?: number;
  completedStages: number[];
  posttestCompleted: boolean;
  posttestScore?: number;
  answers: Record<string, any>;
  stageAttempts: Record<string, number>;
  stageSuccess: Record<string, boolean>;
}

export interface GlobalTestProgress {
  userId: string;
  globalPretestCompleted: boolean;
  globalPretestScore?: number;
  globalPosttestCompleted: boolean;
  globalPosttestScore?: number;
}

// Pretest/posttest global
export const saveGlobalPretestResult = (userId: string, score: number, answers: any[]) => {
  const key = `global_test_${userId}`;
  const progress: GlobalTestProgress = JSON.parse(
    localStorage.getItem(key) ||
      JSON.stringify({
        userId,
        globalPretestCompleted: false,
        globalPosttestCompleted: false,
      })
  );

  progress.globalPretestCompleted = true;
  progress.globalPretestScore = score;
  localStorage.setItem(key, JSON.stringify(progress));
  localStorage.setItem(`global_pretest_answers_${userId}`, JSON.stringify(answers));
};

export const saveGlobalPosttestResult = (userId: string, score: number, answers: any[]) => {
  const key = `global_test_${userId}`;
  const progress: GlobalTestProgress = JSON.parse(
    localStorage.getItem(key) ||
      JSON.stringify({
        userId,
        globalPretestCompleted: false,
        globalPosttestCompleted: false,
      })
  );

  progress.globalPosttestCompleted = true;
  progress.globalPosttestScore = score;
  localStorage.setItem(key, JSON.stringify(progress));
  localStorage.setItem(`global_posttest_answers_${userId}`, JSON.stringify(answers));
};

export const getGlobalTestProgress = (userId: string): GlobalTestProgress => {
  const key = `global_test_${userId}`;
  return JSON.parse(
    localStorage.getItem(key) ||
      JSON.stringify({
        userId,
        globalPretestCompleted: false,
        globalPosttestCompleted: false,
      })
  );
};

// Pretest/posttest pertemuan
export const savePretestResult = (userId: string, lessonId: string, score: number, answers: any[]) => {
  const key = `progress_${userId}_${lessonId}`;
  const progress = getLessonProgress(userId, lessonId);

  progress.pretestCompleted = true;
  progress.pretestScore = score;
  progress.answers['pretest'] = answers;

  localStorage.setItem(key, JSON.stringify(progress));
};

export const savePosttestResult = (userId: string, lessonId: string, score: number, answers: any[]) => {
  const key = `progress_${userId}_${lessonId}`;
  const progress = getLessonProgress(userId, lessonId);

  progress.posttestCompleted = true;
  progress.posttestScore = score;
  progress.answers['posttest'] = answers;

  localStorage.setItem(key, JSON.stringify(progress));
};

export const saveReflectionResult = (userId: string, lessonId: string, reflectionData: any) => {
  const key = `progress_${userId}_${lessonId}`;
  const progress = getLessonProgress(userId, lessonId);

  progress.answers['main_reflection'] = reflectionData;

  localStorage.setItem(key, JSON.stringify(progress));
};

export const saveStageAttempt = (userId: string, lessonId: string, stageIndex: number, isCorrect: boolean) => {
  const key = `progress_${userId}_${lessonId}`;
  const progress = getLessonProgress(userId, lessonId);
  
  const stageKey = `stage_${stageIndex}`;
  progress.stageAttempts[stageKey] = (progress.stageAttempts[stageKey] || 0) + 1;
  
  if (isCorrect) {
    progress.stageSuccess[stageKey] = true;
  }

  localStorage.setItem(key, JSON.stringify(progress));
  return progress.stageAttempts[stageKey];
};

export const saveStageProgress = (userId: string, lessonId: string, stageIndex: number, answer: any) => {
  const key = `progress_${userId}_${lessonId}`;
  const progress = getLessonProgress(userId, lessonId);

  if (!progress.completedStages.includes(stageIndex)) {
    progress.completedStages.push(stageIndex);
  }

  progress.answers[`stage_${stageIndex}`] = answer;
  localStorage.setItem(key, JSON.stringify(progress));
};

export const getLessonProgress = (userId: string, lessonId: string): LessonProgress => {
  const key = `progress_${userId}_${lessonId}`;
  const defaults: LessonProgress = {
    lessonId,
    userId,
    pretestCompleted: false,
    completedStages: [],
    posttestCompleted: false,
    answers: {},
    stageAttempts: {},
    stageSuccess: {},
  };
  const stored = localStorage.getItem(key);
  if (!stored) return defaults;
  // Gabungkan dengan nilai default agar field yang ditambahkan kemudian (misal: stageAttempts) tidak pernah undefined.
  return { ...defaults, ...JSON.parse(stored) };
};

export const getAllProgress = (userId: string) => {
  const lessonIds = Object.keys(lessons);
  return lessonIds.map((lessonId) => getLessonProgress(userId, lessonId));
};

// Cek apakah pertemuan terbuka
export const isLessonUnlocked = (userId: string, lessonId: string): boolean => {
  const globalTest = getGlobalTestProgress(userId);

  // Harus menyelesaikan pretest global terlebih dahulu
  if (!globalTest.globalPretestCompleted) {
    return false;
  }

  // Pertemuan 1 terbuka setelah pretest global
  if (lessonId === '1') {
    return true;
  }

  // Untuk pertemuan lain, cek apakah pertemuan sebelumnya sudah selesai
  const prevLessonId = String(Number(lessonId) - 1);
  const prevProgress = getLessonProgress(userId, prevLessonId);
  const prevLesson = lessons[prevLessonId];

  if (!prevLesson) return false;

  // Pertemuan sebelumnya harus sudah menyelesaikan pretest, semua tahap, dan posttest
  return (
    prevProgress.pretestCompleted &&
    prevProgress.completedStages.length === prevLesson.stages.length &&
    prevProgress.posttestCompleted
  );
};

// Cek apakah posttest global terbuka
export const isGlobalPosttestUnlocked = (userId: string): boolean => {
  const allProgress = getAllProgress(userId);

  // Semua pertemuan harus sudah selesai (pretest, semua tahap, posttest)
  return allProgress.every(
    (progress) =>
      progress.pretestCompleted &&
      progress.completedStages.length === (lessons[progress.lessonId]?.stages.length || 0) &&
      progress.posttestCompleted
  );
};
