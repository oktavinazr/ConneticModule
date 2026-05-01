import { supabase } from './supabase';
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
  globalPretestAnswers?: number[];
  globalPosttestCompleted: boolean;
  globalPosttestScore?: number;
  globalPosttestAnswers?: number[];
}

const LOCAL_LESSON_PROGRESS_KEY = 'connetic_lesson_progress';
const LOCAL_GLOBAL_PROGRESS_KEY = 'connetic_global_test_progress';

const progressCache = new Map<string, LessonProgress>();
const cacheKey = (userId: string, lessonId: string) => `${userId}:${lessonId}`;

const isPlainObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const shouldUseLocalProgressStore = (userId: string) => !isUuid(userId);

const canUseLocalProgressFallback = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;

  const candidate = error as {
    code?: string;
    details?: string;
    hint?: string;
    message?: string;
    status?: number;
  };

  const message = [
    candidate.message ?? '',
    candidate.details ?? '',
    candidate.hint ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return (
    candidate.code === '22P02' ||
    candidate.code === '42501' ||
    candidate.status === 400 ||
    candidate.status === 401 ||
    candidate.status === 403 ||
    candidate.status === 404 ||
    message.includes('invalid input syntax for type uuid') ||
    message.includes('row-level security') ||
    message.includes('permission denied') ||
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('does not exist') ||
    message.includes('relation')
  );
};

const readStorageRecord = <T extends Record<string, any>>(storageKey: string): T => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {} as T;
    }

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {} as T;

    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? (parsed as T) : ({} as T);
  } catch {
    return {} as T;
  }
};

const writeStorageRecord = (storageKey: string, value: Record<string, any>) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore local storage write failures and keep the in-memory cache working.
  }
};

const normalizeCompletedStages = (value: unknown): number[] =>
  Array.from(
    new Set(
      (Array.isArray(value) ? value : [])
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item >= 0),
    ),
  );

const normalizeStageAttempts = (value: unknown): Record<string, number> => {
  if (!isPlainObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, Number(item)] as const)
      .filter(([, item]) => Number.isFinite(item) && item >= 0),
  );
};

const normalizeStageSuccess = (value: unknown): Record<string, boolean> => {
  if (!isPlainObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, Boolean(item)]),
  );
};

const normalizeAnswers = (value: unknown): Record<string, any> =>
  isPlainObject(value) ? { ...value } : {};

const normalizeNumberArray = (value: unknown): number[] =>
  Array.isArray(value)
    ? value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item))
    : [];

const createDefaultLessonProgress = (userId: string, lessonId: string): LessonProgress => ({
  lessonId,
  userId,
  pretestCompleted: false,
  completedStages: [],
  posttestCompleted: false,
  answers: {},
  stageAttempts: {},
  stageSuccess: {},
});

const createDefaultGlobalTestProgress = (userId: string): GlobalTestProgress => ({
  userId,
  globalPretestCompleted: false,
  globalPretestAnswers: [],
  globalPosttestCompleted: false,
  globalPosttestAnswers: [],
});

const cloneLessonProgress = (progress: LessonProgress): LessonProgress => ({
  ...progress,
  completedStages: [...progress.completedStages],
  answers: { ...progress.answers },
  stageAttempts: { ...progress.stageAttempts },
  stageSuccess: { ...progress.stageSuccess },
});

const cloneGlobalTestProgress = (progress: GlobalTestProgress): GlobalTestProgress => ({
  ...progress,
  globalPretestAnswers: [...(progress.globalPretestAnswers ?? [])],
  globalPosttestAnswers: [...(progress.globalPosttestAnswers ?? [])],
});

