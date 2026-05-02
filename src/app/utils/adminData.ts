import { supabase } from './supabase';
import { lessons, globalPretest, globalPosttest, type Stage, type TestQuestion } from '../data/lessons';

const ADMIN_QUESTIONS_KEY = 'admin-questions-override';
const ADMIN_STAGES_KEY = 'admin-stages-override';

// ── Supabase DB helpers ────────────────────────────────────────

interface DbQuestion {
  test_key: string;
  question_index: number;
  question: string;
  options: string[];
  correct_answer: number;
}

async function fetchQuestionsFromDb(key: string): Promise<TestQuestion[] | null> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('question_index, question, options, correct_answer')
      .eq('test_key', key)
      .order('question_index', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map(row => ({
      question: row.question,
      options: row.options,
      correctAnswer: row.correct_answer,
    }));
  } catch {
    return null;
  }
}

async function upsertQuestionsToDb(key: string, questions: TestQuestion[]): Promise<void> {
  // Delete existing rows for this key, then insert fresh batch
  await supabase.from('questions').delete().eq('test_key', key);
  if (questions.length === 0) return;
  const rows: DbQuestion[] = questions.map((q, i) => ({
    test_key: key,
    question_index: i,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
  }));
  await supabase.from('questions').insert(rows);
}

async function deleteQuestionsFromDb(key: string): Promise<void> {
  await supabase.from('questions').delete().eq('test_key', key);
}

// ── Local storage helpers ──────────────────────────────────────

type QuestionStore = Record<string, TestQuestion[]>;

function loadQuestions(): QuestionStore {
  try { return JSON.parse(localStorage.getItem(ADMIN_QUESTIONS_KEY) || '{}'); }
  catch { return {}; }
}

function persistQuestions(store: QuestionStore): void {
  localStorage.setItem(ADMIN_QUESTIONS_KEY, JSON.stringify(store));
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Load questions for a test key — tries Supabase first, then localStorage
 * override, then hardcoded defaults. Used by student-facing pages.
 */
export async function loadTestQuestions(key: string): Promise<TestQuestion[]> {
  const fromDb = await fetchQuestionsFromDb(key);
  if (fromDb) return fromDb;
  const store = loadQuestions();
  if (store[key]) return store[key].map(q => ({ ...q }));
  return getDefaultTestQuestions(key);
}

/**
 * Pull Supabase data into localStorage cache so the sync getter can read it.
 * Call this on admin component mount for each test key.
 */
export async function syncQuestionsFromSupabase(key: string): Promise<void> {
  const fromDb = await fetchQuestionsFromDb(key);
  const store = loadQuestions();
  if (fromDb) {
    store[key] = fromDb;
  } else {
    delete store[key];
  }
  persistQuestions(store);
}

/** Sync read from localStorage cache (assumes pre-synced). Used after syncQuestionsFromSupabase. */
export function getAdminTestQuestions(key: string): TestQuestion[] {
  const store = loadQuestions();
  return store[key] ? store[key].map(q => ({ ...q })) : getDefaultTestQuestions(key);
}

export function getDefaultTestQuestions(key: string): TestQuestion[] {
  if (key === 'global-pretest') return globalPretest.questions.map(q => ({ ...q }));
  if (key === 'global-posttest') return globalPosttest.questions.map(q => ({ ...q }));
  const m = key.match(/^lesson_(.+)_(pretest|posttest)$/);
  if (m) {
    const lesson = lessons[m[1]];
    if (lesson) return lesson[m[2] as 'pretest' | 'posttest'].questions.map(q => ({ ...q }));
  }
  return [];
}

export async function saveAdminTestQuestions(key: string, questions: TestQuestion[]): Promise<void> {
  await upsertQuestionsToDb(key, questions);
  const store = loadQuestions();
  store[key] = questions;
  persistQuestions(store);
}

export async function resetAdminTestQuestions(key: string): Promise<void> {
  await deleteQuestionsFromDb(key);
  const store = loadQuestions();
  delete store[key];
  persistQuestions(store);
}

export function isTestOverridden(key: string): boolean {
  return key in loadQuestions();
}

// ── Stage Content Override ─────────────────────────────────────

export interface StageOverride {
  // Basic
  title?: string;
  description?: string;

  // Constructivism
  apersepsi?: string;
  question?: string;
  options?: Array<{ id: string; text: string }>;
  correctAnswer?: string;
  feedback?: { correct: string; incorrect: string };

  // Inquiry
  explorationSections?: Array<{ id: string; title: string; content: string; example?: string }>;
  groupItems?: Array<{ id: string; text: string; correctGroup: string }>;

  // Questioning
  teacherQuestion?: string;
  scenario?: string;
  whyQuestion?: string;
  hint?: string;
  reasonOptions?: Array<{ id: string; text: string; isCorrect: boolean; feedback: string }>;
  questionBank?: Array<{ id: string; text: string; response: string }>;

  // Learning Community
  matchingPairs?: Array<{ left: string; right: string }>;
  caseScenario?: {
    id?: string;
    title: string;
    description?: string;
    scenario?: string;
    question: string;
    options: Array<{ id: string; text: string; description?: string; isCorrect?: boolean; feedback?: string }>;
  };

  // Modeling
  steps?: Array<{ id: string; title: string; description: string; visual: string }>;
  items?: Array<{ id: string; text: string; order: number }>;

  // Reflection
  reflectionPrompts?: string[];
  essayReflection?: { materialSummaryPrompt: string; easyPartPrompt: string; hardPartPrompt: string };

  // Authentic Assessment
  branchingScenario?: {
    context: string;
    initialQuestion: string;
    focusAreas?: string[];
    choices: Array<{
      id: string;
      text: string;
      isOptimal: boolean;
      consequence: string;
      followUpQuestion?: string;
      followUpChoices?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        explanation: string;
      }>;
    }>;
    finalEvaluation: string;
  };
}

