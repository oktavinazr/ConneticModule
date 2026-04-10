// Progress tracking utilities
export interface LessonProgress {
  lessonId: string;
  userId: string;
  pretestCompleted: boolean;
  pretestScore?: number;
  completedStages: number[];
  posttestCompleted: boolean;
  posttestScore?: number;
  answers: Record<string, any>;
}

export interface GlobalTestProgress {
  userId: string;
  globalPretestCompleted: boolean;
  globalPretestScore?: number;
  globalPosttestCompleted: boolean;
  globalPosttestScore?: number;
}

// Global pretest/posttest
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

// Lesson pretest/posttest
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

export const saveStageProgress = (userId: string, lessonId: string, stageIndex: number, answer: any) => {
  const key = `progress_${userId}_${lessonId}`;
  const progress: LessonProgress = JSON.parse(
    localStorage.getItem(key) ||
      JSON.stringify({
        lessonId,
        userId,
        pretestCompleted: false,
        completedStages: [],
        posttestCompleted: false,
        answers: {},
      })
  );

  if (!progress.completedStages.includes(stageIndex)) {
    progress.completedStages.push(stageIndex);
  }

  progress.answers[`stage_${stageIndex}`] = answer;
  localStorage.setItem(key, JSON.stringify(progress));
};

export const getLessonProgress = (userId: string, lessonId: string): LessonProgress => {
  const key = `progress_${userId}_${lessonId}`;
  return JSON.parse(
    localStorage.getItem(key) ||
      JSON.stringify({
        lessonId,
        userId,
        pretestCompleted: false,
        completedStages: [],
        posttestCompleted: false,
        answers: {},
      })
  );
};

export const getAllProgress = (userId: string) => {
  const lessons = ['1', '2', '3', '4'];
  return lessons.map((lessonId) => getLessonProgress(userId, lessonId));
};

// Check if lesson is unlocked
export const isLessonUnlocked = (userId: string, lessonId: string): boolean => {
  const globalTest = getGlobalTestProgress(userId);

  // Must complete global pretest first
  if (!globalTest.globalPretestCompleted) {
    return false;
  }

  // Lesson 1 is unlocked after global pretest
  if (lessonId === '1') {
    return true;
  }

  // For other lessons, check if previous lesson is completed
  const prevLessonId = String(Number(lessonId) - 1);
  const prevProgress = getLessonProgress(userId, prevLessonId);

  // Previous lesson must have completed pretest, all stages, and posttest
  return (
    prevProgress.pretestCompleted &&
    prevProgress.completedStages.length === 7 && // 7 stages
    prevProgress.posttestCompleted
  );
};

// Check if global posttest is unlocked
export const isGlobalPosttestUnlocked = (userId: string): boolean => {
  const allProgress = getAllProgress(userId);

  // All 4 lessons must be completed (pretest, all stages, posttest)
  return allProgress.every(
    (progress) =>
      progress.pretestCompleted &&
      progress.completedStages.length === 7 &&
      progress.posttestCompleted
  );
};