const normalizeLessonProgress = (
  raw: Record<string, any> | null | undefined,
  userId: string,
  lessonId: string,
): LessonProgress => {
  const defaults = createDefaultLessonProgress(userId, lessonId);
  if (!raw) return defaults;

  return {
    lessonId,
    userId,
    pretestCompleted: Boolean(raw.pretest_completed ?? raw.pretestCompleted),
    pretestScore: raw.pretest_score ?? raw.pretestScore,
    completedStages: normalizeCompletedStages(
      raw.completed_stages ?? raw.completedStages,
    ),
    posttestCompleted: Boolean(raw.posttest_completed ?? raw.posttestCompleted),
    posttestScore: raw.posttest_score ?? raw.posttestScore,
    answers: normalizeAnswers(raw.answers),
    stageAttempts: normalizeStageAttempts(
      raw.stage_attempts ?? raw.stageAttempts,
    ),
    stageSuccess: normalizeStageSuccess(raw.stage_success ?? raw.stageSuccess),
  };
};

const normalizeGlobalTestProgress = (
  raw: Record<string, any> | null | undefined,
  userId: string,
): GlobalTestProgress => {
  const defaults = createDefaultGlobalTestProgress(userId);
  if (!raw) return defaults;

  return {
    userId,
    globalPretestCompleted: Boolean(
      raw.global_pretest_completed ?? raw.globalPretestCompleted,
    ),
    globalPretestScore: raw.global_pretest_score ?? raw.globalPretestScore,
    globalPretestAnswers: normalizeNumberArray(
      raw.global_pretest_answers ?? raw.globalPretestAnswers,
    ),
    globalPosttestCompleted: Boolean(
      raw.global_posttest_completed ?? raw.globalPosttestCompleted,
    ),
    globalPosttestScore: raw.global_posttest_score ?? raw.globalPosttestScore,
    globalPosttestAnswers: normalizeNumberArray(
      raw.global_posttest_answers ?? raw.globalPosttestAnswers,
    ),
  };
};

const getLocalLessonProgress = (
  userId: string,
  lessonId: string,
): LessonProgress | null => {
  const stored = readStorageRecord<Record<string, LessonProgress>>(
    LOCAL_LESSON_PROGRESS_KEY,
  );
  const raw = stored[cacheKey(userId, lessonId)];
  return raw ? normalizeLessonProgress(raw, userId, lessonId) : null;
};

const saveLocalLessonProgress = (progress: LessonProgress) => {
  const stored = readStorageRecord<Record<string, LessonProgress>>(
    LOCAL_LESSON_PROGRESS_KEY,
  );
  stored[cacheKey(progress.userId, progress.lessonId)] = cloneLessonProgress(
    progress,
  );
  writeStorageRecord(LOCAL_LESSON_PROGRESS_KEY, stored);
};

const getLocalGlobalTestProgress = (userId: string): GlobalTestProgress | null => {
  const stored = readStorageRecord<Record<string, GlobalTestProgress>>(
    LOCAL_GLOBAL_PROGRESS_KEY,
  );
  const raw = stored[userId];
  return raw ? normalizeGlobalTestProgress(raw, userId) : null;
};

const saveLocalGlobalTestProgress = (progress: GlobalTestProgress) => {
  const stored = readStorageRecord<Record<string, GlobalTestProgress>>(
    LOCAL_GLOBAL_PROGRESS_KEY,
  );
  stored[progress.userId] = cloneGlobalTestProgress(progress);
  writeStorageRecord(LOCAL_GLOBAL_PROGRESS_KEY, stored);
};

