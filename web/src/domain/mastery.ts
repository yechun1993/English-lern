export type MasteryStatus = 'new' | 'learning' | 'review'

export interface MasteryState {
  status: MasteryStatus
  correctStreak: number
  intervalDays: number
  nextReviewAt?: string
  lastAttemptAt?: string
}

export function createInitialMastery(): MasteryState {
  return {
    status: 'new',
    correctStreak: 0,
    intervalDays: 0,
  }
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

export function recordAttempt(state: MasteryState, correct: boolean, attemptedAt: Date): MasteryState {
  const correctStreak = correct ? state.correctStreak + 1 : 0
  const status: MasteryStatus = correctStreak >= 2 ? 'review' : 'learning'
  const intervalDays = status === 'review' ? Math.max(3, state.intervalDays * 2) : 1

  return {
    status,
    correctStreak,
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
