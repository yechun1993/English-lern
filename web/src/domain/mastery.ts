export type MasteryStatus = 'new' | 'learning' | 'mastered'

export interface MasteryState {
  status: MasteryStatus
  correctStreak: number
  correctReviewDays: string[]
  intervalDays: number
  nextReviewAt?: string
  lastAttemptAt?: string
}

export function createInitialMastery(): MasteryState {
  return {
    status: 'new',
    correctStreak: 0,
    correctReviewDays: [],
    intervalDays: 0,
  }
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

function toReviewDay(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function recordAttempt(
  state: MasteryState,
  correct: boolean,
  attemptedAt: Date,
  guessed = false,
): MasteryState {
  if (!correct || guessed) {
    const intervalDays = 1
    return {
      status: 'learning',
      correctStreak: 0,
      correctReviewDays: [],
      intervalDays,
      lastAttemptAt: attemptedAt.toISOString(),
      nextReviewAt: addDays(attemptedAt, intervalDays).toISOString(),
    }
  }

  const reviewDay = toReviewDay(attemptedAt)
  const correctReviewDays = state.correctReviewDays.includes(reviewDay)
    ? state.correctReviewDays
    : [...state.correctReviewDays, reviewDay]
  const status: MasteryStatus = correctReviewDays.length >= 3 ? 'mastered' : 'learning'
  const intervalDays = status === 'mastered' ? 14 : correctReviewDays.length === 2 ? 3 : 1

  return {
    status,
    correctStreak: correctReviewDays.length,
    correctReviewDays,
    intervalDays,
    lastAttemptAt: attemptedAt.toISOString(),
    nextReviewAt: addDays(attemptedAt, intervalDays).toISOString(),
  }
}

export const MODULE_KEYS = ['grammar', 'cloze', 'reading', 'translation', 'writing'] as const

export type ModuleKey = (typeof MODULE_KEYS)[number]

export interface ModuleAttempts {
  correct: number
  total: number
}

export interface ReadinessResult {
  moduleScores: Record<ModuleKey, number>
  predictedScore: number
  passingScore: number
  safetyTargetScore: number
  isOnTrack: boolean
  pointsToPass: number
}

const POINTS_PER_MODULE = 20

function toModuleScore(attempts?: ModuleAttempts): number {
  if (!attempts || attempts.total <= 0) {
    return 0
  }

  const correct = Math.min(Math.max(attempts.correct, 0), attempts.total)
  return Math.round((correct / attempts.total) * POINTS_PER_MODULE)
}

export function calculateReadiness(
  attempts: Partial<Record<ModuleKey, ModuleAttempts>>,
): ReadinessResult {
  const moduleScores = {
    grammar: toModuleScore(attempts.grammar),
    cloze: toModuleScore(attempts.cloze),
    reading: toModuleScore(attempts.reading),
    translation: toModuleScore(attempts.translation),
    writing: toModuleScore(attempts.writing),
  }
  const predictedScore = MODULE_KEYS.reduce((total, key) => total + moduleScores[key], 0)
  const passingScore = 60

  return {
    moduleScores,
    predictedScore,
    passingScore,
    safetyTargetScore: 63,
    isOnTrack: predictedScore >= passingScore,
    pointsToPass: Math.max(0, passingScore - predictedScore),
  }
}