const upsertGlobalTestProgress = async (progress: GlobalTestProgress) => {
  saveLocalGlobalTestProgress(progress);

  if (shouldUseLocalProgressStore(progress.userId)) {
    return;
  }

  const payload = {
    user_id: progress.userId,
    global_pretest_completed: progress.globalPretestCompleted,
    global_pretest_score: progress.globalPretestScore ?? null,
    global_pretest_answers: progress.globalPretestAnswers ?? [],
    global_posttest_completed: progress.globalPosttestCompleted,
    global_posttest_score: progress.globalPosttestScore ?? null,
    global_posttest_answers: progress.globalPosttestAnswers ?? [],
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('global_test_progress')
    .upsert(payload, { onConflict: 'user_id' });

  if (error && !canUseLocalProgressFallback(error)) {
    console.error('[upsertGlobalTestProgress] error:', error);
  }
};

export const saveGlobalPretestResult = async (
  userId: string,
  score: number,
  answers: any[],
) => {
  const progress = await getGlobalTestProgress(userId);
  progress.globalPretestCompleted = true;
  progress.globalPretestScore = score;
  progress.globalPretestAnswers = normalizeNumberArray(answers);
  await upsertGlobalTestProgress(progress);
};

export const saveGlobalPosttestResult = async (
  userId: string,
  score: number,
  answers: any[],
) => {
  const progress = await getGlobalTestProgress(userId);
  progress.globalPosttestCompleted = true;
  progress.globalPosttestScore = score;
  progress.globalPosttestAnswers = normalizeNumberArray(answers);
  await upsertGlobalTestProgress(progress);
};

export const getGlobalTestProgress = async (
  userId: string,
): Promise<GlobalTestProgress> => {
  const localProgress =
    getLocalGlobalTestProgress(userId) ?? createDefaultGlobalTestProgress(userId);

  if (shouldUseLocalProgressStore(userId)) {
    return cloneGlobalTestProgress(localProgress);
  }

  const { data, error } = await supabase
    .from('global_test_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (canUseLocalProgressFallback(error)) {
      return cloneGlobalTestProgress(localProgress);
    }

    console.error('[getGlobalTestProgress] read error:', error);
    return cloneGlobalTestProgress(createDefaultGlobalTestProgress(userId));
  }

  if (!data) {
    return cloneGlobalTestProgress(localProgress);
  }

  const result = normalizeGlobalTestProgress(data, userId);
  saveLocalGlobalTestProgress(result);
  return cloneGlobalTestProgress(result);
};

export const getCachedProgress = (
  userId: string,
  lessonId: string,
): LessonProgress | null => {
  const cached = progressCache.get(cacheKey(userId, lessonId));
  return cached ? cloneLessonProgress(cached) : null;
};

