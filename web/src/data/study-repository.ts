import {
  createInitialMastery,
  recordAttempt as recordMasteryAttempt,
  type MasteryState,
} from '../domain/mastery'

const DEFAULT_STORAGE_KEY = 'szu-degree-english.study-state.v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface AttemptEvent {
  id: string
  questionId: string
  answer: string
  correct: boolean
  guessed: boolean
  createdAt: string
}

export interface Draft {
  questionId: string
  content: string
  updatedAt: string
}

export interface DueReview {
  questionId: string
  mastery: MasteryState
}

export interface PendingEvent {
  id: string
  type: 'attempt' | 'draft'
  payload: AttemptEvent | Draft
}

export interface DashboardSnapshot {
  attemptCount: number
  correctCount: number
  dueReviewCount: number
  pendingCount: number
}

interface PersistedStudyState {
  attempts: AttemptEvent[]
  drafts: Record<string, Draft>
  masteryByQuestion: Record<string, MasteryState>
  pending: PendingEvent[]
}

function createEmptyState(): PersistedStudyState {
  return {
    attempts: [],
    drafts: {},
    masteryByQuestion: {},
    pending: [],
  }
}

function isPersistedState(value: unknown): value is PersistedStudyState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<PersistedStudyState>
  return (
    Array.isArray(candidate.attempts) &&
    Array.isArray(candidate.pending) &&
    typeof candidate.drafts === 'object' &&
    candidate.drafts !== null &&
    typeof candidate.masteryByQuestion === 'object' &&
    candidate.masteryByQuestion !== null
  )
}

export class LocalStudyRepository {
  private readonly storage: StorageLike
  private readonly storageKey: string

  constructor(storage: StorageLike, storageKey = DEFAULT_STORAGE_KEY) {
    this.storage = storage
    this.storageKey = storageKey
  }

  recordAttempt(event: AttemptEvent): MasteryState {
    const state = this.read()
    const attemptedAt = new Date(event.createdAt)
    const previousMastery = state.masteryByQuestion[event.questionId] ?? createInitialMastery()
    const mastery = recordMasteryAttempt(previousMastery, event.correct, attemptedAt, event.guessed)

    state.attempts.push(event)
    state.masteryByQuestion[event.questionId] = mastery
    state.pending.push({ id: event.id, type: 'attempt', payload: event })
    this.write(state)

    return mastery
  }

  saveDraft(draft: Draft): void {
    const state = this.read()
    state.drafts[draft.questionId] = draft
    state.pending.push({
      id: `draft:${draft.questionId}:${draft.updatedAt}`,
      type: 'draft',
      payload: draft,
    })
    this.write(state)
  }

  getDraft(questionId: string): Draft | undefined {
    return this.read().drafts[questionId]
  }

  getMastery(questionId: string): MasteryState | undefined {
    return this.read().masteryByQuestion[questionId]
  }

  listDueReviews(now: Date): DueReview[] {
    const nowIso = now.toISOString()
    return Object.entries(this.read().masteryByQuestion)
      .filter(([, mastery]) => mastery.nextReviewAt !== undefined && mastery.nextReviewAt <= nowIso)
      .map(([questionId, mastery]) => ({ questionId, mastery }))
  }

  listPending(): PendingEvent[] {
    return this.read().pending
  }

  flushPending(eventIds: string[]): void {
    const idsToRemove = new Set(eventIds)
    const state = this.read()
    state.pending = state.pending.filter((event) => !idsToRemove.has(event.id))
    this.write(state)
  }

  getDashboard(now = new Date()): DashboardSnapshot {
    const state = this.read()
    return {
      attemptCount: state.attempts.length,
      correctCount: state.attempts.filter((attempt) => attempt.correct).length,
      dueReviewCount: this.listDueReviews(now).length,
      pendingCount: state.pending.length,
    }
  }

  private read(): PersistedStudyState {
    const raw = this.storage.getItem(this.storageKey)

    if (!raw) {
      return createEmptyState()
    }

    try {
      const parsed: unknown = JSON.parse(raw)
      return isPersistedState(parsed) ? parsed : createEmptyState()
    } catch {
      return createEmptyState()
    }
  }

  private write(state: PersistedStudyState): void {
    this.storage.setItem(this.storageKey, JSON.stringify(state))
  }
}