type StageStore = Record<string, Record<number, StageOverride>>;

function loadStages(): StageStore {
  try { return JSON.parse(localStorage.getItem(ADMIN_STAGES_KEY) || '{}'); }
  catch { return {}; }
}

function persistStages(store: StageStore): void {
  localStorage.setItem(ADMIN_STAGES_KEY, JSON.stringify(store));
}

export function getStageOverride(lessonId: string, stageIndex: number): StageOverride {
  const store = loadStages();
  return store[lessonId]?.[stageIndex] ?? {};
}

export function saveStageOverride(lessonId: string, stageIndex: number, override: StageOverride): void {
  const store = loadStages();
  if (!store[lessonId]) store[lessonId] = {};
  store[lessonId][stageIndex] = override;
  persistStages(store);
}

export function resetStageOverride(lessonId: string, stageIndex: number): void {
  const store = loadStages();
  if (store[lessonId]) {
    delete store[lessonId][stageIndex];
    if (Object.keys(store[lessonId]).length === 0) delete store[lessonId];
  }
  persistStages(store);
}

export function hasStageOverride(lessonId: string, stageIndex: number): boolean {
  const o = getStageOverride(lessonId, stageIndex);
  return Object.keys(o).length > 0;
}

/** Merge static stage data with any stored override — override fields win. */
export function getEffectiveStage(stage: Stage, override: StageOverride): Stage {
  return {
    ...stage,
    ...(override.title !== undefined && { title: override.title }),
    ...(override.description !== undefined && { description: override.description }),
    ...(override.apersepsi !== undefined && { apersepsi: override.apersepsi }),
    ...(override.question !== undefined && { question: override.question }),
    ...(override.options !== undefined && { options: override.options }),
    ...(override.correctAnswer !== undefined && { correctAnswer: override.correctAnswer }),
    ...(override.feedback !== undefined && { feedback: override.feedback }),
    ...(override.explorationSections !== undefined && { explorationSections: override.explorationSections }),
    ...(override.groupItems !== undefined && { groupItems: override.groupItems }),
    ...(override.teacherQuestion !== undefined && { teacherQuestion: override.teacherQuestion }),
    ...(override.scenario !== undefined && { scenario: override.scenario }),
    ...(override.whyQuestion !== undefined && { whyQuestion: override.whyQuestion }),
    ...(override.hint !== undefined && { hint: override.hint }),
    ...(override.reasonOptions !== undefined && { reasonOptions: override.reasonOptions }),
    ...(override.questionBank !== undefined && { questionBank: override.questionBank }),
    ...(override.matchingPairs !== undefined && { matchingPairs: override.matchingPairs }),
    ...(override.caseScenario !== undefined && { caseScenario: override.caseScenario }),
    ...(override.steps !== undefined && { steps: override.steps }),
    ...(override.items !== undefined && { items: override.items }),
    ...(override.reflectionPrompts !== undefined && { reflectionPrompts: override.reflectionPrompts }),
    ...(override.essayReflection !== undefined && { essayReflection: override.essayReflection }),
    ...(override.branchingScenario !== undefined && { branchingScenario: override.branchingScenario }),
  };
}