export const getLessonProgress = async (
  userId: string,
  lessonId: string,
): Promise<LessonProgress> => {
  const key = cacheKey(userId, lessonId);
  const cached = progressCache.get(key);
  if (cached) return cloneLessonProgress(cached);

  const localProgress =
    getLocalLessonProgress(userId, lessonId) ??
    createDefaultLessonProgress(userId, lessonId);

  if (shouldUseLocalProgressStore(userId)) {
    progressCache.set(key, cloneLessonProgress(localProgress));
    return cloneLessonProgress(localProgress);
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (error) {
    if (canUseLocalProgressFallback(error)) {
      progressCache.set(key, cloneLessonProgress(localProgress));
      return cloneLessonProgress(localProgress);
    }

    console.error('[getLessonProgress] read error:', error);
    const defaults = createDefaultLessonProgress(userId, lessonId);
    progressCache.set(key, cloneLessonProgress(defaults));
    return cloneLessonProgress(defaults);
  }

  if (!data) {
    progressCache.set(key, cloneLessonProgress(localProgress));
    return cloneLessonProgress(localProgress);
  }

  const result = normalizeLessonProgress(data, userId, lessonId);
  saveLocalLessonProgress(result);
  progressCache.set(key, cloneLessonProgress(result));
  return cloneLessonProgress(result);
};

const upsertLessonProgress = async (progress: LessonProgress) => {
  const nextProgress = cloneLessonProgress(progress);
  progressCache.set(cacheKey(progress.userId, progress.lessonId), nextProgress);
  saveLocalLessonProgress(nextProgress);

  if (shouldUseLocalProgressStore(progress.userId)) {
    return;
  }

  const payload = {
    user_id: progress.userId,
    lesson_id: progress.lessonId,
    pretest_completed: progress.pretestCompleted,
    pretest_score: progress.pretestScore ?? null,
    completed_stages: normalizeCompletedStages(progress.completedStages),
    posttest_completed: progress.posttestCompleted,
    posttest_score: progress.posttestScore ?? null,
    answers: normalizeAnswers(progress.answers),
    stage_attempts: normalizeStageAttempts(progress.stageAttempts),
    stage_success: normalizeStageSuccess(progress.stageSuccess),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(payload, { onConflict: 'user_id,lesson_id' });

  if (error && !canUseLocalProgressFallback(error)) {
    console.error('[upsertLessonProgress] error:', error);
  }
};

export const savePretestResult = async (
  userId: string,
  lessonId: string,
  score: number,
  answers: any[],
) => {
  const key = cacheKey(userId, lessonId);
  const current =
    progressCache.get(key) ?? createDefaultLessonProgress(userId, lessonId);

  progressCache.set(key, {
    ...current,
    pretestCompleted: true,
    pretestScore: score,
    answers: { ...current.answers, pretest: answers },
  });

  const progress = await getLessonProgress(userId, lessonId);
  progress.pretestCompleted = true;
  progress.pretestScore = score;
  progress.answers.pretest = answers;
  await upsertLessonProgress(progress);
};

export const savePosttestResult = async (
  userId: string,
  lessonId: string,
  score: number,
  answers: any[],
) => {
  const progress = await getLessonProgress(userId, lessonId);
  progress.posttestCompleted = true;
  progress.posttestScore = score;
  progress.answers.posttest = answers;
  await upsertLessonProgress(progress);
};

export const saveReflectionResult = async (
  userId: string,
  lessonId: string,
  reflectionData: any,
) => {
  const progress = await getLessonProgress(userId, lessonId);
  progress.answers.main_reflection = reflectionData;
  await upsertLessonProgress(progress);
};

export const saveStageAttempt = async (
  userId: string,
  lessonId: string,
  stageIndex: number,
  isCorrect: boolean,
  attemptKey?: string,
): Promise<number> => {
  const progress = await getLessonProgress(userId, lessonId);
  const stageKey = attemptKey ?? `stage_${stageIndex}`;

  progress.stageAttempts[stageKey] = (progress.stageAttempts[stageKey] || 0) + 1;
  if (isCorrect) progress.stageSuccess[stageKey] = true;

  await upsertLessonProgress(progress);
  return progress.stageAttempts[stageKey];
};

export const saveStageProgress = async (
  userId: string,
  lessonId: string,
  stageIndex: number,
  answer: any,
) => {
  const progress = await getLessonProgress(userId, lessonId);
  const indexNum = Number(stageIndex);

  if (!progress.completedStages.includes(indexNum)) {
    progress.completedStages.push(indexNum);
  }

  progress.answers[`stage_${indexNum}`] = answer;
  await upsertLessonProgress(progress);
};

export const getAllProgress = async (userId: string): Promise<LessonProgress[]> => {
  const lessonIds = Object.keys(lessons);
  return Promise.all(lessonIds.map((lessonId) => getLessonProgress(userId, lessonId)));
};

export const isLessonUnlocked = async (
  userId: string,
  lessonId: string,
): Promise<boolean> => {
  const globalTest = await getGlobalTestProgress(userId);
  if (!globalTest.globalPretestCompleted) return false;
  if (lessonId === '1') return true;

  const prevLessonId = String(Number(lessonId) - 1);
  const prevProgress = await getLessonProgress(userId, prevLessonId);
  const prevLesson = lessons[prevLessonId];
  if (!prevLesson) return false;

  return (
    prevProgress.pretestCompleted &&
    prevProgress.completedStages.length >= prevLesson.stages.length &&
    prevProgress.posttestCompleted
  );
};

export const isGlobalPosttestUnlocked = async (
  userId: string,
): Promise<boolean> => {
  const allProgress = await getAllProgress(userId);
  const lessonIds = Object.keys(lessons);

  if (allProgress.length < lessonIds.length) return false;

  return allProgress.every((progress) => {
    const lesson = lessons[progress.lessonId];
    if (!lesson) return true;

    return (
      progress.pretestCompleted &&
      progress.completedStages.length >= lesson.stages.length &&
      progress.posttestCompleted
    );
  });
};
